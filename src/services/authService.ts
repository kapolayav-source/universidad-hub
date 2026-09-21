import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types/academic';
import {
  INITIAL_USER_PROFILE,
  INITIAL_ADMIN_PROFILE,
  INITIAL_UNIVERSITY,
  INITIAL_CAREER,
  INITIAL_SEMESTER,
} from '../data/initialData';

const AUTH_STORAGE_KEY = 'unihub_auth_session_v2';
const REGISTERED_USERS_KEY = 'unihub_registered_users_v2';

// Cuentas institucionales precargadas para acceso rápido
export const PRESET_USERS = {
  ADMIN: {
    email: 'admin@unmsm.edu.pe',
    password: 'adminpassword123',
    profile: INITIAL_ADMIN_PROFILE,
    roleLabel: 'Administrador Global',
  },
  STUDENT: {
    email: 'estudiante.economia@unmsm.edu.pe',
    password: 'studentpassword123',
    profile: INITIAL_USER_PROFILE,
    roleLabel: 'Alumno Oficial (4.º Ciclo)',
  },
};

type AuthListener = (user: UserProfile | null) => void;

class AuthService {
  private currentUser: UserProfile | null = null;
  private listeners: AuthListener[] = [];
  private isInitialized = false;

  constructor() {
    this.initSession();
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    // Ejecutar de inmediato si ya está inicializado
    if (this.isInitialized) {
      listener(this.currentUser);
    }
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public onAuthStateChange(listener: AuthListener): () => void {
    return this.subscribe(listener);
  }

  // Inicialización de sesión al cargar la app o recargar página (F5)
  public async initSession(): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const authUser = sessionData.session.user;
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();

          if (!error && profileData) {
            // El rol viene EXCLUSIVAMENTE de la base de datos Supabase
            const role: UserRole = profileData.role === 'admin' ? 'admin' : 'student';
            this.currentUser = {
              id: profileData.id,
              email: profileData.email || authUser.email || '',
              fullName: profileData.full_name || 'Usuario Universitario',
              avatarUrl: profileData.avatar_url || (role === 'admin' ? INITIAL_ADMIN_PROFILE.avatarUrl : INITIAL_USER_PROFILE.avatarUrl),
              role,
              phoneWhatsapp: profileData.phone_whatsapp || '+51987654321',
              studentCode: profileData.student_code || (role === 'admin' ? 'ADM-001' : '22060142'),
              universityId: INITIAL_UNIVERSITY.id,
              careerId: INITIAL_CAREER.id,
              currentSemesterId: INITIAL_SEMESTER.id,
              enrolledSemesterNumber: profileData.enrolled_semester_number || 4,
            };
            this.saveLocalBackup(this.currentUser);
            this.isInitialized = true;
            this.notifyListeners();
            return this.currentUser;
          }
        }
      } catch (err) {
        console.warn('Error verificando sesión en Supabase:', err);
      }
    }

    // Si Supabase no está configurado o falló, recuperar sesión local persistida
    const stored = this.getLocalBackup();
    if (stored) {
      this.currentUser = stored;
    } else {
      // Por defecto no hay sesión abierta
      this.currentUser = null;
    }

    this.isInitialized = true;
    this.notifyListeners();
    return this.currentUser;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  public isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  public isStudent(): boolean {
    return this.currentUser?.role === 'student';
  }

  // Inicio de sesión con correo y contraseña
  public async signIn(email: string, password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Si Supabase está conectado, autenticar directamente con Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password || 'tempPassword123',
        });

        if (error) {
          // Si el usuario intentó con una de las cuentas predeterminadas y no existe en Supabase, dar sugerencia clara
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const role: UserRole = profile?.role === 'admin' ? 'admin' : 'student';
          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName: profile?.full_name || cleanEmail.split('@')[0],
            avatarUrl: profile?.avatar_url || (role === 'admin' ? INITIAL_ADMIN_PROFILE.avatarUrl : INITIAL_USER_PROFILE.avatarUrl),
            role,
            phoneWhatsapp: profile?.phone_whatsapp || '+51987654321',
            studentCode: profile?.student_code || (role === 'admin' ? 'ADM-001' : '22060142'),
            universityId: INITIAL_UNIVERSITY.id,
            careerId: INITIAL_CAREER.id,
            currentSemesterId: INITIAL_SEMESTER.id,
            enrolledSemesterNumber: profile?.enrolled_semester_number || 4,
          };

          this.currentUser = userProfile;
          this.saveLocalBackup(userProfile);
          this.notifyListeners();
          return { success: true, user: userProfile };
        }
      } catch (err: any) {
        console.warn('Error en Supabase signIn:', err);
      }
    }

    // 2. Modo Sandbox / Fallback Local (Persistencia garantizada)
    // Coincidencia con Admin Predefinido
    if (cleanEmail === PRESET_USERS.ADMIN.email.toLowerCase()) {
      this.currentUser = { ...INITIAL_ADMIN_PROFILE };
      this.saveLocalBackup(this.currentUser);
      this.notifyListeners();
      return { success: true, user: this.currentUser };
    }

    // Coincidencia con Alumno Predefinido
    if (cleanEmail === PRESET_USERS.STUDENT.email.toLowerCase()) {
      this.currentUser = { ...INITIAL_USER_PROFILE };
      this.saveLocalBackup(this.currentUser);
      this.notifyListeners();
      return { success: true, user: this.currentUser };
    }

    // Buscar en usuarios locales registrados previamente
    const customUsers = this.getRegisteredUsers();
    const existing = customUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      this.currentUser = existing;
      this.saveLocalBackup(existing);
      this.notifyListeners();
      return { success: true, user: existing };
    }

    // Si es un email nuevo sin contraseña registrada en modo offline, crear como Alumno (nunca Admin)
    const newStudent: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      studentCode: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      avatarUrl: INITIAL_USER_PROFILE.avatarUrl,
      role: 'student', // REGLA: Los registros nuevos SIEMPRE son alumnos
      phoneWhatsapp: '+51987654321',
      universityId: INITIAL_UNIVERSITY.id,
      careerId: INITIAL_CAREER.id,
      currentSemesterId: INITIAL_SEMESTER.id,
      enrolledSemesterNumber: 4,
    };

    this.saveRegisteredUser(newStudent);
    this.currentUser = newStudent;
    this.saveLocalBackup(newStudent);
    this.notifyListeners();
    return { success: true, user: newStudent };
  }

  // Registro explícito de nuevo Alumno (con Supabase Auth o Local)
  public async signUpStudent(data: {
    email: string;
    password?: string;
    fullName: string;
    studentCode: string;
    phoneWhatsapp?: string;
  }): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const cleanEmail = data.email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: data.password || 'password123',
          options: {
            data: {
              full_name: data.fullName,
              student_code: data.studentCode,
              role: 'student', // Estricto: Alumno
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (authData.user) {
          const profile: UserProfile = {
            id: authData.user.id,
            email: cleanEmail,
            fullName: data.fullName,
            studentCode: data.studentCode,
            avatarUrl: INITIAL_USER_PROFILE.avatarUrl,
            role: 'student',
            phoneWhatsapp: data.phoneWhatsapp || '+51987654321',
            universityId: INITIAL_UNIVERSITY.id,
            careerId: INITIAL_CAREER.id,
            currentSemesterId: INITIAL_SEMESTER.id,
            enrolledSemesterNumber: 4,
          };

          this.currentUser = profile;
          this.saveLocalBackup(profile);
          this.notifyListeners();
          return { success: true, user: profile };
        }
      } catch (err: any) {
        console.warn('Error en Supabase signUp:', err);
      }
    }

    // Registro local
    const newStudent: UserProfile = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      fullName: data.fullName.trim(),
      studentCode: data.studentCode.trim(),
      avatarUrl: INITIAL_USER_PROFILE.avatarUrl,
      role: 'student',
      phoneWhatsapp: data.phoneWhatsapp || '+51987654321',
      universityId: INITIAL_UNIVERSITY.id,
      careerId: INITIAL_CAREER.id,
      currentSemesterId: INITIAL_SEMESTER.id,
      enrolledSemesterNumber: 4,
    };

    this.saveRegisteredUser(newStudent);
    this.currentUser = newStudent;
    this.saveLocalBackup(newStudent);
    this.notifyListeners();
    return { success: true, user: newStudent };
  }

  // Cierre de sesión seguro y completo
  public async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error durante signOut en Supabase:', err);
      }
    }

    // Limpiar estado en memoria y almacenamiento local
    this.currentUser = null;
    this.clearLocalBackup();
    this.notifyListeners();
  }

  // Métodos de persistencia local auxiliar
  private getLocalBackup(): UserProfile | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveLocalBackup(user: UserProfile) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  private clearLocalBackup() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  private getRegisteredUsers(): UserProfile[] {
    try {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveRegisteredUser(user: UserProfile) {
    const list = this.getRegisteredUsers();
    const filtered = list.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...filtered, user]));
    } catch {
      // ignore
    }
  }
}

export const authService = new AuthService();
