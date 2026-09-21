import React from 'react';
import {
  Clock,
  MapPin,
  User,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  BookOpen,
  ChevronRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Course, Assignment, Exam, UserProfile } from '../../types/academic';

interface DashboardOverviewProps {
  user: UserProfile;
  courses: Course[];
  assignments: Assignment[];
  exams: Exam[];
  onSelectCourse: (courseId: string) => void;
  onToggleAssignment: (assignmentId: string) => void;
  onNavigateToSchedule: () => void;
  onNavigateToTasks: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  courses,
  assignments,
  exams,
  onSelectCourse,
  onToggleAssignment,
  onNavigateToSchedule,
  onNavigateToTasks,
}) => {
  // Encontrar próxima clase (ej. Macroeconomía I a las 08:00 o la primera del día)
  const nextCourse = courses.find((c) => c.id === 'course-macro-1') || courses[0];
  const nextSchedule = nextCourse?.schedules[0];

  const pendingAssignments = assignments.filter((a) => a.status === 'pending');
  const completedAssignments = assignments.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-6 pb-12">
      {/* Saludo y Banner Principal */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full font-medium border border-blue-400/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>4.º Semestre • Economía • Periodo 2026-I</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Hola, {user.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tienes <strong className="text-white font-semibold">{pendingAssignments.length} tareas pendientes</strong> esta semana y <strong className="text-white font-semibold">2 exámenes parciales</strong> en el horizonte.
          </p>
        </div>
      </div>

      {/* Grid Superior: Próxima Clase + Resumen Rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Próxima Clase en Vivo / Programada */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Próxima Clase
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {nextCourse?.name}
                </h2>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
              {nextSchedule?.dayName} • {nextSchedule?.startTime} - {nextSchedule?.endTime}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{nextSchedule?.classroom}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Profesor: <strong className="text-slate-800">{nextCourse?.teacher?.fullName}</strong></span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              Tema programado: <em className="text-slate-700">Modelo IS-LM en Economía Cerrada</em>
            </span>
            <button
              onClick={() => onSelectCourse(nextCourse.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Ver Espacio del Curso</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Métrica de Progreso Académico */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Progreso Académico
              </span>
              <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">41%</span>
                <span className="text-xs text-slate-500">Avance del 4.º Semestre</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '41%' }} />
              </div>
              <div className="text-xs text-slate-500 pt-1 flex justify-between">
                <span>Tareas completadas:</span>
                <strong className="text-slate-800">{completedAssignments.length} / {assignments.length}</strong>
              </div>
              <div className="text-xs text-slate-500 flex justify-between">
                <span>Créditos en curso:</span>
                <strong className="text-slate-800">21 Créditos</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToTasks}
            className="w-full mt-4 py-2 text-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
          >
            Ver todas las entregas
          </button>
        </div>
      </div>

      {/* Espacios de los Cursos (Grid de los 6 Cursos del Semestre) */}
      <section aria-labelledby="mis-cursos-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="mis-cursos-heading" className="text-lg font-bold text-slate-900">Cursos del Semestre</h2>
            <p className="text-xs text-slate-500">6 materias inscritas en el 4.º Semestre de Economía</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span
                    className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md text-white shadow-2xs"
                    style={{ backgroundColor: course.colorHex }}
                  >
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    {course.credits} Créditos
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {course.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{course.teacher?.fullName}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{course.classesCount} Sesiones</span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Entrar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tareas Pendientes & Próximos Exámenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tareas Pendientes */}
        <section aria-labelledby="tareas-pendientes-heading" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <h2 id="tareas-pendientes-heading" className="text-base font-bold text-slate-900">Tareas & Entregas</h2>
            </div>
            <button
              onClick={onNavigateToTasks}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-2.5">
            {assignments.slice(0, 4).map((asg) => {
              const course = courses.find((c) => c.id === asg.courseId);
              const isCompleted = asg.status === 'completed';

              return (
                <div
                  key={asg.id}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isCompleted
                      ? 'bg-slate-50/70 border-slate-200 opacity-70'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAssignment(asg.id);
                      }}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-blue-600'
                      }`}
                      title={isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {asg.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span
                          className="font-medium"
                          style={{ color: course?.colorHex }}
                        >
                          {course?.name}
                        </span>
                        <span>•</span>
                        <span>Vence: {new Date(asg.dueDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold shrink-0">
                    {asg.maxScore} pts
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Próximos Exámenes Parciales */}
        <section aria-labelledby="examenes-parciales-heading" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 id="examenes-parciales-heading" className="text-base font-bold text-slate-900">Exámenes Parciales</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Periodo 2026-I</span>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => {
              const course = courses.find((c) => c.id === exam.courseId);
              return (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider block"
                        style={{ color: course?.colorHex }}
                      >
                        {course?.name}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{exam.title}</h4>
                    </div>
                    <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md shrink-0">
                      Peso: {exam.weightPercentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(exam.examDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </span>
                    <span className="text-slate-600 font-medium">{exam.classroom}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
