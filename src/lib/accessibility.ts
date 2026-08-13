//Lógica pura de fuentes, tamaños y localStorage
export type FontOption = 'jakarta' | 'atkinson' | 'inter';
export type TextSizeOption = 'normal' | 'grande' | 'maximo';

export function applyAccessibilitySettings(font: FontOption, size: TextSizeOption) {
  const root = document.documentElement;

  // 1. Aplicar clase de fuente
  root.classList.remove('font-jakarta', 'font-atkinson', 'font-inter');
  root.classList.add(`font-${font}`);

  // 2. Ajustar el tamaño base de la letra (rem)
  if (size === 'normal') {
    root.style.fontSize = '16px';
  } else if (size === 'grande') {
    root.style.fontSize = '18px'; // Aumenta un 12.5% todo el texto
  } else if (size === 'maximo') {
    root.style.fontSize = '20px'; // Aumenta un 25% ideal para 65+ años
  }

  // Guardar preferencias
  localStorage.setItem('app_font', font);
  localStorage.setItem('app_text_size', size);
}

export function getSavedAccessibilitySettings() {
  const font = (localStorage.getItem('app_font') as FontOption) || 'jakarta';
  const size = (localStorage.getItem('app_text_size') as TextSizeOption) || 'normal';
  return { font, size };
}