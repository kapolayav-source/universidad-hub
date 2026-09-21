import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Clock,
  MapPin,
  Mail,
  Building,
  CheckCircle2,
  Calendar,
  FileText,
  BookOpen,
  Award,
  Share2,
  FolderOpen,
  Plus,
  Edit3,
  Download,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Course, ClassSession, Assignment, Exam, CourseMaterial, CourseSyllabus, UserRole } from '../../types/academic';

interface CourseSpaceProps {
  course: Course;
  classes: ClassSession[];
  assignments: Assignment[];
  exams: Exam[];
  materials: CourseMaterial[];
  syllabus: CourseSyllabus | null;
  userRole: UserRole;
  onBack: () => void;
  onToggleAssignment: (assignmentId: string) => void;
  onAddMaterialClick: () => void;
  onDeleteMaterial: (materialId: string) => Promise<void>;
  onEditCourseClick: () => void;
  onEditSyllabusClick: () => void;
  onEditTeacherClick: () => void;
}

export const CourseSpace: React.FC<CourseSpaceProps> = ({
  course,
  classes,
  assignments,
  exams,
  materials,
  syllabus,
  userRole,
  onBack,
  onToggleAssignment,
  onAddMaterialClick,
  onDeleteMaterial,
  onEditCourseClick,
  onEditSyllabusClick,
  onEditTeacherClick,
}) => {
  const isAdmin = userRole === 'admin';
  const [activeTab, setActiveTab] = useState<'classes' | 'assignments' | 'materials' | 'exams' | 'info'>('classes');

  const tabs = [
    { id: 'classes', label: 'Clases & Sesiones', count: classes.length },
    { id: 'assignments', label: 'Tareas', count: assignments.length },
    { id: 'exams', label: 'Exámenes', count: exams.length },
    { id: 'materials', label: 'Materiales & PDFs', count: materials.length },
    { id: 'info', label: 'Información & Sílabo' },
  ];

  const getFormatBadge = (type: CourseMaterial['fileType']) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pptx':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'docx':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'xlsx':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'zip':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Botón Volver y Acciones Superiores */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a todos los cursos</span>
        </button>

        {isAdmin && (
          <button
            onClick={onEditCourseClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modificar Asignatura</span>
          </button>
        )}
      </div>

      {/* Cabecera del Curso */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-2.5"
          style={{ backgroundColor: course.colorHex }}
        />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md text-white shadow-2xs"
                style={{ backgroundColor: course.colorHex }}
              >
                {course.code}
              </span>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                {course.credits} Créditos Académicos
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Plan Curricular Dinámico
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.name}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Tarjeta del Profesor y Horario Resumido */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 min-w-[280px] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Docente Titular</span>
              <button
                onClick={onEditTeacherClick}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Editar</span>
              </button>
            </div>

            {course.teacher ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {course.teacher.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{course.teacher.fullName}</p>
                  <span className="text-slate-500 text-[11px]">{course.teacher.department}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-slate-400 italic text-[11px]">Docente sin asignar</p>
                <button
                  onClick={onEditTeacherClick}
                  className="mt-1 text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Asignar docente titular
                </button>
              </div>
            )}

            {course.teacher && (
              <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-slate-600">
                {course.teacher.officeLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{course.teacher.officeLocation}</span>
                  </div>
                )}
                {course.schedules.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {course.schedules.map((s) => `${s.dayName} ${s.startTime}-${s.endTime}`).join(' • ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Barra de Progreso del Curso */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3 w-full max-w-xs">
            <span>Avance:</span>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${course.progressPercentage}%`,
                  backgroundColor: course.colorHex,
                }}
              />
            </div>
            <span className="font-bold font-mono text-slate-700">
              {course.progressPercentage}%
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400 font-medium">
            <span>{classes.length} Clases registradas</span>
            <span>•</span>
            <span>{assignments.length} Tareas programadas</span>
            <span>•</span>
            <span>{materials.length} Materiales en biblioteca</span>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido de Pestañas */}

      {/* 1. CLASES & SESIONES */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cronograma de Clases</h3>
              <p className="text-xs text-slate-500">Sesiones teóricas y prácticas dictadas</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total: {classes.length} sesiones
            </span>
          </div>

          {classes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              No hay sesiones de clase registradas aún para este curso.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-blue-200 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        #{cls.sessionNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cls.title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(cls.classDate).toLocaleDateString('es-ES', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          • {cls.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cls.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cls.topicsCovered.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TAREAS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tareas y Prácticas</h3>
              <p className="text-xs text-slate-500">Asignaciones calificadas del curso</p>
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
              No hay tareas pendientes en este curso.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((asg) => {
                const isCompleted = asg.status === 'completed';
                return (
                  <div
                    key={asg.id}
                    className={`bg-white rounded-2xl border p-4 shadow-2xs transition-all flex items-start justify-between gap-4 ${
                      isCompleted ? 'border-slate-200 opacity-80' : 'border-blue-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggleAssignment(asg.id)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 hover:border-blue-500'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="space-y-1">
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {asg.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {asg.description}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-red-600 font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            Vence: {new Date(asg.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                          <span>Puntaje Máx: {asg.maxScore} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. EXÁMENES */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Evaluaciones y Exámenes</h3>
              <p className="text-xs text-slate-500">Cronograma oficial de parciales y finales</p>
            </div>
          </div>

          <div className="space-y-3">
            {exams.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No hay exámenes programados para esta asignatura.
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{exam.title}</h4>
                      <span className="text-xs text-slate-500">
                        {new Date(exam.examDate).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}{' '}
                        • {exam.classroom}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100">
                      Peso: {exam.weightPercentage}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700">Temario:</strong> {exam.topics}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. MATERIALES Y BIBLIOTECA DEL CURSO (FASE 2 DINÁMICA) */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Biblioteca del Curso</h3>
              <p className="text-xs text-slate-500">
                Archivos, diapositivas y lecturas sincronizados con Supabase
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={onAddMaterialClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Subir Archivo / Material</span>
              </button>
            )}
          </div>

          {materials.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">
                Aún no hay archivos subidos en la biblioteca de este curso.
              </p>
              {isAdmin && (
                <button
                  onClick={onAddMaterialClick}
                  className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Subir primer documento
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {materials.map((mat) => {
                const formatBadge = getFormatBadge(mat.fileType);
                return (
                  <div
                    key={mat.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            {mat.title}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            {mat.fileName} • {mat.fileSize}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${formatBadge}`}>
                        {mat.fileType}
                      </span>
                    </div>

                    {mat.description && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {mat.description}
                      </p>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {mat.downloadCount || 0} descargas
                      </span>
                      <div className="flex items-center gap-1">
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteMaterial(mat.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            title="Eliminar archivo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={mat.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. INFORMACIÓN GENERAL & SÍLABO OFICIAL */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* Tarjeta de Sílabo */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                    Sílabo Oficial
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Período {syllabus?.academicYear || '2026-I'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Sumilla y Programa Curricular
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {syllabus?.fileUrl && (
                  <a
                    href={syllabus.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar Sílabo PDF</span>
                  </a>
                )}
                {isAdmin && (
                  <button
                    onClick={onEditSyllabusClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modificar Sílabo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sumilla */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Sumilla de la Asignatura
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                {syllabus?.summary || course.description}
              </p>
            </div>

            {/* Competencias */}
            {syllabus?.competencies && syllabus.competencies.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Competencias & Resultados de Aprendizaje
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                  {syllabus.competencies.map((comp, i) => (
                    <li key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sistema de Evaluación */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Sistema de Evaluación y Ponderaciones
              </h4>
              <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100">
                <p className="text-xs font-mono font-bold text-emerald-800">
                  {syllabus?.evaluationSystem || 'PF = (EP * 0.35) + (EF * 0.35) + (PP * 0.30)'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Calificación vigesimal de 00 a 20. Nota mínima aprobatoria: 11.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Contacto Docente */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Contacto con la Cátedra</h3>
              {isAdmin && (
                <button
                  onClick={onEditTeacherClick}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Docente</span>
                </button>
              )}
            </div>

            {course.teacher ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Docente</span>
                  <span className="font-bold text-slate-900">{course.teacher.fullName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Correo</span>
                  <span className="font-semibold text-blue-600 truncate block">
                    {course.teacher.email || 'No registrado'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Atención</span>
                  <span className="font-bold text-slate-900">
                    {course.teacher.officeLocation || 'Cubículo de Docencia'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No hay docente asignado para este curso.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
