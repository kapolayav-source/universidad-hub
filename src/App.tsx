import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { CourseSpace } from './components/courses/CourseSpace';
import { ScheduleView } from './components/calendar/ScheduleView';
import { TasksView } from './components/tasks/TasksView';
import { LibraryView } from './components/library/LibraryView';
import { AddMaterialModal } from './components/library/AddMaterialModal';
import { AddCourseModal } from './components/courses/AddCourseModal';
import { EditCourseModal } from './components/courses/EditCourseModal';
import { TeacherModal } from './components/courses/TeacherModal';
import { SyllabusModal } from './components/courses/SyllabusModal';
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
  CourseMaterial,
  CourseSyllabus,
  Teacher,
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [syllabi, setSyllabi] = useState<Record<string, CourseSyllabus>>({});

  // Estado de Navegación y UI
  const [currentView, setCurrentView] = useState<'dashboard' | 'course' | 'tasks' | 'schedule' | 'library'>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados de Modales Dinámicos (Fase 2)
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [targetMaterialCourseId, setTargetMaterialCourseId] = useState<string | undefined>(undefined);

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<Teacher | undefined>(undefined);

  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [syllabusTargetCourse, setSyllabusTargetCourse] = useState<Course | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      const [
        fetchedUser,
        fetchedCourses,
        fetchedTeachers,
        fetchedClasses,
        fetchedAssignments,
        fetchedExams,
        fetchedMaterials,
      ] = await Promise.all([
        academicService.getUserProfile(),
        academicService.getCourses(),
        academicService.getTeachers(),
        academicService.getClasses(),
        academicService.getAssignments(),
        academicService.getExams(),
        academicService.getMaterials(),
      ]);

      setUser(fetchedUser);
      setCourses(fetchedCourses);
      setTeachers(fetchedTeachers);
      setClasses(fetchedClasses);
      setAssignments(fetchedAssignments);
      setExams(fetchedExams);
      setMaterials(fetchedMaterials);

      // Cargar sílabos para los cursos disponibles
      const syllabiMap: Record<string, CourseSyllabus> = {};
      for (const c of fetchedCourses) {
        const syl = await academicService.getSyllabus(c.id);
        if (syl) {
          syllabiMap[c.id] = syl;
        }
      }
      setSyllabi(syllabiMap);
    }
    loadData();
  }, []);

  // Manejadores de navegación
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectView = (view: 'dashboard' | 'tasks' | 'schedule' | 'library') => {
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

  const handleUpdateUserProfile = async (updates: Partial<UserProfile>) => {
    const updated = await academicService.updateUserProfile(updates);
    setUser(updated);
  };

  const handleSelectSemester = (semesterNumber: number) => {
    setSemester((prev) => ({
      ...prev,
      number: semesterNumber,
      academicPeriod: `2026-${semesterNumber % 2 === 0 ? 'I' : 'II'}`,
    }));
  };

  // --- Operaciones Dinámicas Fase 2: Materiales ---
  const handleOpenAddMaterialModal = (courseId?: string) => {
    setTargetMaterialCourseId(courseId || selectedCourseId || undefined);
    setIsAddMaterialModalOpen(true);
  };

  const handleAddMaterial = async (
    materialData: Omit<CourseMaterial, 'id' | 'createdAt' | 'downloadCount'>
  ) => {
    const newMaterial = await academicService.addMaterial(materialData);
    setMaterials((prev) => [newMaterial, ...prev]);
  };

  const handleDeleteMaterial = async (materialId: string) => {
    const success = await academicService.deleteMaterial(materialId);
    if (success) {
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    }
  };

  // --- Operaciones Dinámicas Fase 2: Cursos ---
  const handleAddCourse = async (courseData: {
    semesterId: string;
    teacherId?: string;
    code: string;
    name: string;
    description: string;
    colorHex: string;
    credits: number;
  }) => {
    const newCourse = await academicService.addCourse(courseData);
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleUpdateCourse = async (courseId: string, updates: Partial<Course>) => {
    const updatedCourses = await academicService.updateCourse(courseId, updates);
    if (updatedCourses) {
      setCourses(updatedCourses);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    const success = await academicService.deleteCourse(courseId);
    if (success) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      if (selectedCourseId === courseId) {
        setSelectedCourseId(null);
        setCurrentView('dashboard');
      }
    }
  };

  // --- Operaciones Dinámicas Fase 2: Docentes ---
  const handleSaveTeacher = async (
    teacherData: Omit<Teacher, 'id'>,
    teacherId?: string
  ) => {
    const saved = teacherId
      ? await academicService.updateTeacher(teacherId, teacherData)
      : await academicService.addTeacher(teacherData);

    setTeachers((prev) => {
      const exists = prev.some((t) => t.id === saved.id);
      if (exists) {
        return prev.map((t) => (t.id === saved.id ? saved : t));
      }
      return [...prev, saved];
    });

    // Si un curso usa este docente, refrescar courses
    setCourses((prev) =>
      prev.map((c) => (c.teacherId === saved.id ? { ...c, teacher: saved } : c))
    );
    return saved;
  };

  // --- Operaciones Dinámicas Fase 2: Sílabos ---
  const handleSaveSyllabus = async (
    syllabusData: Omit<CourseSyllabus, 'id' | 'courseId' | 'updatedAt'> & { id?: string }
  ) => {
    if (!syllabusTargetCourse) return;
    const saved = await academicService.saveSyllabus(syllabusTargetCourse.id, syllabusData);
    setSyllabi((prev) => ({
      ...prev,
      [syllabusTargetCourse.id]: saved,
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
            onClick={() => handleSelectView('library')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
              currentView === 'library' ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            Biblioteca & Archivos
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
              Materias ({courses.length})
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
          semesterNumber={semester.number}
          onSelectView={handleSelectView}
          onSelectCourse={handleSelectCourse}
          onAddCourseClick={() => setIsAddCourseModalOpen(true)}
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
              materials={materials.filter((m) => m.courseId === selectedCourse.id)}
              syllabus={syllabi[selectedCourse.id] || null}
              onBack={() => handleSelectView('dashboard')}
              onToggleAssignment={handleToggleAssignment}
              onAddMaterialClick={() => handleOpenAddMaterialModal(selectedCourse.id)}
              onDeleteMaterial={handleDeleteMaterial}
              onEditCourseClick={() => setCourseToEdit(selectedCourse)}
              onEditSyllabusClick={() => {
                setSyllabusTargetCourse(selectedCourse);
                setIsSyllabusModalOpen(true);
              }}
              onEditTeacherClick={() => {
                setTeacherToEdit(selectedCourse.teacher);
                setIsTeacherModalOpen(true);
              }}
            />
          ) : currentView === 'library' ? (
            /* Vista: Biblioteca & Archivos Académicos (Fase 2) */
            <LibraryView
              materials={materials}
              courses={courses}
              onAddMaterialClick={() => handleOpenAddMaterialModal()}
              onDeleteMaterial={handleDeleteMaterial}
              onSelectCourse={handleSelectCourse}
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

      {/* Modal de Jerarquía Curricular & Perfil de Estudiante */}
      <AcademicSelectorModal
        isOpen={isHierarchyModalOpen}
        onClose={() => setIsHierarchyModalOpen(false)}
        university={university}
        faculty={faculty}
        career={career}
        semester={semester}
        user={user}
        onSelectSemester={handleSelectSemester}
        onUpdateUserProfile={handleUpdateUserProfile}
      />

      {/* Modal: Subir Material Académico */}
      <AddMaterialModal
        isOpen={isAddMaterialModalOpen}
        onClose={() => setIsAddMaterialModalOpen(false)}
        courses={courses}
        initialCourseId={targetMaterialCourseId}
        onAddMaterial={handleAddMaterial}
      />

      {/* Modal: Agregar Asignatura Dinámica */}
      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        semesterId={semester.id}
        semesterNumber={semester.number}
        teachers={teachers}
        onAddCourse={handleAddCourse}
        onOpenNewTeacherModal={() => {
          setTeacherToEdit(undefined);
          setIsTeacherModalOpen(true);
        }}
      />

      {/* Modal: Modificar Asignatura */}
      {courseToEdit && (
        <EditCourseModal
          isOpen={!!courseToEdit}
          onClose={() => setCourseToEdit(null)}
          course={courseToEdit}
          teachers={teachers}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourse}
          onOpenNewTeacherModal={() => {
            setTeacherToEdit(undefined);
            setIsTeacherModalOpen(true);
          }}
        />
      )}

      {/* Modal: Registrar o Editar Docente */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setTeacherToEdit(undefined);
        }}
        teacherToEdit={teacherToEdit}
        onSaveTeacher={handleSaveTeacher}
      />

      {/* Modal: Modificar Sílabo Oficial */}
      {isSyllabusModalOpen && syllabusTargetCourse && (
        <SyllabusModal
          isOpen={isSyllabusModalOpen}
          onClose={() => {
            setIsSyllabusModalOpen(false);
            setSyllabusTargetCourse(null);
          }}
          courseId={syllabusTargetCourse.id}
          courseName={syllabusTargetCourse.name}
          currentSyllabus={syllabi[syllabusTargetCourse.id] || null}
          onSaveSyllabus={handleSaveSyllabus}
        />
      )}
    </div>
  );
}
