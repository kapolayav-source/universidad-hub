import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  Sparkles,
  MessageCircle,
  FolderGit2,
  GraduationCap,
  Library,
  Plus,
  Users,
  LogOut,
  Shield,
} from 'lucide-react';
import { Course, UserRole } from '../../types/academic';

interface SidebarProps {
  currentView: 'dashboard' | 'course' | 'tasks' | 'schedule' | 'library';
  selectedCourseId: string | null;
  courses: Course[];
  semesterNumber: number;
  userRole: UserRole;
  onSelectView: (view: 'dashboard' | 'tasks' | 'schedule' | 'library') => void;
  onSelectCourse: (courseId: string) => void;
  onAddCourseClick: () => void;
  onOpenCurriculumExplorer: () => void;
  onOpenStudentManagement?: () => void;
  onSignOut: () => void;
  totalCredits: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedCourseId,
  courses,
  semesterNumber,
  userRole,
  onSelectView,
  onSelectCourse,
  onAddCourseClick,
  onOpenCurriculumExplorer,
  onOpenStudentManagement,
  onSignOut,
  totalCredits,
}) => {
  const isAdmin = userRole === 'admin';

  return (
    <aside
      aria-label="Navegación principal"
      className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex flex-col justify-between p-4 overflow-y-auto"
    >
      <div className="space-y-5">
        {/* Navegación Principal */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navegación
          </span>
          <button
            onClick={() => onSelectView('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Panel Principal</span>
          </button>

          <button
            onClick={() => onSelectView('library')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'library'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Library className="w-4 h-4" />
            <div className="flex items-center justify-between flex-1">
              <span>Biblioteca & Archivos</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                {isAdmin ? 'Gestión' : 'Consulta'}
              </span>
            </div>
          </button>

          <button
            onClick={() => onSelectView('schedule')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'schedule'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Horarios & Calendario</span>
          </button>

          <button
            onClick={() => onSelectView('tasks')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentView === 'tasks'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tareas & Evaluaciones</span>
          </button>

          <button
            onClick={onOpenCurriculumExplorer}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Explorar Malla (10 Ciclos)</span>
          </button>

          {/* Acceso a Gestión de Alumnos exclusivo para el Administrador */}
          {isAdmin && onOpenStudentManagement && (
            <button
              onClick={onOpenStudentManagement}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50/60 hover:bg-purple-100/70 transition-all cursor-pointer border border-purple-200/60"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Gestión de Alumnos</span>
            </button>
          )}
        </div>

        {/* Cursos del Semestre */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cursos ({semesterNumber}.º Ciclo)
            </span>
            {/* Solo Administrador Global puede añadir asignaturas */}
            {isAdmin && (
              <button
                onClick={onAddCourseClick}
                className="text-[10px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-0.5 cursor-pointer"
                title="Crear nueva asignatura"
              >
                <Plus className="w-3 h-3" />
                <span>Nuevo</span>
              </button>
            )}
          </div>

          <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
            {courses.map((course) => {
              const isSelected = currentView === 'course' && selectedCourseId === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-semibold border-l-4'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={{
                    borderLeftColor: isSelected ? course.colorHex : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: course.colorHex }}
                    />
                    <span className="truncate">{course.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 font-mono shrink-0 ml-1">
                    {course.credits}cr
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumen Académico del Semestre */}
        <div className="p-3 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-800 text-xs font-bold mb-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Carga Académica</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Créditos</span>
              <span className="text-base font-extrabold text-blue-600">{totalCredits}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Materias</span>
              <span className="text-base font-extrabold text-slate-900">{courses.length}</span>
            </div>
          </div>
        </div>

        {/* Módulos Planificados en Roadmap */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Próximos Módulos
          </span>
          <div className="px-3 py-1 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Google Classroom</span>
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">Fase 5</span>
          </div>
          <div className="px-3 py-1 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Alerts</span>
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">Fase 6</span>
          </div>
          <div className="px-3 py-1 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tutor IA RAG</span>
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">Fase 7</span>
          </div>
        </div>
      </div>

      {/* Footer con Botón de Cerrar Sesión */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 rounded-xl transition-colors cursor-pointer border border-red-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
        <div className="text-[10px] text-slate-400 text-center">
          {isAdmin ? '🛡️ Sesión Administrador Global' : '🎓 Sesión de Alumno Oficial'}
        </div>
      </div>
    </aside>
  );
};
