import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Info,
  CheckCircle2,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { UserProfile } from '../../types/academic';

interface CurriculumExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const CurriculumExplorerModal: React.FC<CurriculumExplorerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [selectedCycle, setSelectedCycle] = useState<number>(
    currentUser.enrolledSemesterNumber || 4
  );

  if (!isOpen) return null;

  const courses = academicService.getCurriculumBySemester(selectedCycle);
  const totalCredits = courses.reduce((acc, curr) => acc + curr.credits, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                Explorador de Malla Curricular
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Plan de Estudios 2026 • 10 Ciclos
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Malla Curricular - Carrera de Economía
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Consulta de asignaturas, créditos y sumillas de toda la carrera. Esta herramienta es meramente informativa y <strong>no altera tu ciclo oficial de matrícula</strong>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Banner Informativo de Ciclo Oficial */}
        <div className="bg-amber-50/70 border-y border-amber-200/60 px-6 py-3 flex items-center gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="leading-snug">
            <span>
              Tu ciclo oficial registrado ante Secretaría Académica:{' '}
              <strong className="font-bold">
                {currentUser.enrolledSemesterNumber}.º Semestre
              </strong>
              .
            </span>
            <span className="block text-[11px] text-amber-800">
              Solo un Administrador Global puede actualizar formalmente tu ciclo de matrícula.
            </span>
          </div>
        </div>

        {/* Selector de Ciclos (1.º a 10.º) */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((cycle) => {
              const isCurrentOfficial = currentUser.enrolledSemesterNumber === cycle;
              const isSelected = selectedCycle === cycle;

              return (
                <button
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  <span>{cycle}.º Ciclo</span>
                  {isCurrentOfficial && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Oficial
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido de Cursos del Ciclo Seleccionado */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Asignaturas del {selectedCycle}.º Ciclo</span>
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
              {courses.length} Cursos • {totalCredits} Créditos Totales
            </span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.code}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                        {course.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {course.credits} Créditos
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {course.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Facultad de Ciencias Económicas • Universidad Hub
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Explorador
          </button>
        </div>
      </div>
    </div>
  );
};
