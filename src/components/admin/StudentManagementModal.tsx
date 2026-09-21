import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Shield,
  Search,
  Edit2,
  Check,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../../types/academic';
import { academicService } from '../../services/academicService';

interface StudentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentUpdated?: () => void;
}

export const StudentManagementModal: React.FC<StudentManagementModalProps> = ({
  isOpen,
  onClose,
  onStudentUpdated,
}) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [targetSemester, setTargetSemester] = useState<number>(4);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStudents();
    }
  }, [isOpen]);

  const loadStudents = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await academicService.getStudents();
      setStudents(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error cargando padrón de alumnos.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.studentCode && s.studentCode.includes(search))
  );

  const handleStartEdit = (student: UserProfile) => {
    setEditingStudentId(student.id);
    setTargetSemester(student.enrolledSemesterNumber || 4);
  };

  const handleSaveSemester = async (studentId: string) => {
    try {
      await academicService.updateStudentSemester(studentId, targetSemester);
      setEditingStudentId(null);
      setSaveSuccessMsg('Ciclo académico del alumno actualizado correctamente.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
      await loadStudents();
      if (onStudentUpdated) onStudentUpdated();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error actualizando ciclo del alumno.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Panel de Administración Global</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {students.length} alumnos registrados
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Gestión Oficial de Alumnos y Matrícula
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Como Administrador Global, eres el único facultado para asignar y modificar el ciclo académico oficial de los alumnos en Supabase.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador y Mensajes */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por código de alumno, nombre o correo institucional..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {saveSuccessMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Listado de Alumnos */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Cargando padrón oficial de alumnos...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No se encontraron alumnos con los criterios de búsqueda.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isEditing = editingStudentId === student.id;

              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                      alt={student.fullName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {student.fullName}
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          Cod: {student.studentCode || 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{student.email}</span>
                        </span>
                        {student.phoneWhatsapp && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{student.phoneWhatsapp}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Asignación de Ciclo */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isEditing ? (
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-purple-200">
                        <select
                          value={targetSemester}
                          onChange={(e) => setTargetSemester(Number(e.target.value))}
                          className="text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}.º Ciclo
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleSaveSemester(student.id)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                          title="Guardar nuevo ciclo"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingStudentId(null)}
                          className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-xl">
                          {student.enrolledSemesterNumber || 4}.º Ciclo Oficial
                        </span>
                        <button
                          onClick={() => handleStartEdit(student)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-xl border border-purple-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Asignar Ciclo</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Facultad de Ciencias Económicas • Universidad Hub
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
