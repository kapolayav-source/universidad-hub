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
  INITIAL_TEACHERS,
  INITIAL_SYLLABI,
  INITIAL_MATERIALS,
} from '../data/initialData';
import {
  University,
  Faculty,
  Career,
  Semester,
  Teacher,
  Course,
  ClassSession,
  Assignment,
  Exam,
  UserProfile,
  CourseSyllabus,
  CourseMaterial,
} from '../types/academic';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  USER_PROFILE: 'unihub_profile_v1',
  COURSES: 'unihub_courses_v2',
  CLASSES: 'unihub_classes_v1',
  ASSIGNMENTS: 'unihub_assignments_v1',
  EXAMS: 'unihub_exams_v1',
  TEACHERS: 'unihub_teachers_v1',
  SYLLABI: 'unihub_syllabi_v1',
  MATERIALS: 'unihub_materials_v1',
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

  // ==========================================
  // PERFIL DEL ESTUDIANTE Y CICLO
  // ==========================================
  async getUserProfile(): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      try {
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
              studentCode: profile.student_code || '22060142',
              universityId: INITIAL_UNIVERSITY.id,
              careerId: INITIAL_CAREER.id,
              currentSemesterId: INITIAL_SEMESTER.id,
            };
          }
        }
      } catch (err) {
        console.warn('Supabase auth/profile error, using local fallback:', err);
      }
    }
    return this.getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const updated = { ...current, ...profile };
    this.setStored(STORAGE_KEYS.USER_PROFILE, updated);

    if (isSupabaseConfigured && supabase && updated.id) {
      try {
        await supabase.from('profiles').update({
          full_name: updated.fullName,
          phone_whatsapp: updated.phoneWhatsapp,
        }).eq('id', updated.id);
      } catch (err) {
        console.warn('Could not sync profile update to Supabase:', err);
      }
    }
    return updated;
  }

  // ==========================================
  // JERARQUÍA ACADÉMICA
  // ==========================================
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

  // ==========================================
  // GESTIÓN DINÁMICA DE DOCENTES
  // ==========================================
  async getTeachers(): Promise<Teacher[]> {
    const defaultTeachers = Object.values(INITIAL_TEACHERS);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('teachers').select('*');
        if (!error && data && data.length > 0) {
          return data.map((t) => ({
            id: t.id,
            fullName: t.full_name,
            email: t.email,
            department: t.department,
            officeLocation: t.office_location,
          }));
        }
      } catch (e) {
        console.warn('Supabase getTeachers fallback to local:', e);
      }
    }
    return this.getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, defaultTeachers);
  }

  async addTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    const current = await this.getTeachers();
    const newTeacher: Teacher = {
      ...teacher,
      id: `t-${Date.now()}`,
    };
    const updated = [...current, newTeacher];
    this.setStored(STORAGE_KEYS.TEACHERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('teachers').insert({
          id: newTeacher.id,
          full_name: newTeacher.fullName,
          email: newTeacher.email,
          department: newTeacher.department,
          office_location: newTeacher.officeLocation,
        });
      } catch (e) {
        console.warn('Error syncing new teacher to Supabase:', e);
      }
    }
    return newTeacher;
  }

  async updateTeacher(teacherId: string, updates: Partial<Teacher>): Promise<Teacher> {
    const teachers = await this.getTeachers();
    let updatedTeacher: Teacher | undefined;
    const updatedList = teachers.map((t) => {
      if (t.id === teacherId) {
        updatedTeacher = { ...t, ...updates };
        return updatedTeacher;
      }
      return t;
    });
    this.setStored(STORAGE_KEYS.TEACHERS, updatedList);

    if (isSupabaseConfigured && supabase && updatedTeacher) {
      try {
        await supabase.from('teachers').update({
          full_name: updatedTeacher.fullName,
          email: updatedTeacher.email,
          department: updatedTeacher.department,
          office_location: updatedTeacher.officeLocation,
        }).eq('id', teacherId);
      } catch (e) {
        console.warn('Error updating teacher in Supabase:', e);
      }
    }
    return updatedTeacher || { id: teacherId, fullName: '', ...updates };
  }

  // ==========================================
  // GESTIÓN DINÁMICA DE CURSOS
  // ==========================================
  async getCourses(semesterId?: string): Promise<Course[]> {
    const stored = this.getStored<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    if (semesterId) {
      return stored.filter((c) => c.semesterId === semesterId);
    }
    return stored;
  }

  async getCourseById(courseId: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find((c) => c.id === courseId);
  }

  async addCourse(newCourseData: {
    semesterId: string;
    teacherId?: string;
    code: string;
    name: string;
    description: string;
    colorHex: string;
    credits: number;
  }): Promise<Course> {
    const courses = await this.getCourses();
    const teachers = await this.getTeachers();
    const teacher = newCourseData.teacherId
      ? teachers.find((t) => t.id === newCourseData.teacherId)
      : undefined;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      semesterId: newCourseData.semesterId,
      teacherId: newCourseData.teacherId,
      teacher,
      code: newCourseData.code.trim().toUpperCase(),
      name: newCourseData.name.trim(),
      description: newCourseData.description.trim(),
      colorHex: newCourseData.colorHex || '#2563eb',
      credits: newCourseData.credits || 4,
      schedules: [
        {
          id: `sch-${Date.now()}`,
          courseId: `course-${Date.now()}`,
          dayOfWeek: 2,
          dayName: 'Martes',
          startTime: '08:00',
          endTime: '10:00',
          classroom: 'Aula FCE - Por Definir',
        },
      ],
      classesCount: 0,
      assignmentsCount: 0,
      examsCount: 0,
      progressPercentage: 0,
      materialsCount: 0,
    };

    const updated = [...courses, newCourse];
    this.setStored(STORAGE_KEYS.COURSES, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').insert({
          id: newCourse.id,
          semester_id: newCourse.semesterId,
          teacher_id: newCourse.teacherId,
          code: newCourse.code,
          name: newCourse.name,
          description: newCourse.description,
          color_hex: newCourse.colorHex,
          credits: newCourse.credits,
        });
      } catch (e) {
        console.warn('Error inserting course to Supabase:', e);
      }
    }

    return newCourse;
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course[]> {
    const courses = await this.getCourses();
    const teachers = await this.getTeachers();

    const updatedCourses = courses.map((c) => {
      if (c.id === courseId) {
        const teacher = updates.teacherId
          ? teachers.find((t) => t.id === updates.teacherId) || c.teacher
          : c.teacher;
        return { ...c, ...updates, teacher };
      }
      return c;
    });

    this.setStored(STORAGE_KEYS.COURSES, updatedCourses);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').update({
          name: updates.name,
          code: updates.code,
          description: updates.description,
          credits: updates.credits,
          color_hex: updates.colorHex,
          teacher_id: updates.teacherId,
        }).eq('id', courseId);
      } catch (e) {
        console.warn('Error updating course in Supabase:', e);
      }
    }

    return updatedCourses;
  }

  async deleteCourse(courseId: string): Promise<Course[]> {
    const courses = await this.getCourses();
    const filtered = courses.filter((c) => c.id !== courseId);
    this.setStored(STORAGE_KEYS.COURSES, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').delete().eq('id', courseId);
      } catch (e) {
        console.warn('Error deleting course from Supabase:', e);
      }
    }

    return filtered;
  }

  // ==========================================
  // GESTIÓN DINÁMICA DE SÍLABOS
  // ==========================================
  async getSyllabus(courseId: string): Promise<CourseSyllabus | null> {
    const allSyllabi = this.getStored<Record<string, CourseSyllabus>>(
      STORAGE_KEYS.SYLLABI,
      INITIAL_SYLLABI
    );

    if (allSyllabi[courseId]) {
      return allSyllabi[courseId];
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('course_syllabi')
          .select('*')
          .eq('course_id', courseId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            courseId: data.course_id,
            academicYear: data.academic_year,
            version: data.version,
            summary: data.summary,
            competencies: data.competencies || [],
            evaluationSystem: data.evaluation_system,
            fileUrl: data.file_url,
            fileName: data.file_name,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.warn('Error fetching syllabus from Supabase:', e);
      }
    }

    return null;
  }

  async saveSyllabus(
    courseId: string,
    syllabusData: Omit<CourseSyllabus, 'id' | 'courseId' | 'updatedAt'> & { id?: string }
  ): Promise<CourseSyllabus> {
    const allSyllabi = this.getStored<Record<string, CourseSyllabus>>(
      STORAGE_KEYS.SYLLABI,
      INITIAL_SYLLABI
    );

    const savedSyllabus: CourseSyllabus = {
      id: syllabusData.id || `syl-${Date.now()}`,
      courseId,
      academicYear: syllabusData.academicYear || '2026-I',
      version: syllabusData.version || '1.0',
      summary: syllabusData.summary,
      competencies: syllabusData.competencies || [],
      evaluationSystem: syllabusData.evaluationSystem,
      fileUrl: syllabusData.fileUrl,
      fileName: syllabusData.fileName,
      fileSize: syllabusData.fileSize || '1.2 MB',
      updatedAt: new Date().toISOString(),
    };

    allSyllabi[courseId] = savedSyllabus;
    this.setStored(STORAGE_KEYS.SYLLABI, allSyllabi);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('course_syllabi').upsert({
          course_id: courseId,
          academic_year: savedSyllabus.academicYear,
          version: savedSyllabus.version,
          summary: savedSyllabus.summary,
          competencies: savedSyllabus.competencies,
          evaluation_system: savedSyllabus.evaluationSystem,
          file_url: savedSyllabus.fileUrl,
          file_name: savedSyllabus.fileName,
          updated_at: savedSyllabus.updatedAt,
        }, { onConflict: 'course_id,academic_year' });
      } catch (e) {
        console.warn('Error upserting syllabus to Supabase:', e);
      }
    }

    return savedSyllabus;
  }

  // ==========================================
  // GESTIÓN DINÁMICA DE MATERIALES Y BIBLIOTECA
  // ==========================================
  async getMaterials(courseId?: string): Promise<CourseMaterial[]> {
    const materials = this.getStored<CourseMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    if (courseId) {
      return materials.filter((m) => m.courseId === courseId);
    }
    return materials;
  }

  async addMaterial(newMat: Omit<CourseMaterial, 'id' | 'createdAt' | 'downloadCount'>): Promise<CourseMaterial> {
    const materials = await this.getMaterials();
    const created: CourseMaterial = {
      ...newMat,
      id: `mat-${Date.now()}`,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [created, ...materials];
    this.setStored(STORAGE_KEYS.MATERIALS, updated);

    // Actualizar conteo en el curso respectivo
    const courses = await this.getCourses();
    const updatedCourses = courses.map((c) => {
      if (c.id === newMat.courseId) {
        return { ...c, materialsCount: (c.materialsCount || 0) + 1 };
      }
      return c;
    });
    this.setStored(STORAGE_KEYS.COURSES, updatedCourses);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('course_materials').insert({
          id: created.id,
          course_id: created.courseId,
          title: created.title,
          description: created.description,
          category: created.category,
          file_url: created.fileUrl,
          file_name: created.fileName,
          file_type: created.fileType,
          file_size_bytes: 1024 * 1024,
        });
      } catch (e) {
        console.warn('Error inserting material to Supabase:', e);
      }
    }

    return created;
  }

  async deleteMaterial(materialId: string): Promise<CourseMaterial[]> {
    const materials = await this.getMaterials();
    const filtered = materials.filter((m) => m.id !== materialId);
    this.setStored(STORAGE_KEYS.MATERIALS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('course_materials').delete().eq('id', materialId);
      } catch (e) {
        console.warn('Error deleting material from Supabase:', e);
      }
    }

    return filtered;
  }

  async incrementMaterialDownload(materialId: string): Promise<void> {
    const materials = await this.getMaterials();
    const updated = materials.map((m) => {
      if (m.id === materialId) {
        return { ...m, downloadCount: (m.downloadCount || 0) + 1 };
      }
      return m;
    });
    this.setStored(STORAGE_KEYS.MATERIALS, updated);
  }

  // ==========================================
  // CLASES, TAREAS Y EVALUACIONES
  // ==========================================
  async getClasses(courseId?: string): Promise<ClassSession[]> {
    const classes = this.getStored<ClassSession[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
    if (courseId) {
      return classes.filter((cls) => cls.courseId === courseId);
    }
    return classes;
  }

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

  async getExams(courseId?: string): Promise<Exam[]> {
    const exams = this.getStored<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    if (courseId) {
      return exams.filter((e) => e.courseId === courseId);
    }
    return exams;
  }

  async getNextClass(): Promise<{
    course: Course;
    scheduleDay: string;
    startTime: string;
    endTime: string;
    classroom: string;
    isToday: boolean;
  } | null> {
    const courses = await this.getCourses();
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

