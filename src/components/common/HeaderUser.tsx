import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface HeaderUserProps {
  userName?: string;
  userAvatarUrl?: string;
  onOpenMenu?: () => void;
}

export const HeaderUser: React.FC<HeaderUserProps> = ({
  userName = 'Jeffery Rawlings',
  userAvatarUrl,
  onOpenMenu,
}) => {
  return (
    <div className="flex items-center justify-between w-full py-2 mb-2">
      <div className="flex items-center gap-3">
        {/* Avatar o Círculo de Usuario */}
        {userAvatarUrl ? (
          <img
            src={userAvatarUrl}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {userName.charAt(0)}
          </div>
        )}

        {/* Saludo y Nombre */}
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium">
            Welcome Home
          </span>
          <h2 className="text-base font-bold text-slate-800 leading-tight">
            {userName}
          </h2>
        </div>
      </div>

      {/* Botón de Menú/Grilla en Turquesa */}
      <button
        onClick={onOpenMenu}
        className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#42C2C1] shadow-sm hover:shadow-md transition-all duration-200"
        aria-label="Menú principal"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
};

export default HeaderUser;