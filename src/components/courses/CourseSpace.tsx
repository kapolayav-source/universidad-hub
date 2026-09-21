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
  HelpCircle,
  Plus,
} from 'lucide-react';
import { Course, ClassSession, Assignment, Exam } from '../../types/academic';

interface CourseSpaceProps {
  course: Course;
  classes: ClassSession[];
  assignments: Assignment[];
  exams: Exam[];
  onBack: () => void;
  onToggleAssignment: (assignmentId: string) => void;
}

export const CourseSpace: React.FC<CourseSpaceProps> = ({
  course,
  classes,
  assignments,
  exams,
  onBack,
  onToggleAssignment,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'assignments' | 'materials' | 'exams' | 'info'>('classes');

  const tabs = [
    { id: 'classes', label: 'Clases & Sesiones', count: classes.length },
    { id: 'assignments', label: 'Tareas', count: assignments.length },
    { id: 'exams', label: 'Exámenes', count: exams.length },
    { id: 'materials', label: 'Materiales & PDFs', count: 4 },
    { id: 'info', label: 'Información & Silabo' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Botón Volver */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a todos los cursos</span>
        </button>
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
                4.º Semestre • FCE
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                {course.teacher?.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Docente Titular</span>
                <p className="font-bold text-slate-900 text-sm">{course.teacher?.fullName}</p>
                <span className="text-slate-500 text-[11px]">{course.teacher?.department}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{course.teacher?.officeLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {course.schedules.map((s) => `${s.dayName} ${s.startTime}-${s.endTime}`).join(' • ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progreso del Curso */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3 w-full max-w-xs">
            <span>Avance:</span>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${course.progressPercentage}%`, backgroundColor: course.colorHex }}
              />
            </div>
            <span className="font-bold text-slate-800">{course.progressPercentage}%</span>
          </div>
          <span className="text-slate-500">Aula habitual: <strong className="text-slate-800">{course.schedules[0]?.classroom}</strong></span>
        </div>
      </div>

      {/* Pestañas del Curso */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenido según la pestaña activa */}

      {/* 1. CLASES & SESIONES */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Sesiones de Clase</h3>
              <p className="text-xs text-slate-500">Registro cronológico de temas y resúmenes</p>
            </div>
          </div>

          <div className="space-y-3">
            {classes.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No hay clases registradas para este curso todavía.
              </div>
            ) : (
              classes.map((session) => (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs font-mono">
                        #{session.sessionNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {session.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(session.classDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.room}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {session.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                      Temas:
                    </span>
                    {session.topicsCovered.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. TAREAS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tareas del Curso</h3>
              <p className="text-xs text-slate-500">Asignaciones académicas y fechas de entrega</p>
            </div>
          </div>

          <div className="space-y-3">
            {assignments.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No hay tareas pendientes en este curso.
              </div>
            ) : (
              assignments.map((asg) => {
                const isDone = asg.status === 'completed';
                return (
                  <div
                    key={asg.id}
                    className={`bg-white rounded-2xl border p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isDone ? 'Completada' : 'Pendiente'}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          Puntaje Máximo: {asg.maxScore} pts
                        </span>
                        {asg.userScore !== undefined && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Nota: {asg.userScore} / {asg.maxScore}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{asg.description}</p>
                      <p className="text-[11px] text-slate-500 pt-1">
                        Fecha límite: <strong>{new Date(asg.dueDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</strong>
                      </p>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => onToggleAssignment(asg.id)}
                        className={`w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          isDone
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDone ? 'Marcar como pendiente' : 'Marcar como entregada'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. EXÁMENES */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Exámenes y Evaluaciones</h3>
              <p className="text-xs text-slate-500">Ponderaciones oficiales y fechas fijadas</p>
            </div>
          </div>

          <div className="space-y-3">
            {exams.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No hay exámenes registrados para esta materia.
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        Evaluación Oficial
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{exam.title}</h4>
                    </div>
                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                      Ponderación: {exam.weightPercentage}%
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block mb-1">Temas comprendidos:</span>
                    <p className="text-slate-600 leading-relaxed">{exam.topics}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{new Date(exam.examDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </span>
                    <span>Lugar: <strong className="text-slate-800">{exam.classroom}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. MATERIALES (Preparación para Fase 2 con Supabase Storage) */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Material Académico & Lecturas</h3>
              <p className="text-xs text-slate-500">Documentos oficiales autorizados para el curso</p>
            </div>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-semibold border border-indigo-200">
              Preparado para Fase 2: Supabase Storage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                title: 'Syllabus y Malla Curricular Oficial 2026-I',
                type: 'PDF',
                size: '1.4 MB',
                date: '02 Sep 2026',
              },
              {
                title: 'Diapositivas: Unidad 1 - Modelos de Equilibrio General',
                type: 'PPTX',
                size: '8.2 MB',
                date: '08 Sep 2026',
              },
              {
                title: 'Lectura Obligatoria: Blanchard - Macroeconomía Cap. 3-5',
                type: 'PDF',
                size: '4.7 MB',
                date: '10 Sep 2026',
              },
              {
                title: 'Guía de Prácticas y Ejercicios Resueltos IS-LM',
                type: 'DOCX',
                size: '890 KB',
                date: '15 Sep 2026',
              },
            ].map((mat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-200 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{mat.title}</p>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {mat.type} • {mat.size} • {mat.date}
                    </span>
                  </div>
                </div>
                <button
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shrink-0 cursor-pointer"
                  onClick={() => alert(`Visualización de ${mat.title} estará disponible en la Fase 2 con Supabase Storage.`)}
                >
                  Abrir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INFORMACIÓN GENERAL */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Sumilla Oficial de la Asignatura</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Asignatura de naturaleza teórico-práctica que corresponde al área de formación básica profesional en Economía. Se orienta al dominio del instrumental analítico contemporáneo, análisis macroeconómico coyuntural y diseño de políticas públicas estabilizadoras.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">Departamento</span>
              <span className="font-bold text-slate-900">{course.teacher?.department}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">Total de Horas</span>
              <span className="font-bold text-slate-900">4 Horas Semanales</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold block mb-1 uppercase text-[10px]">Sistema de Evaluación</span>
              <span className="font-bold text-slate-900">PF = (EP + EF + PP) / 3</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
