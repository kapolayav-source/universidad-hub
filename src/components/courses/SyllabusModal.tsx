import React, { useState } from 'react';
import { X, FileText, Check, Plus, Trash2, AlertCircle, Link } from 'lucide-react';
import { CourseSyllabus } from '../../types/academic';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  currentSyllabus: CourseSyllabus | null;
  onSaveSyllabus: (syllabus: Omit<CourseSyllabus, 'id' | 'courseId' | 'updatedAt'> & { id?: string }) => Promise<void>;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseName,
  currentSyllabus,
  onSaveSyllabus,
}) => {
  const [academicYear, setAcademicYear] = useState(currentSyllabus?.academicYear || '2026-I');
  const [version, setVersion] = useState(currentSyllabus?.version || '1.0');
  const [summary, setSummary] = useState(currentSyllabus?.summary || '');
  const [competencies, setCompetencies] = useState<string[]>(
    currentSyllabus?.competencies?.length
      ? currentSyllabus.competencies
      : ['Dominio teórico y práctico de los contenidos.', 'Capacidad de resolución de problemas aplicados.']
  );
  const [newCompetency, setNewCompetency] = useState('');
  const [evaluationSystem, setEvaluationSystem] = useState(
    currentSyllabus?.evaluationSystem || 'PF = (EP * 0.35) + (EF * 0.35) + (PP * 0.30)'
  );
  const [fileName, setFileName] = useState(currentSyllabus?.fileName || `Silabo_${courseName.replace(/\s+/g, '_')}_2026.pdf`);
  const [fileUrl, setFileUrl] = useState(currentSyllabus?.fileUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddCompetency = () => {
    if (!newCompetency.trim()) return;
    setCompetencies([...competencies, newCompetency.trim()]);
    setNewCompetency('');
  };

  const handleRemoveCompetency = (index: number) => {
    setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('La sumilla o resumen del sílabo es obligatoria.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSaveSyllabus({
        id: currentSyllabus?.id,
        academicYear,
        version,
        summary: summary.trim(),
        competencies,
        evaluationSystem: evaluationSystem.trim(),
        fileName: fileName.trim(),
        fileUrl: fileUrl.trim() || `https://storage.supabase.co/unihub/syllabi/${courseId}.pdf`,
        fileSize: currentSyllabus?.fileSize || '1.2 MB',
      });
      onClose();
    } catch (err) {
      setError('Error al actualizar el sílabo en la base de datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sílabo Oficial del Curso</h2>
              <p className="text-xs text-slate-500">{courseName}</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Período Académico *
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Versión del Sílabo
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Sumilla */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sumilla Oficial / Propósito de la Asignatura *
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describir la naturaleza del curso, propósitos formativos y áreas de conocimiento..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              required
            />
          </div>

          {/* Competencias */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Competencias y Resultados de Aprendizaje
            </label>
            <div className="space-y-1.5 mb-2">
              {competencies.map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100"
                >
                  <span className="leading-snug">{comp}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompetency(idx)}
                    className="text-slate-400 hover:text-red-500 shrink-0 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Agregar nueva competencia..."
                value={newCompetency}
                onChange={(e) => setNewCompetency(e.target.value)}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCompetency();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCompetency}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sistema de Evaluación */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Fórmula y Sistema de Calificación *
            </label>
            <input
              type="text"
              value={evaluationSystem}
              onChange={(e) => setEvaluationSystem(e.target.value)}
              placeholder="Ej: PF = (EP + EF + Promedio_Practicas) / 3"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
              required
            />
          </div>

          {/* Enlace al Documento PDF */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre del Archivo PDF
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL o Enlace de Descarga
              </label>
              <div className="relative">
                <Link className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="url"
                  value={fileUrl}
                  placeholder="https://docs.google.com/..."
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-[11px]"
                />
              </div>
            </div>
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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Guardar Sílabo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
