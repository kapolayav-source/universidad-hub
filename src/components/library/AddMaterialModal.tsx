import React, { useState } from 'react';
import { X, UploadCloud, FileText, Link, Check, AlertCircle } from 'lucide-react';
import { Course, CourseMaterial, MaterialCategory } from '../../types/academic';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialCourseId?: string;
  onAddMaterial: (material: Omit<CourseMaterial, 'id' | 'createdAt' | 'downloadCount'>) => Promise<void>;
}

export const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  courses,
  initialCourseId,
  onAddMaterial,
}) => {
  const [courseId, setCourseId] = useState<string>(initialCourseId || (courses[0]?.id || ''));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('lecture');
  const [fileType, setFileType] = useState<CourseMaterial['fileType']>('pdf');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título del material es obligatorio.');
      return;
    }
    if (!courseId) {
      setError('Debes asociar el material a un curso.');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === courseId);

    setIsSubmitting(true);
    setError('');

    try {
      await onAddMaterial({
        courseId,
        courseName: selectedCourse?.name,
        courseCode: selectedCourse?.code,
        title: title.trim(),
        description: description.trim(),
        category,
        fileType,
        fileName: fileName.trim() || `${title.replace(/\s+/g, '_')}.${fileType}`,
        fileUrl: fileUrl.trim() || `https://storage.supabase.co/unihub/${courseId}/${Date.now()}_material.${fileType}`,
        fileSize: fileSize || '2.0 MB',
      });
      // Reset & close
      setTitle('');
      setDescription('');
      setFileName('');
      setFileUrl('');
      onClose();
    } catch (err) {
      setError('Error al guardar el material. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeMb} MB`);

      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') setFileType('pdf');
      else if (ext === 'docx' || ext === 'doc') setFileType('docx');
      else if (ext === 'pptx' || ext === 'ppt') setFileType('pptx');
      else if (ext === 'xlsx' || ext === 'xls') setFileType('xlsx');
      else if (ext === 'zip' || ext === 'rar') setFileType('zip');
      else setFileType('other');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Subir Material Académico</h2>
              <p className="text-xs text-slate-500">Biblioteca digital de la asignatura</p>
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
          {/* Curso Asociado */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Curso / Asignatura Destino *
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              required
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Título del Archivo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Título del Material *
            </label>
            <input
              type="text"
              placeholder="Ej: Diapositivas Unidad 2: Modelos IS-LM"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Categoría y Formato */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="lecture">Clase / Diapositivas</option>
                <option value="reading">Lectura Obligatoria</option>
                <option value="practice">Guía Práctica / Taller</option>
                <option value="syllabus">Sílabo Oficial</option>
                <option value="exam">Examen Anterior / Pauta</option>
                <option value="other">Otro Material</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Formato *
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as CourseMaterial['fileType'])}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="pdf">Documento PDF (.pdf)</option>
                <option value="pptx">Presentación PPTX (.pptx)</option>
                <option value="docx">Documento Word (.docx)</option>
                <option value="xlsx">Hoja de Cálculo Excel (.xlsx)</option>
                <option value="zip">Archivo Comprimido (.zip)</option>
                <option value="link">Enlace Web / Drive</option>
                <option value="other">Otro formato</option>
              </select>
            </div>
          </div>

          {/* Carga de Archivo / Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Seleccionar Archivo Local o URL
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <input
                type="file"
                id="file-upload"
                onChange={handleSimulatedFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-blue-600 hover:underline">
                  Haz clic para examinar tu dispositivo
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  PDF, PPTX, DOCX, XLSX hasta 50MB
                </p>
              </label>
            </div>
          </div>

          {fileName && (
            <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center justify-between border border-blue-100">
              <span className="font-medium truncate max-w-[280px]">{fileName}</span>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md">
                {fileSize}
              </span>
            </div>
          )}

          {/* Enlace o URL alternativa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Enlace de descarga o URL externa (Opcional)
            </label>
            <div className="relative">
              <Link className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://drive.google.com/... o enlace de Supabase"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descripción Breve */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción o Instrucciones
            </label>
            <textarea
              rows={2}
              placeholder="Instrucciones para la lectura, semanas que comprende o notas del profesor..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones de Acción */}
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
                <span>Guardando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publicar en Biblioteca</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
