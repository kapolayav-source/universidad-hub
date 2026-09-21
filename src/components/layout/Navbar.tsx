import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  ChevronRight,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Shield,
  BookOpen,
  Users,
  Award,
} from 'lucide-react';
import { University, Faculty, Career, Semester, UserProfile } from '../../types/academic';

interface NavbarProps {
  university: University;
  faculty: Faculty;
  career: Career;
  semester: Semester;
  user: UserProfile;
  onOpenHierarchyModal: () => void;
  onOpenCurriculumExplorer: () => void;
  onOpenStudentManagement: () => void;
  onSignOut: () => void;
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
  onOpenCurriculumExplorer,
  onOpenStudentManagement,
  onSignOut,
  searchQuery,
  onSearchChange,
  onMobileMenuToggle,
  isMobileMenuOpen,
  onNavigateHome,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user.role === 'admin';

  // Cerrar menú al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                  {isAdmin ? 'Portal de Administración' : 'Portal del Estudiante'}
                </span>
              </div>
            </button>
          </div>

          {/* Breadcrumb de Jerarquía Académica & Botón de Malla Curricular */}
          <div className="hidden lg:flex items-center gap-2">
            <nav
              aria-label="Ruta de navegación"
              className="flex items-center text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <button
                onClick={onOpenHierarchyModal}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer group"
                title="Ver estructura académica y perfil"
              >
                <span className="font-semibold text-slate-800 group-hover:text-blue-600">
                  {faculty.code}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700">{career.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                    isAdmin
                      ? 'bg-purple-700 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isAdmin ? 'Semestre 4 (Gestión)' : `${user.enrolledSemesterNumber || 4}.º Semestre Oficial`}
                </span>
              </button>
            </nav>

            {/* Explorador de Malla Curricular (Informativo, sin cambiar ciclo oficial) */}
            <button
              onClick={onOpenCurriculumExplorer}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer shadow-2xs"
              title="Consultar cursos de los 10 ciclos de Economía"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Explorar Malla</span>
            </button>
          </div>

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

          {/* Perfil Oficial y Menú de Sesión */}
          <div className="flex items-center gap-2.5 shrink-0" ref={menuRef}>
            {/* Badge de Rol Funcional */}
            <div className="hidden sm:flex items-center">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Shield className="w-3 h-3 text-purple-600" />
                  <span>Admin Global</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Alumno • {user.enrolledSemesterNumber || 4}.º Ciclo</span>
                </span>
              )}
            </div>

            {/* Avatar Clicable */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
                aria-expanded={showUserMenu}
              >
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                    {user.fullName}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    {isAdmin ? 'Administrador' : `Cod: ${user.studentCode || '22060142'}`}
                  </span>
                </div>
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              </button>

              {/* Menú Desplegable Auténtico */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-2">
                  {/* Encabezado del Usuario */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      {isAdmin ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                          👑 Administrador Global
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          🎓 Alumno Oficial
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Ciclo asignado:</span>
                      <strong className="text-slate-900 font-bold">
                        {user.enrolledSemesterNumber || 4}.º Semestre
                      </strong>
                    </div>
                  </div>

                  {/* Opciones Funcionales */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onOpenHierarchyModal();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver mi Ficha Académica & Contacto</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenCurriculumExplorer();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Explorar Malla de los 10 Ciclos</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          onOpenStudentManagement();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-purple-700 hover:bg-purple-50 rounded-xl flex items-center gap-2 cursor-pointer font-semibold"
                      >
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>Gestión de Alumnos y Matrícula</span>
                      </button>
                    )}
                  </div>

                  {/* Cerrar Sesión Real */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Cerrar Sesión</span>
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
