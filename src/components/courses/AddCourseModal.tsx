import React, { useState } from 'react';
import { X, BookPlus, Check, AlertCircle } from 'lucide-react';
import { Teacher } from '../../types/academic';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesterId: string;
  semesterNumber: number;
  teachers: Teacher[];
  onAddCourse: (courseData: {
    semesterId: string;
    teacherId?: string;
    code: string;
    name: string;
    description: string;
    colorHex: string;
    credits: number;
  }) => Promise<void>;
  onOpenNewTeacherModal: () => void;
}

const PRESET_COLORS = [
  '#0284c7', // Sky blue
  '#2563eb', // Royal blue
  '#7c3aed', // Purple
  '#059669', // Emerald green
  '#d97706', // Amber
  '#dc2626', // Red
  '#475569', // Slate
  '#db2777', // Pink
];

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  semesterId,
  semesterNumber,
  teachers,
  onAddCourse,
  onOpenNewTeacherModal,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState(4);
  const [colorHex, setColorHex] = useState(PRESET_COLORS[0]);
  const [teacherId, setTeacherId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Código y Nombre de la asignatura son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAddCourse({
        semesterId,
        teacherId: teacherId || undefined,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim() || 'Asignatura académica incorporada al plan curricular.',
        colorHex,
        credits: Number(credits) || 4,
      });
      setCode('');
      setName('');
      setDescription('');
      setTeacherId('');
      onClose();
    } catch (err) {
      setError('Error al registrar la materia. Verifica los datos ingresados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Agregar Asignatura</h2>
              <p className="text-xs text-slate-500">
                Inscribir materia para el {semesterNumber}.º Semestre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                placeholder="ECO-405"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono font-bold uppercase"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de Asignatura *
              </label>
              <input
                type="text"
                placeholder="Econometría I"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Créditos Académicos *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Color de Identificación
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColorHex(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      colorHex === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-900' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Docente Titular */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Docente Titular
              </label>
              <button
                type="button"
                onClick={onOpenNewTeacherModal}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                + Registrar nuevo docente
              </button>
            </div>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="">-- Sin docente asignado temporalmente --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({t.department || 'Docente'})
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sumilla / Descripción del Curso
            </label>
            <textarea
              rows={3}
              placeholder="Descripción de objetivos, contenido formativo y competencias..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registrando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Crear Asignatura</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
