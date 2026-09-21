import React, { useState } from 'react';
import {
  GraduationCap,
  ChevronRight,
  Search,
  User,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { University, Faculty, Career, Semester, UserProfile, UserRole } from '../../types/academic';

interface NavbarProps {
  university: University;
  faculty: Faculty;
  career: Career;
  semester: Semester;
  user: UserProfile;
  onOpenHierarchyModal: () => void;
  onSelectRole: (role: UserRole) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  university,
  faculty,
  career,
  semester,
  user,
  onOpenHierarchyModal,
  onSelectRole,
  searchQuery,
  onSearchChange,
  onMobileMenuToggle,
  isMobileMenuOpen,
  onNavigateHome,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Estudiante (Vista regular)' },
    { value: 'teacher', label: 'Profesor (Gestión de curso)' },
    { value: 'admin', label: 'Administrador Universitario' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo y Botón Inicio */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onMobileMenuToggle}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                  Universidad Hub
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-600">
                  Plataforma Académica
                </span>
              </div>
            </button>
          </div>

          {/* Breadcrumb de Jerarquía Académica (Clicable para abrir selector) */}
          <nav aria-label="Ruta de navegación" className="hidden lg:flex items-center text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <button
              onClick={onOpenHierarchyModal}
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer group"
              title="Cambiar facultad o carrera"
            >
              <span className="font-semibold text-slate-800 group-hover:text-blue-600">{faculty.code}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-700">{career.name}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-md font-semibold text-[11px]">
                {semester.number}.º Semestre
              </span>
            </button>
          </nav>

          {/* Buscador Rápido */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar cursos, clases, tareas o temas..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Perfil & Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenHierarchyModal}
              className="lg:hidden text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg font-semibold border border-blue-200 cursor-pointer"
            >
              {semester.number}.º Semestre
            </button>

            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[130px]">
                    {user.fullName}
                  </p>
                  <span className="text-[10px] text-blue-600 font-medium capitalize">
                    {user.role}
                  </span>
                </div>
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                />
              </button>

              {/* Menú de Roles y Perfil */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-600">
                      <span>{university.name}</span>
                    </div>
                  </div>

                  <div className="py-2">
                    <span className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Simular Rol (RBAC):
                    </span>
                    {roles.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => {
                          onSelectRole(r.value);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          user.role === r.value
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{r.label}</span>
                        {user.role === r.value && <Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onOpenHierarchyModal();
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cambiar de semestre o carrera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
