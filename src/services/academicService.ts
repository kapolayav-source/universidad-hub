import {
  INITIAL_UNIVERSITY,
  INITIAL_FACULTY,
  INITIAL_CAREER,
  INITIAL_SEMESTER,
  INITIAL_COURSES,
  INITIAL_CLASSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_USER_PROFILE,
} from '../data/initialData';
import {
  University,
  Faculty,
  Career,
  Semester,
  Course,
  ClassSession,
  Assignment,
  Exam,
  UserProfile,
} from '../types/academic';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  USER_PROFILE: 'unihub_profile_v1',
  COURSES: 'unihub_courses_v1',
  CLASSES: 'unihub_classes_v1',
  ASSIGNMENTS: 'unihub_assignments_v1',
  EXAMS: 'unihub_exams_v1',
};

class AcademicService {
  private getStored<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignorar errores de quota en localStorage
    }
  }

  // Perfil del Usuario
  async getUserProfile(): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        if (profile) {
          return {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
            role: profile.role || 'student',
            phoneWhatsapp: profile.phone_whatsapp,
            universityId: INITIAL_UNIVERSITY.id,
            careerId: INITIAL_CAREER.id,
            currentSemesterId: INITIAL_SEMESTER.id,
          };
        }
      }
    }
    return this.getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const updated = { ...current, ...profile };
    this.setStored(STORAGE_KEYS.USER_PROFILE, updated);

    if (isSupabaseConfigured && supabase && updated.id) {
      await supabase.from('profiles').update({
        full_name: updated.fullName,
        phone_whatsapp: updated.phoneWhatsapp,
      }).eq('id', updated.id);
    }
    return updated;
  }

  // Jerarquía Académica
  async getAcademicHierarchy(): Promise<{
    university: University;
    faculty: Faculty;
    career: Career;
    semester: Semester;
  }> {
    return {
      university: INITIAL_UNIVERSITY,
      faculty: INITIAL_FACULTY,
      career: INITIAL_CAREER,
      semester: INITIAL_SEMESTER,
    };
  }

  // Cursos del Semestre
  async getCourses(): Promise<Course[]> {
    return this.getStored<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }

  async getCourseById(courseId: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find((c) => c.id === courseId);
  }

  // Clases por Curso o Totales
  async getClasses(courseId?: string): Promise<ClassSession[]> {
    const classes = this.getStored<ClassSession[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    if (courseId) {
      return classes.filter((cls) => cls.courseId === courseId);
    }
    return classes;
  }

  // Tareas
  async getAssignments(courseId?: string): Promise<Assignment[]> {
    const assignments = this.getStored<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    if (courseId) {
      return assignments.filter((asg) => asg.courseId === courseId);
    }
    return assignments;
  }

  async toggleAssignmentStatus(assignmentId: string): Promise<Assignment[]> {
    const assignments = await this.getAssignments();
    const updated = assignments.map((asg) => {
      if (asg.id === assignmentId) {
        const newStatus = asg.status === 'completed' ? 'pending' : 'completed';
        return { ...asg, status: newStatus as Assignment['status'] };
      }
      return asg;
    });
    this.setStored(STORAGE_KEYS.ASSIGNMENTS, updated);
    return updated;
  }

  async addAssignment(newAssignment: Omit<Assignment, 'id'>): Promise<Assignment> {
    const assignments = await this.getAssignments();
    const created: Assignment = {
      ...newAssignment,
      id: `asg-${Date.now()}`,
    };
    const updated = [created, ...assignments];
    this.setStored(STORAGE_KEYS.ASSIGNMENTS, updated);
    return created;
  }

  // Exámenes
  async getExams(courseId?: string): Promise<Exam[]> {
    const exams = this.getStored<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    if (courseId) {
      return exams.filter((e) => e.courseId === courseId);
    }
    return exams;
  }

  // Próxima Clase Activa (para el Dashboard)
  async getNextClass(): Promise<{
    course: Course;
    scheduleDay: string;
    startTime: string;
    endTime: string;
    classroom: string;
    isToday: boolean;
  } | null> {
    const courses = await this.getCourses();
    // Por defecto encontramos la clase más próxima relevante (Macroeconomía I o Microeconomía II)
    const macro = courses.find((c) => c.id === 'course-macro-1') || courses[0];
    if (!macro || !macro.schedules.length) return null;

    const schedule = macro.schedules[0];
    return {
      course: macro,
      scheduleDay: schedule.dayName,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      classroom: schedule.classroom,
      isToday: true,
    };
  }
}

export const academicService = new AcademicService();
