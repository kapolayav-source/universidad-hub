import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CourseSpace } from './components/courses/CourseSpace';
import { ScheduleView } from './components/calendar/ScheduleView';
import { TasksView } from './components/tasks/TasksView';
import { AcademicSelectorModal } from './components/academic/AcademicSelectorModal';
import { SupabaseConfigBanner } from './components/ui/SupabaseConfigBanner';
import { academicService } from './services/academicService';
import {
  University,
  Faculty,
  Career,
  Semester,
  Course,
  ClassSession,
  Assignment,
  Exam,
  UserProfile,
  UserRole,
} from './types/academic';
import {
  INITIAL_UNIVERSITY,
  INITIAL_FACULTY,
  INITIAL_CAREER,
  INITIAL_SEMESTER,
  INITIAL_USER_PROFILE,
} from './data/initialData';

export default function App() {
  // Estado Académico y Usuario
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [university] = useState<University>(INITIAL_UNIVERSITY);
  const [faculty] = useState<Faculty>(INITIAL_FACULTY);
  const [career] = useState<Career>(INITIAL_CAREER);
  const [semester, setSemester] = useState<Semester>(INITIAL_SEMESTER);

  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  // Estado de Navegación y UI
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'tasks' | 'schedule'>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      const [fetchedUser, fetchedCourses, fetchedClasses, fetchedAssignments, fetchedExams] = await Promise.all([
        academicService.getUserProfile(),
        academicService.getCourses(),
        academicService.getClasses(),
        academicService.getAssignments(),
        academicService.getExams(),
      ]);

      setUser(fetchedUser);
      setCourses(fetchedCourses);
      setClasses(fetchedClasses);
      setAssignments(fetchedAssignments);
      setExams(fetchedExams);
    }
    loadData();
  }, []);

  // Manejadores de navegación
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectView = (view: 'dashboard' | 'tasks' | 'schedule') => {
    setCurrentView(view);
    setSelectedCourseId(null);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAssignment = async (assignmentId: string) => {
    const updated = await academicService.toggleAssignmentStatus(assignmentId);
    setAssignments(updated);
  };

  const handleAddAssignment = async (newAsg: Omit<Assignment, 'id'>) => {
    const created = await academicService.addAssignment(newAsg);
    setAssignments((prev) => [created, ...prev]);
  };

  const handleSelectRole = (role: UserRole) => {
    academicService.updateUserProfile({ role }).then((updated) => setUser(updated));
  };

  const handleSelectSemester = (semesterNumber: number) => {
    setSemester((prev) => ({
      ...prev,
      number: semesterNumber,
      academicPeriod: `2026-${semesterNumber % 2 === 0 ? 'I' : 'II'}`,
    }));
  };

  // Filtrado de cursos por búsqueda rápida
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.teacher?.fullName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [courses, searchQuery]);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId);
  }, [courses, selectedCourseId]);

  const totalCredits = useMemo(() => {
    return courses.reduce((sum, c) => sum + c.credits, 0);
  }, [courses]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Banner de Supabase y Migraciones */}
      <SupabaseConfigBanner />

      {/* Barra de Navegación Superior */}
      <Navbar
        university={university}
        faculty={faculty}
        career={career}
        semester={semester}
        user={user}
        onOpenHierarchyModal={() => setIsHierarchyModalOpen(true)}
        onSelectRole={handleSelectRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigateHome={() => handleSelectView('dashboard')}
      />

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2">
          <button
            onClick={() => handleSelectView('dashboard')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            Panel Principal
          </button>
          <button
            onClick={() => handleSelectView('schedule')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              currentView === 'schedule' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            Horarios & Calendario
          </button>
          <button
            onClick={() => handleSelectView('tasks')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              currentView === 'tasks' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            Tareas & Evaluaciones
          </button>
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block px-3 mb-1">
              Materias del 4.º Semestre
            </span>
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  handleSelectCourse(c.id);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
              >
                <span className="truncate">{c.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{c.credits}cr</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenedor Principal (Sidebar + Workspace) */}
      <div className="max-w-7xl w-full mx-auto flex-1 flex">
        {/* Sidebar de Escritorio */}
        <Sidebar
          currentView={currentView}
          selectedCourseId={selectedCourseId}
          courses={courses}
          onSelectView={handleSelectView}
          onSelectCourse={handleSelectCourse}
          totalCredits={totalCredits}
        />

        {/* Área de Trabajo Principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-x-hidden">
          {/* Vista: Espacio de Curso Seleccionado */}
          {currentView === 'course' && selectedCourse ? (
            <CourseSpace
              course={selectedCourse}
              classes={classes.filter((cls) => cls.courseId === selectedCourse.id)}
              assignments={assignments.filter((asg) => asg.courseId === selectedCourse.id)}
              exams={exams.filter((e) => e.courseId === selectedCourse.id)}
              onBack={() => handleSelectView('dashboard')}
              onToggleAssignment={handleToggleAssignment}
            />
          ) : currentView === 'schedule' ? (
            /* Vista: Horarios Semanales */
            <ScheduleView
              courses={courses}
              onSelectCourse={handleSelectCourse}
            />
          ) : currentView === 'tasks' ? (
            /* Vista: Tareas y Evaluaciones */
            <TasksView
              assignments={assignments}
              courses={courses}
              onToggleAssignment={handleToggleAssignment}
              onAddAssignment={handleAddAssignment}
              onSelectCourse={handleSelectCourse}
            />
          ) : (
            /* Vista por defecto: Dashboard General */
            <DashboardOverview
              user={user}
              courses={filteredCourses}
              assignments={assignments}
              exams={exams}
              onSelectCourse={handleSelectCourse}
              onToggleAssignment={handleToggleAssignment}
              onNavigateToSchedule={() => handleSelectView('schedule')}
              onNavigateToTasks={() => handleSelectView('tasks')}
            />
          )}
        </main>
      </div>

      {/* Navegación Inferior para Móvil */}
      <MobileBottomNav
        currentView={currentView}
        onSelectView={handleSelectView}
        onOpenHierarchyModal={() => setIsHierarchyModalOpen(true)}
      />

      {/* Modal de Jerarquía Curricular */}
      <AcademicSelectorModal
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
        university={university}
        faculty={faculty}
        career={career}
        semester={semester}
        onSelectSemester={handleSelectSemester}
      />
    </div>
  );
}
