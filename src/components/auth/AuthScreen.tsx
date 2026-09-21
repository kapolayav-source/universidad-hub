import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  UserCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { authService, PRESET_USERS } from '../../services/authService';
import { UserProfile } from '../../types/academic';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('+51987654321');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const result = await authService.signIn(email, password);
        if (result.success && result.user) {
          onLoginSuccess(result.user);
        } else {
          setErrorMsg(result.error || 'Credenciales no válidas. Revisa tu correo o usa los accesos institucionales.');
        }
      } else {
        if (!fullName.trim() || !studentCode.trim()) {
          setErrorMsg('Por favor completa todos los campos requeridos.');
          setLoading(false);
          return;
        }
        const result = await authService.signUpStudent({
          email,
          password,
          fullName,
          studentCode,
          phoneWhatsapp,
        });
        if (result.success && result.user) {
          setSuccessMsg('Estudiante registrado exitosamente. Accediendo al portal...');
          setTimeout(() => {
            onLoginSuccess(result.user!);
          }, 800);
        } else {
          setErrorMsg(result.error || 'No se pudo completar el registro de estudiante.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error inesperado durante la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (type: 'admin' | 'student') => {
    setLoading(true);
    setErrorMsg(null);
    const targetEmail =
      type === 'admin' ? PRESET_USERS.ADMIN.email : PRESET_USERS.STUDENT.email;
    const targetPassword =
      type === 'admin' ? PRESET_USERS.ADMIN.password : PRESET_USERS.STUDENT.password;

    setEmail(targetEmail);
    setPassword(targetPassword);

    try {
      const result = await authService.signIn(targetEmail, targetPassword);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMsg(result.error || 'No se pudo iniciar sesión con la cuenta de prueba.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error en acceso rápido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Cabecera Institucional */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-2">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Universidad Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Portal Académico Institucional • Sistema de Gestión y Biblioteca
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isSupabaseConfigured
                ? 'Conexión activa con Supabase Auth & RLS'
                : 'Modo Local Sandbox • Autenticación y Roles Simulados'}
            </span>
          </div>
        </div>

        {/* Accesos Rápidos de Verificación de Roles */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Prueba Rápida de Roles (Evaluación)
            </span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              1-Click
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-snug">
            Ingresa al instante con perfiles institucionales para comprobar las restricciones de permisos y RLS:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="flex items-start gap-2.5 p-3 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/70 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-purple-950 block group-hover:text-purple-700">
                  Administrador Global
                </span>
                <span className="text-[10px] text-purple-700 block truncate">
                  admin@unmsm.edu.pe
                </span>
                <span className="text-[9px] text-purple-600 block mt-0.5">
                  Control total de cursos, sílabos y biblioteca
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="flex items-start gap-2.5 p-3 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-left transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-blue-950 block group-hover:text-blue-700">
                  Alumno Oficial
                </span>
                <span className="text-[10px] text-blue-700 block truncate">
                  estudiante.economia@unmsm...
                </span>
                <span className="text-[9px] text-blue-600 block mt-0.5">
                  Solo lectura y descarga • 4.º Ciclo fijo
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Tarjeta Principal de Formulario */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {/* Selector de Pestaña */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Registrar Alumno
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 text-emerald-700 text-xs rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Nombre Completo del Alumno *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Andrés Morales Vega"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Código de Alumno *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      placeholder="22060142"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Ciclo Inicial
                    </label>
                    <input
                      type="text"
                      disabled
                      value="4.º Ciclo (Fijo)"
                      className="w-full text-xs px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Correo Institucional *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@unmsm.edu.pe"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Contraseña Institucional *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Validando credenciales...'
                  : mode === 'signin'
                  ? 'Acceder al Portal'
                  : 'Registrar Estudiante Oficial'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            {mode === 'signin' ? (
              <span>
                ¿No tienes cuenta de alumno?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Registrarse como Estudiante
                </button>
              </span>
            ) : (
              <span>
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
