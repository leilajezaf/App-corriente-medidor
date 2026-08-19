#!/usr/bin/env python3
"""
Analizador y auditor de datos para la App de Medidor de Corriente.
Soporta archivos .json locales y endpoints HTTP.
"""

import sys
import json
import os
import statistics

try:
    import requests
except ImportError:
    print("ERROR: Ejecuta 'pip install requests' para continuar.")
    sys.exit(1)

DEFAULT_HEADERS = {"User-Agent": "CurrentMeterSkill/1.0", "Accept": "application/json"}
VOLTAGE_NOMINAL = 220.0  # Tensión fija para cálculo de Vatios (220V)
MAX_SAFE_AMPS = 16.0     # Umbral de seguridad (térmica estándar de 16A)


def load_payload(target: str) -> tuple[dict | list | None, str | None]:
    """Carga los datos desde un archivo local .json o una URL de API."""
    if os.path.isfile(target):
        try:
            with open(target, 'r', encoding='utf-8') as f:
                return json.load(f), None
        except Exception as e:
            return None, f"Error al leer archivo local: {str(e)}"
    
    try:
        response = requests.get(target, headers=DEFAULT_HEADERS, timeout=15)
        if response.status_code == 200:
            return response.json(), None
        return None, f"Respuesta HTTP {response.status_code}"
    except Exception as e:
        return None, f"Error al conectar con la API: {str(e)}"


def fetch_realtime_reading(target: str) -> dict:
    """Obtiene la lectura actual en Amperios y calcula potencia estimada."""
    result = {
        "time": None,
        "amps": 0.0,
        "estimated_watts": 0.0,
        "kwh": 0.0,
        "alerts": [],
        "errors": [],
    }

    data, err = load_payload(target)
    if err:
        result["errors"].append(err)
        return result

    if isinstance(data, dict):
        result["time"] = data.get("time", "Desconocido")
        result["amps"] = float(data.get("amps", 0.0))
        result["kwh"] = float(data.get("kwh", 0.0))
        result["estimated_watts"] = round(result["amps"] * VOLTAGE_NOMINAL, 2)

        if result["amps"] > MAX_SAFE_AMPS:
            result["alerts"].append(
                f"SOBRECARGA: {result['amps']}A supera el límite de seguridad de {MAX_SAFE_AMPS}A"
            )
    else:
        result["errors"].append("Se esperaba un objeto JSON para tiempo real")

    return result


def analyze_history_data(target: str) -> dict:
    """Analiza arreglos de historial (hourlyData, dailyData, etc)."""
    result = {
        "sample_count": 0,
        "avg_amps": 0.0,
        "max_peak_amps": 0.0,
        "total_kwh_accumulated": 0.0,
        "high_consumption_peaks": [],
        "errors": [],
    }

    data, err = load_payload(target)
    if err:
        result["errors"].append(err)
        return result

    items = data if isinstance(data, list) else [data]

    if items:
        amps_list = [item.get("amps", 0.0) for item in items if isinstance(item, dict) and "amps" in item]
        kwh_list = [item.get("kwh", 0.0) for item in items if isinstance(item, dict) and "kwh" in item]

        if amps_list:
            result["sample_count"] = len(amps_list)
            result["avg_amps"] = round(statistics.mean(amps_list), 2)
            result["max_peak_amps"] = round(max(amps_list), 2)
        
        if kwh_list:
            result["total_kwh_accumulated"] = round(sum(kwh_list), 3)

        for item in items:
            if isinstance(item, dict):
                a = item.get("amps", 0.0)
                if result["avg_amps"] > 0 and a > (result["avg_amps"] * 1.8):
                    result["high_consumption_peaks"].append({
                        "label": item.get("time") or item.get("day") or item.get("month"),
                        "amps": a,
                        "estimated_watts": round(a * VOLTAGE_NOMINAL, 2),
                        "reason": f"Pico notable: {a}A frente al promedio de {result['avg_amps']}A"
                    })
    else:
        result["errors"].append("Lista de datos vacía o inválida")

    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python power_meter_skill.py <archivo.json_o_url> [modo]")
        print("Modos: realtime, history (por defecto), full")
        sys.exit(1)

    target = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "history"

    if mode == "realtime":
        output = fetch_realtime_reading(target)
    elif mode == "history":
        output = analyze_history_data(target)
    elif mode == "full":
        output = {
            "realtime": fetch_realtime_reading(target),
            "history_analysis": analyze_history_data(target)
        }
    else:
        print(f"Modo no reconocido: {mode}")
        sys.exit(1)

    print(json.dumps(output, indent=2, ensure_ascii=False))