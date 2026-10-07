//extos amigable e intuitivos (para usuarios de 30 a 70 años)
export const friendlyTexts = {
  headerGreeting: (name: string) => `¡Hola, ${name}! Tu casa está funcionando bien.`,
  powerTodayBanner: {
    title: "Consumo acumulado hoy",
    subtext: "Equivale aproximadamente a",
    unit: "kWh (Unidades de energía)"
  },
  timeSlots: {
    valley: {
      label: "🌿 Hora de Ahorro",
      tooltip: "La tarifa de luz es más económica en este horario. ¡Buen momento para encender artefactos de alto consumo!"
    },
    peak: {
      label: "⚠️ Hora de Mayor Demanda",
      tooltip: "Durante esta franja la luz cuesta un poco más. Si podés, evitá usar varios artefactos a la vez."
    }
  },
  deviceStatuses: {
    active: "Encendido y consumiendo",
    standby: "Gasto en espera (Standby)",
    off: "Apagado"
  }
};