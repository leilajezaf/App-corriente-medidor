//categorías de electrodomésticos y objetos de consumo energético
import React from 'react';

export interface CategoryTab {
  id: string;
  label: string;
}

interface ApplianceTabsProps {
  categories?: CategoryTab[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

// Categorías pensadas para discriminar gastos por tipo de electrodoméstico
const DEFAULT_CATEGORIES: CategoryTab[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'climatizacion', label: 'Climatización' },
  { id: 'cocina', label: 'Cocina y Heladera' },
  { id: 'iluminacion', label: 'Iluminación' },
  { id: 'entretenimiento', label: 'TV y Redes' },
  { id: 'lavado', label: 'Lavarropas' },
];

export const ApplianceTabs: React.FC<ApplianceTabsProps> = ({
  categories = DEFAULT_CATEGORIES,
  activeCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 my-2">
      <div className="flex items-center gap-6 min-w-max">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-start focus:outline-none group cursor-pointer"
            >
              <span
                className={`text-sm transition-colors duration-200 ${
                  isActive
                    ? 'font-bold text-slate-800'
                    : 'font-medium text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {cat.label}
              </span>

              {/* Indicador inferior Turquesa fiel al diseño */}
              <div
                 className={`h-1 rounded-full transition-all duration-300 mt-1 ${                   isActive ? 'w-5 bg-[#42C2C1]' : 'w-0 bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ApplianceTabs;