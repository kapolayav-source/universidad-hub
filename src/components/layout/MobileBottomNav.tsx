import React from 'react';
import { LayoutDashboard, Library, Calendar, CheckSquare, Layers } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'dashboard' | 'course' | 'tasks' | 'schedule' | 'library';
  onSelectView: (view: 'dashboard' | 'tasks' | 'schedule' | 'library') => void;
  onOpenHierarchyModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenHierarchyModal,
}) => {
  return (
    <nav aria-label="Navegación móvil inferior" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onSelectView('dashboard')}
        className={`min-h-[48px] flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Inicio</span>
      </button>

      <button
        onClick={() => onSelectView('library')}
        className={`min-h-[48px] flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'library' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Library className="w-5 h-5 mb-0.5" />
        <span>Biblioteca</span>
      </button>

      <button
        onClick={() => onSelectView('schedule')}
        className={`min-h-[48px] flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'schedule' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Calendar className="w-5 h-5 mb-0.5" />
        <span>Horarios</span>
      </button>

      <button
        onClick={() => onSelectView('tasks')}
        className={`min-h-[48px] flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
          currentView === 'tasks' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <CheckSquare className="w-5 h-5 mb-0.5" />
        <span>Tareas</span>
      </button>

      <button
        onClick={onOpenHierarchyModal}
        className="min-h-[48px] flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span>Ciclo</span>
      </button>
    </nav>
  );
};
