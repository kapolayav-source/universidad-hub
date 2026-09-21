import React from 'react';
import { X, School, Building2, GraduationCap, Calendar, Check } from 'lucide-react';
import { University, Faculty, Career, Semester } from '../../types/academic';

interface AcademicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University;
  faculty: Faculty;
  career: Career;
  semester: Semester;
  onSelectSemester: (semesterNumber: number) => void;
}

export const AcademicSelectorModal: React.FC<AcademicSelectorModalProps> = ({
  isOpen,
  onClose,
  university,
  faculty,
  career,
  semester,
  onSelectSemester,
}) => {
  if (!isOpen) return null;

  const semestersList = Array.from({ length: career.totalSemesters }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ubicación Académica</h3>
            <p className="text-xs text-slate-500">Jerarquía curricular del estudiante</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Universidad */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Universidad</span>
              <p className="text-sm font-semibold text-slate-900">{university.name}</p>
              <span className="inline-block mt-0.5 text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Sede Central • Perú
              </span>
            </div>
          </div>

          {/* Facultad */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Facultad</span>
              <p className="text-sm font-semibold text-slate-900">{faculty.name}</p>
              <span className="text-xs text-slate-500 font-mono">Código: {faculty.code}</span>
            </div>
          </div>

          {/* Carrera */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Carrera Profesional</span>
              <p className="text-sm font-semibold text-slate-900">{career.name}</p>
              <span className="text-xs text-slate-500">Plan de estudios: 10 Semestres Académicos</span>
            </div>
          </div>

          {/* Selector de Semestre */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              Seleccionar Semestre Académico Activo:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {semestersList.map((num) => {
                const isSelected = num === semester.number;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      onSelectSemester(num);
                      onClose();
                    }}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-2 ring-blue-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{num}.º</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Periodo lectivo actual: <strong className="text-slate-700">{semester.academicPeriod}</strong>
            </p>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
