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
import { authService } from './authService';

const STORAGE_KEYS = {
  USER_PROFILE: 'unihub_profile_v2',
  COURSES: 'unihub_courses_v2',
  CLASSES: 'unihub_classes_v1',
  ASSIGNMENTS: 'unihub_assignments_v1',
  EXAMS: 'unihub_exams_v1',
  TEACHERS: 'unihub_teachers_v1',
  SYLLABI: 'unihub_syllabi_v1',
  MATERIALS: 'unihub_materials_v1',
  STUDENTS_LIST: 'unihub_students_directory_v2',
};

// Semilleros de malla curricular para los 10 ciclos (Informativo / Explorador)
const CURRICULUM_MALLA: Record<number, Array<{ code: string; name: string; credits: number; description: string }>> = {
  1: [
    { code: 'ECO-101', name: 'Introducción a las Ciencias Económicas', credits: 4, description: 'Conceptos fundamentales de escasez, costo de oportunidad y sistemas económicos.' },
    { code: 'MAT-101', name: 'Matemática Básica I', credits: 4, description: 'Lógica proposicional, teoría de conjuntos, números reales y álgebra vectorial.' },
    { code: 'HUM-101', name: 'Lenguaje y Redacción Académica', credits: 3, description: 'Desarrollo de competencias de comunicación oral y producción de textos científicos.' },
    { code: 'SOC-101', name: 'Sociología General', credits: 3, description: 'Estructuras sociales, instituciones y dinámicas de estratificación.' },
    { code: 'HIS-101', name: 'Historia Económica Mundial', credits: 3, description: 'Revoluciones industriales y evolución del comercio internacional.' },
  ],
  2: [
    { code: 'ECO-201', name: 'Microeconomía I', credits: 4, description: 'Teoría del consumidor, elección bajo incertidumbre y teoría de la firma en competencia perfecta.' },
    { code: 'MAT-201', name: 'Cálculo Diferencial e Integral', credits: 4, description: 'Límites, derivadas, optimización de una variable e integrales definidas.' },
    { code: 'EST-201', name: 'Estadística Descriptiva y Probabilidades', credits: 4, description: 'Medidas de tendencia central, dispersión y distribuciones probabilísticas.' },
    { code: 'CON-201', name: 'Contabilidad General y Financiera', credits: 3, description: 'Partida doble, estados financieros y balances contables.' },
    { code: 'MET-201', name: 'Metodología del Trabajo Intelectual', credits: 2, description: 'Técnicas de fichaje, redacción de ensayos e investigación.' },
  ],
  3: [
    { code: 'ECO-301', name: 'Microeconomía II (Competencia)', credits: 4, description: 'Equilibrio general walrasiano y teoría de la producción.' },
    { code: 'MAT-301', name: 'Cálculo Multivariable', credits: 4, description: 'Gradiente, hessiano, multiplicadores de Lagrange y optimización con restricciones.' },
    { code: 'EST-301', name: 'Inferencia Estadística', credits: 4, description: 'Estimación puntual, intervalos de confianza y pruebas de hipótesis.' },
    { code: 'HIS-301', name: 'Historia Económica del Perú', credits: 3, description: 'Evolución económica desde el virreinato hasta la época republicana.' },
    { code: 'LEG-301', name: 'Derecho Económico y Empresarial', credits: 3, description: 'Regulación mercantil, contratos y libre competencia.' },
  ],
  4: [
    { code: 'ECO-401', name: 'Macroeconomía I', credits: 4, description: 'Determinación del ingreso nacional, equilibrio en mercados de bienes y dinero (IS-LM).' },
    { code: 'ECO-402', name: 'Microeconomía II', credits: 4, description: 'Estructuras no competitivas: monopolio, monopsonio, oligopolio y teoría de juegos.' },
    { code: 'CON-403', name: 'Contabilidad de Costos y Presupuestos', credits: 3, description: 'Sistemas de costeo por órdenes, costeo por procesos y costeo ABC.' },
    { code: 'MAT-404', name: 'Matemática Aplicada III', credits: 4, description: 'Ecuaciones diferenciales y en diferencias finitas para modelos dinámicos.' },
    { code: 'HUM-405', name: 'Filosofía y Ética Social', credits: 3, description: 'Doctrinas éticas, economía del bienestar y justicia distributiva.' },
    { code: 'INV-406', name: 'Metodología de la Investigación', credits: 3, description: 'Diseño empírico y formulación de proyectos de tesis.' },
  ],
  5: [
    { code: 'ECO-501', name: 'Macroeconomía II', credits: 4, description: 'Economía abierta (Mundell-Fleming), expectativas racionales y modelos de crecimiento Solow.' },
    { code: 'MET-501', name: 'Econometría I', credits: 4, description: 'Modelo clásico de regresión lineal (MCO), pruebas de especificación y multicolinealidad.' },
    { code: 'FIN-501', name: 'Finanzas Corporativas I', credits: 4, description: 'Valor del dinero en el tiempo, valorización de bonos/acciones y costo de capital WACC.' },
    { code: 'PUB-501', name: 'Economía del Sector Público', credits: 3, description: 'Bienes públicos, externalidades, tributación y presupuesto del Estado.' },
    { code: 'OPT-501', name: 'Organización Industrial', credits: 3, description: 'Diferenciación de productos, colusión y barreras de entrada.' },
  ],
  6: [
    { code: 'MET-601', name: 'Econometría II', credits: 4, description: 'Series de tiempo (ARIMA, VAR, cointegración) y datos de panel.' },
    { code: 'POL-601', name: 'Política Monetaria y Fiscal', credits: 4, description: 'Regla de Taylor, metas explícitas de inflación y sostenibilidad de la deuda pública.' },
    { code: 'INT-601', name: 'Comercio Internacional', credits: 4, description: 'Modelos Ricardiano, Heckscher-Ohlin y nueva teoría del comercio de Krugman.' },
    { code: 'FIN-601', name: 'Mercado de Capitales y Derivados', credits: 3, description: 'Opciones, futuros, swaps y gestión de riesgos financieros.' },
    { code: 'EVA-601', name: 'Evaluación Privada de Proyectos', credits: 3, description: 'Flujos de caja proyectados, VAN, TIR y análisis de sensibilidad.' },
  ],
  7: [
    { code: 'INT-701', name: 'Finanzas Internacionales', credits: 4, description: 'Paridad de poder de compra, tipos de cambio y balanza de pagos.' },
    { code: 'DES-701', name: 'Desarrollo Económico', credits: 4, description: 'Pobreza, desigualdad, capital humano e instituciones.' },
    { code: 'SOC-701', name: 'Evaluación Social de Proyectos', credits: 4, description: 'Precios sombra, beneficios sociales y metodología SNIP/Invierte.pe.' },
    { code: 'REG-701', name: 'Economía de la Regulación y Servicios Públicos', credits: 3, description: 'Regulación por costo del servicio, precios tope (RPI-X) y monopolios naturales.' },
    { code: 'TES-701', name: 'Seminario de Tesis I', credits: 3, description: 'Elaboración del plan de tesis y recopilación de base de datos.' },
  ],
  8: [
    { code: 'AMB-801', name: 'Economía Ambiental y Recursos Naturales', credits: 3, description: 'Valoración contingente, costos de abatimiento y recursos renovables/agotables.' },
    { code: 'EXP-801', name: 'Economía Experimental y del Comportamiento', credits: 3, description: 'Sesgos cognitivos, teoría de prospectos y experimentos de laboratorio.' },
    { code: 'BAN-801', name: 'Economía Bancaria y Riesgo Crediticio', credits: 4, description: 'Basilea III, riesgo de crédito, liquidez y riesgo sistémico.' },
    { code: 'DIR-801', name: 'Dirección Estratégica para Economistas', credits: 3, description: 'Modelos de negocio y consultoría económica.' },
    { code: 'TES-801', name: 'Seminario de Tesis II', credits: 4, description: 'Desarrollo del marco analítico y contrastación econométrica.' },
  ],
  9: [
    { code: 'TOP-901', name: 'Tópicos Avanzados de Macroeconometría', credits: 4, description: 'Modelos DSGE y microfundamentos del ciclo económico.' },
    { code: 'INT-901', name: 'Inteligencia de Datos para Ciencias Sociales', credits: 3, description: 'Machine Learning aplicado a predicción económica con Python y R.' },
    { code: 'CON-901', name: 'Consultoría Económica y Dictamen Pericial', credits: 3, description: 'Estudios de concentración económica y disputas comerciales.' },
    { code: 'PRA-901', name: 'Prácticas Preprofesionales I', credits: 4, description: 'Desempeño en entidades del sistema financiero o sector público.' },
    { code: 'TES-901', name: 'Taller de Tesis III', credits: 4, description: 'Redacción de resultados empíricos y discusión teórica.' },
  ],
  10: [
    { code: 'POL-1001', name: 'Seminario de Política Económica Nacional', credits: 4, description: 'Discusión con autoridades del MEF, BCRP y organismos reguladores.' },
    { code: 'DEO-1001', name: 'Deontología y Ética Profesional', credits: 2, description: 'Código de ética del Colegio de Economistas y responsabilidad social.' },
    { code: 'PRA-1001', name: 'Prácticas Preprofesionales II', credits: 4, description: 'Consolidación de experiencia profesional supervisada.' },
    { code: 'TES-1001', name: 'Sustentación y Memoria de Grado', credits: 6, description: 'Finalización formal de la tesis de licenciatura.' },
  ],
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
      // ignore
    }
  }

  // Comprobación de seguridad en capa de servicio
  private assertAdmin(actionDescription: string) {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      throw new Error(
        `Acceso denegado: Se requieren permisos de Administrador Global para ${actionDescription}. Los alumnos no pueden realizar esta acción.`
      );
    }
  }

  // ==========================================
  // PERFIL DEL USUARIO
  // ==========================================
  async getUserProfile(): Promise<UserProfile> {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser) {
      return sessionUser;
    }
    return this.getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
  }

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const isCallerAdmin = authService.isAdmin();

    // Regla de seguridad: Si no es admin, no puede cambiar su rol ni su semestre oficial
    const safeUpdates: Partial<UserProfile> = {
      fullName: profile.fullName ?? current.fullName,
      phoneWhatsapp: profile.phoneWhatsapp ?? current.phoneWhatsapp,
      avatarUrl: profile.avatarUrl ?? current.avatarUrl,
    };

    if (isCallerAdmin) {
      if (profile.role) safeUpdates.role = profile.role;
      if (profile.enrolledSemesterNumber) safeUpdates.enrolledSemesterNumber = profile.enrolledSemesterNumber;
      if (profile.studentCode) safeUpdates.studentCode = profile.studentCode;
    }

    const updated = { ...current, ...safeUpdates };
    this.setStored(STORAGE_KEYS.USER_PROFILE, updated);

    if (isSupabaseConfigured && supabase && updated.id) {
      try {
        const payload: Record<string, any> = {
          full_name: updated.fullName,
          phone_whatsapp: updated.phoneWhatsapp,
        };
        if (isCallerAdmin) {
          if (updated.role) payload.role = updated.role;
          if (updated.enrolledSemesterNumber) payload.enrolled_semester_number = updated.enrolledSemesterNumber;
        }
        await supabase.from('profiles').update(payload).eq('id', updated.id);
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
  // EXPLORADOR DE MALLA CURRICULAR (INFORMATIVO)
  // Permite consultar los 10 ciclos sin alterar el ciclo oficial del alumno
  // ==========================================
  getCurriculumBySemester(semesterNumber: number) {
    const cycle = Math.min(Math.max(semesterNumber, 1), 10);
    return CURRICULUM_MALLA[cycle] || [];
  }

  // ==========================================
  // GESTIÓN DE DOCENTES (ASOCIADOS A CURSOS)
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
        console.warn('Error fetching teachers from Supabase, using stored:', e);
      }
    }
    return this.getStored<Teacher[]>(STORAGE_KEYS.TEACHERS, defaultTeachers);
  }

  async addTeacher(newTeacher: Omit<Teacher, 'id'>): Promise<Teacher> {
    this.assertAdmin('registrar nuevos docentes');

    const teachers = await this.getTeachers();
    const created: Teacher = {
      ...newTeacher,
      id: `t-${Date.now()}`,
    };
    const updated = [...teachers, created];
    this.setStored(STORAGE_KEYS.TEACHERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('teachers').insert({
          id: created.id,
          full_name: created.fullName,
          email: created.email,
          department: created.department,
          office_location: created.officeLocation,
        });
      } catch (e) {
        console.warn('Error saving teacher to Supabase:', e);
      }
    }
    return created;
  }

  async updateTeacher(teacherId: string, updates: Partial<Teacher>): Promise<Teacher> {
    this.assertAdmin('editar información de docentes');

    const teachers = await this.getTeachers();
    let updatedTeacher: Teacher | undefined;
    const updated = teachers.map((t) => {
      if (t.id === teacherId) {
        updatedTeacher = { ...t, ...updates };
        return updatedTeacher;
      }
      return t;
    });
    this.setStored(STORAGE_KEYS.TEACHERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('teachers')
          .update({
            full_name: updates.fullName,
            email: updates.email,
            department: updates.department,
            office_location: updates.officeLocation,
          })
          .eq('id', teacherId);
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
    this.assertAdmin('crear asignaturas');

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
    };

    const updatedCourses = [newCourse, ...courses];
    this.setStored(STORAGE_KEYS.COURSES, updatedCourses);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').insert({
          id: newCourse.id,
          semester_id: newCourse.semesterId,
          teacher_id: newCourse.teacherId,
          code: newCourse.code,
          name: newCourse.name,
          description: newCourse.description,
          credits: newCourse.credits,
          color_hex: newCourse.colorHex,
        });
      } catch (err) {
        console.warn('Error creating course in Supabase:', err);
      }
    }

    return newCourse;
  }

  async updateCourse(
    courseId: string,
    updates: Partial<Omit<Course, 'id' | 'schedules'>>
  ): Promise<Course> {
    this.assertAdmin('modificar asignaturas');

    const courses = await this.getCourses();
    const teachers = await this.getTeachers();

    let updatedCourse: Course | undefined;
    const newCourses = courses.map((course) => {
      if (course.id === courseId) {
        const teacher = updates.teacherId
          ? teachers.find((t) => t.id === updates.teacherId)
          : course.teacher;

        updatedCourse = {
          ...course,
          ...updates,
          teacher,
        };
        return updatedCourse;
      }
      return course;
    });

    this.setStored(STORAGE_KEYS.COURSES, newCourses);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('courses')
          .update({
            name: updates.name,
            code: updates.code,
            description: updates.description,
            color_hex: updates.colorHex,
            credits: updates.credits,
            teacher_id: updates.teacherId,
          })
          .eq('id', courseId);
      } catch (err) {
        console.warn('Error updating course in Supabase:', err);
      }
    }

    if (!updatedCourse) throw new Error('Curso no encontrado');
    return updatedCourse;
  }

  async deleteCourse(courseId: string): Promise<void> {
    this.assertAdmin('eliminar asignaturas');

    const courses = await this.getCourses();
    const filtered = courses.filter((c) => c.id !== courseId);
    this.setStored(STORAGE_KEYS.COURSES, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('courses').delete().eq('id', courseId);
      } catch (err) {
        console.warn('Error deleting course from Supabase:', err);
      }
    }
  }

  // ==========================================
  // SÍLABOS OFICIALES
  // ==========================================
  async getSyllabus(courseId: string): Promise<CourseSyllabus | null> {
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
            fileSize: data.file_size_bytes ? `${Math.round(data.file_size_bytes / 1024)} KB` : undefined,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.warn('Error fetching syllabus from Supabase:', e);
      }
    }

    const syllabi = this.getStored<Record<string, CourseSyllabus>>(
      STORAGE_KEYS.SYLLABI,
      INITIAL_SYLLABI
    );
    return syllabi[courseId] || null;
  }

  async saveSyllabus(
    courseId: string,
    syllabusData: Partial<CourseSyllabus>
  ): Promise<CourseSyllabus> {
    this.assertAdmin('modificar sílabos oficiales');

    const syllabi = this.getStored<Record<string, CourseSyllabus>>(
      STORAGE_KEYS.SYLLABI,
      INITIAL_SYLLABI
    );
    const existing = syllabi[courseId] || {
      id: `syl-${Date.now()}`,
      courseId,
      academicYear: '2026-I',
      version: '1.0',
      summary: '',
      competencies: [],
      evaluationSystem: '',
      updatedAt: new Date().toISOString(),
    };

    const updated: CourseSyllabus = {
      ...existing,
      ...syllabusData,
      updatedAt: new Date().toISOString(),
    };

    syllabi[courseId] = updated;
    this.setStored(STORAGE_KEYS.SYLLABI, syllabi);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('course_syllabi').upsert({
          id: updated.id,
          course_id: courseId,
          academic_year: updated.academicYear || '2026-I',
          version: updated.version || '1.0',
          summary: updated.summary,
          competencies: updated.competencies,
          evaluation_system: updated.evaluationSystem,
          file_url: updated.fileUrl,
          file_name: updated.fileName,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Error syncing syllabus with Supabase:', err);
      }
    }

    return updated;
  }

  // ==========================================
  // BIBLIOTECA Y MATERIALES DIGITALES
  // ==========================================
  async getMaterials(courseId?: string): Promise<CourseMaterial[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('course_materials').select('*');
        if (courseId) {
          query = query.eq('course_id', courseId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((m) => ({
            id: m.id,
            courseId: m.course_id,
            title: m.title,
            description: m.description,
            category: m.category,
            fileUrl: m.file_url,
            fileName: m.file_name,
            fileType: m.file_type,
            fileSize: m.file_size_bytes ? `${Math.round(m.file_size_bytes / 1024)} KB` : '1.2 MB',
            downloadCount: m.download_count || 0,
            createdAt: m.created_at,
          }));
        }
      } catch (e) {
        console.warn('Error fetching materials from Supabase:', e);
      }
    }

    const stored = this.getStored<CourseMaterial[]>(STORAGE_KEYS.MATERIALS, INITIAL_MATERIALS);
    if (courseId) {
      return stored.filter((m) => m.courseId === courseId);
    }
    return stored;
  }

  async addMaterial(
    material: Omit<CourseMaterial, 'id' | 'createdAt' | 'downloadCount'>
  ): Promise<CourseMaterial> {
    this.assertAdmin('subir materiales a la biblioteca institucional');

    const materials = await this.getMaterials();
    const courses = await this.getCourses();
    const course = courses.find((c) => c.id === material.courseId);

    const created: CourseMaterial = {
      ...material,
      id: `mat-${Date.now()}`,
      courseName: course?.name,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [created, ...materials];
    this.setStored(STORAGE_KEYS.MATERIALS, updated);

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
          file_size_bytes: 1048576,
        });
      } catch (err) {
        console.warn('Error saving material to Supabase:', err);
      }
    }

    return created;
  }

  async deleteMaterial(materialId: string): Promise<void> {
    this.assertAdmin('eliminar materiales de la biblioteca');

    const materials = await this.getMaterials();
    const filtered = materials.filter((m) => m.id !== materialId);
    this.setStored(STORAGE_KEYS.MATERIALS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('course_materials').delete().eq('id', materialId);
      } catch (err) {
        console.warn('Error deleting material in Supabase:', err);
      }
    }
  }

  async recordMaterialDownload(materialId: string): Promise<void> {
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
  // GESTIÓN DE ALUMNOS (SOLO ADMINISTRADOR GLOBAL)
  // ==========================================
  async getStudents(): Promise<UserProfile[]> {
    this.assertAdmin('ver el padrón de alumnos matriculados');

    const defaultStudents: UserProfile[] = [
      INITIAL_USER_PROFILE,
      {
        id: 'usr-student-2',
        email: 'valeria.paredes@unmsm.edu.pe',
        fullName: 'Valeria Nicole Paredes',
        studentCode: '22060189',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
        role: 'student',
        phoneWhatsapp: '+51981234567',
        universityId: INITIAL_UNIVERSITY.id,
        careerId: INITIAL_CAREER.id,
        currentSemesterId: INITIAL_SEMESTER.id,
        enrolledSemesterNumber: 4,
      },
      {
        id: 'usr-student-3',
        email: 'renato.diaz@unmsm.edu.pe',
        fullName: 'Renato Alonso Díaz',
        studentCode: '21060045',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
        role: 'student',
        phoneWhatsapp: '+51977665544',
        universityId: INITIAL_UNIVERSITY.id,
        careerId: INITIAL_CAREER.id,
        currentSemesterId: INITIAL_SEMESTER.id,
        enrolledSemesterNumber: 5,
      },
    ];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'student');

        if (!error && data && data.length > 0) {
          return data.map((p) => ({
            id: p.id,
            email: p.email,
            fullName: p.full_name,
            studentCode: p.student_code || '22060142',
            avatarUrl: p.avatar_url,
            role: 'student',
            phoneWhatsapp: p.phone_whatsapp,
            universityId: INITIAL_UNIVERSITY.id,
            careerId: INITIAL_CAREER.id,
            currentSemesterId: INITIAL_SEMESTER.id,
            enrolledSemesterNumber: p.enrolled_semester_number || 4,
          }));
        }
      } catch (err) {
        console.warn('Error getting students from Supabase:', err);
      }
    }

    return this.getStored<UserProfile[]>(STORAGE_KEYS.STUDENTS_LIST, defaultStudents);
  }

  async updateStudentSemester(studentId: string, semesterNumber: number): Promise<void> {
    this.assertAdmin('modificar el ciclo oficial de un alumno');

    const students = await this.getStudents();
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return { ...s, enrolledSemesterNumber: semesterNumber };
      }
      return s;
    });
    this.setStored(STORAGE_KEYS.STUDENTS_LIST, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ enrolled_semester_number: semesterNumber })
          .eq('id', studentId);
      } catch (err) {
        console.warn('Error updating student semester in Supabase:', err);
      }
    }
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
