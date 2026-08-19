// Componente visual con los botones de fuente/tamaño
// src/components/AccessibilitySettings.tsx

import { useState, useEffect } from "react";
import { Type, ZoomIn } from "lucide-react";
import { 
  applyAccessibilitySettings, 
  getSavedAccessibilitySettings, 
  FontOption, 
  TextSizeOption 
} from "@/lib/accessibility";

export function AccessibilitySettings() {
  const [fontOption, setFontOption] = useState<FontOption>('jakarta');
  const [textSizeOption, setTextSizeOption] = useState<TextSizeOption>('normal');

  useEffect(() => {
    const saved = getSavedAccessibilitySettings();
    setFontOption(saved.font);
    setTextSizeOption(saved.size);
    applyAccessibilitySettings(saved.font, saved.size);
  }, []);

  const handleFontChange = (newFont: FontOption) => {
    setFontOption(newFont);
    applyAccessibilitySettings(newFont, textSizeOption);
  };

  const handleSizeChange = (newSize: TextSizeOption) => {
    setTextSizeOption(newSize);
    applyAccessibilitySettings(fontOption, newSize);
  };

  return (
    <section className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6">
      <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
        <Type className="size-5 text-amber-400" />
        Accesibilidad y Tamaño de Letra
      </h2>

      {/* Tamaño de texto */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <ZoomIn className="size-4 text-amber-400" /> Tamaño del texto
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "normal", label: "Normal (100%)", desc: "Vista Estándar" },
            { id: "grande", label: "Grande (112%)", desc: "Cómodo" },
            { id: "maximo", label: "Muy Grande (125%)", desc: "Lectura Fácil (65+)" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSizeChange(item.id as TextSizeOption)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                textSizeOption === item.id
                  ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-950/30"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="text-sm font-bold">{item.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tipografía */}
      <div className="space-y-3 border-t border-slate-800/80 pt-4">
        <label className="text-sm font-semibold text-slate-200">Tipo de Tipografía</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "jakarta", label: "Plus Jakarta", desc: "Moderna y legible" },
            { id: "atkinson", label: "Atkinson Hyperlegible", desc: "Para visión reducida" },
            { id: "inter", label: "Inter", desc: "Estándar limpia" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFontChange(item.id as FontOption)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                fontOption === item.id
                  ? "bg-amber-500/15 border-amber-500 text-amber-300 shadow-md shadow-amber-950/30"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="text-sm font-bold">{item.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}