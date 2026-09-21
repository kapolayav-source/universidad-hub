import React, { useState } from 'react';
import { X, School, Building2, GraduationCap, Calendar, Check, User, Save, Phone, Hash } from 'lucide-react';
import { University, Faculty, Career, Semester, UserProfile } from '../../types/academic';

interface AcademicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University;
  faculty: Faculty;
  career: Career;
  semester: Semester;
  user: UserProfile;
  onSelectSemester: (semesterNumber: number) => void;
  onUpdateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

export const AcademicSelectorModal: React.FC<AcademicSelectorModalProps> = ({
  isOpen,
  onClose,
  university,
  faculty,
  career,
  semester,
  user,
  onSelectSemester,
  onUpdateUserProfile,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [studentCode, setStudentCode] = useState(user.studentCode || '22060142');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState(user.phoneWhatsapp || '+51987654321');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const semestersList = Array.from({ length: career.totalSemesters }, (_, i) => i + 1);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateUserProfile({
        fullName: fullName.trim(),
        studentCode: studentCode.trim(),
        phoneWhatsapp: phoneWhatsapp.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Error guardando perfil:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Perfil del Estudiante & Ciclo</h3>
            <p className="text-xs text-slate-500">Datos académicos y semestre activo en Universidad Hub</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Formulario de Datos Básicos del Estudiante */}
          <form onSubmit={handleSaveProfile} className="bg-blue-50/40 p-4 rounded-2xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                Datos del Estudiante (Modificables en Vivo)
              </span>
              {savedSuccess && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> ¡Actualizado!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Código de Matrícula
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="22060142"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Teléfono / WhatsApp de Contacto
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="+51 987 654 321"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Guardando...' : 'Guardar Datos del Estudiante'}</span>
              </button>
            </div>
          </form>

          {/* Selector de Semestre / Ciclo */}
          <div className="pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Seleccionar Semestre o Ciclo que cursa:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {semestersList.map((num) => {
                const isSelected = num === semester.number;
                return (
                  <button
                    key={num}
                    onClick={() => {
                      onSelectSemester(num);
                    }}
                    className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-2 ring-blue-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold">{num}.º</span>
                    <span className="text-[9px] opacity-80">Ciclo</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Semestre en curso: <strong className="text-slate-700">{semester.number}.º Semestre ({semester.academicPeriod})</strong>
            </p>
          </div>

          {/* Información Jerárquica Institucional */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Estructura Institucional
            </span>

            {/* Universidad */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Universidad</span>
                <p className="text-xs font-bold text-slate-900 truncate">{university.name}</p>
                <span className="text-[11px] text-slate-500">Sede Central • {university.countryCode}</span>
              </div>
            </div>

            {/* Facultad y Carrera */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Facultad</span>
                <p className="text-xs font-bold text-slate-900 truncate">{faculty.name}</p>
                <span className="text-[10px] text-slate-400 font-mono">{faculty.code}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Carrera</span>
                <p className="text-xs font-bold text-slate-900 truncate">{career.name}</p>
                <span className="text-[10px] text-slate-400 font-mono">{career.totalSemesters} Semestres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
