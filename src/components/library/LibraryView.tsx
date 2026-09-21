import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  FolderArchive,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Course, CourseMaterial, MaterialCategory, UserRole } from '../../types/academic';

interface LibraryViewProps {
  materials: CourseMaterial[];
  courses: Course[];
  userRole: UserRole;
  onAddMaterialClick: () => void;
  onDeleteMaterial: (materialId: string) => Promise<void>;
  onSelectCourse: (courseId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  materials,
  courses,
  userRole,
  onAddMaterialClick,
  onDeleteMaterial,
  onSelectCourse,
}) => {
  const isAdmin = userRole === 'admin';
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (item.courseName && item.courseName.toLowerCase().includes(search.toLowerCase()));

      const matchCourse =
        selectedCourseFilter === 'all' || item.courseId === selectedCourseFilter;

      const matchCategory =
        selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;

      return matchSearch && matchCourse && matchCategory;
    });
  }, [materials, search, selectedCourseFilter, selectedCategoryFilter]);

  const getCategoryBadge = (category: MaterialCategory) => {
    switch (category) {
      case 'syllabus':
        return { label: 'Sílabo Oficial', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'lecture':
        return { label: 'Diapositivas', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'reading':
        return { label: 'Lectura', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'practice':
        return { label: 'Práctica / Taller', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'exam':
        return { label: 'Exámenes Anteriores', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Material', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getFormatIconColor = (type: CourseMaterial['fileType']) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'pptx':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'docx':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'xlsx':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'zip':
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Encabezado y Acciones Principales */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                Fase 2: Biblioteca & Repositorio
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {materials.length} recursos almacenados
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Biblioteca y Archivos Académicos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Repositorio centralizado con sílabos, lecturas obligatorias, diapositivas y bancos de ejercicios clasificados por asignatura y ciclo.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={onAddMaterialClick}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Subir Material</span>
            </button>
          )}
        </div>

        {/* Filtros y Buscador */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Buscador */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por título, lectura o tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Filtro por Asignatura */}
          <div>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            >
              <option value="all">Todas las Asignaturas ({courses.length})</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Categoría */}
          <div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            >
              <option value="all">Todas las Categorías</option>
              <option value="syllabus">Sílabos Oficiales</option>
              <option value="lecture">Clases & Diapositivas</option>
              <option value="reading">Lecturas Obligatorias</option>
              <option value="practice">Guías y Prácticas</option>
              <option value="exam">Exámenes Anteriores</option>
              <option value="other">Otros Materiales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Materiales */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron materiales</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Intenta con otro término de búsqueda o selecciona una categoría diferente.
          </p>
          {isAdmin && (
            <button
              onClick={onAddMaterialClick}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 font-semibold text-xs rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Subir primer archivo
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((mat) => {
            const badge = getCategoryBadge(mat.category);
            const formatStyle = getFormatIconColor(mat.fileType);
            const parentCourse = courses.find((c) => c.id === mat.courseId);

            return (
              <div
                key={mat.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Fila Superior: Badges y Formato */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                      {parentCourse && (
                        <button
                          onClick={() => onSelectCourse(parentCourse.id)}
                          className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          {parentCourse.code}
                        </button>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border shrink-0 ${formatStyle}`}
                    >
                      {mat.fileType}
                    </span>
                  </div>

                  {/* Título y Descripción */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {mat.description || 'Sin descripción adicional disponible.'}
                    </p>
                  </div>

                  {/* Info del Archivo y Curso */}
                  <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between pt-1">
                    <span className="truncate max-w-[180px]">{mat.fileName}</span>
                    <span className="font-mono text-slate-500 font-bold shrink-0">{mat.fileSize}</span>
                  </div>
                </div>

                {/* Barra de Acciones */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {mat.downloadCount || 0} consultas / descargas
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isAdmin && (
                      <button
                        onClick={() => onDeleteMaterial(mat.id)}
                        title="Eliminar recurso"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar / Abrir</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
