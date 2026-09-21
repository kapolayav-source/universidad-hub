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
} from '../types/academic';

export const INITIAL_UNIVERSITY: University = {
  id: 'uni-1',
  name: 'Universidad Nacional Mayor de San Marcos',
  slug: 'unmsm',
  countryCode: 'PER',
  logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=128&auto=format&fit=crop&q=80',
};

export const INITIAL_FACULTY: Faculty = {
  id: 'fac-1',
  universityId: 'uni-1',
  name: 'Facultad de Ciencias Económicas',
  code: 'FCE',
};

export const INITIAL_CAREER: Career = {
  id: 'car-1',
  facultyId: 'fac-1',
  name: 'Economía',
  totalSemesters: 10,
};

export const INITIAL_SEMESTER: Semester = {
  id: 'sem-4',
  careerId: 'car-1',
  number: 4,
  academicPeriod: '2026-I',
};

export const INITIAL_TEACHERS: Record<string, Teacher> = {
  't-macro': {
    id: 't-macro',
    fullName: 'Dr. Alejandro Thorne',
    email: 'athorne@unmsm.edu.pe',
    department: 'Departamento de Teoría Económica',
    officeLocation: 'Pabellón Central - Of. 405',
  },
  't-micro': {
    id: 't-micro',
    fullName: 'Dra. Carmen Mendoza',
    email: 'cmendoza@unmsm.edu.pe',
    department: 'Departamento de Microeconomía y Mercados',
    officeLocation: 'Pabellón Central - Of. 410',
  },
  't-costos': {
    id: 't-costos',
    fullName: 'Mg. Ricardo Paredes',
    email: 'rparedes@unmsm.edu.pe',
    department: 'Departamento de Finanzas y Contabilidad',
    officeLocation: 'Pabellón FCE - Of. 215',
  },
  't-mat': {
    id: 't-mat',
    fullName: 'Dr. Fernando Silva',
    email: 'fsilva@unmsm.edu.pe',
    department: 'Departamento de Métodos Cuantitativos',
    officeLocation: 'Pabellón de Matemáticas - Of. 302',
  },
  't-filo': {
    id: 't-filo',
    fullName: 'Lic. Valeria Quiroga',
    email: 'vquiroga@unmsm.edu.pe',
    department: 'Departamento de Humanidades',
    officeLocation: 'Pabellón de Letras - Of. 104',
  },
  't-met': {
    id: 't-met',
    fullName: 'Dra. Elena Salazar',
    email: 'esalazar@unmsm.edu.pe',
    department: 'Instituto de Investigaciones Económicas',
    officeLocation: 'Pabellón FCE - Of. 308',
  },
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-macro-1',
    semesterId: 'sem-4',
    teacherId: 't-macro',
    teacher: INITIAL_TEACHERS['t-macro'],
    code: 'ECO-401',
    name: 'Macroeconomía I',
    description: 'Estudio de modelos de equilibrio general, demanda agregada IS-LM, modelo OA-DA, inflación, desempleo y política fiscal y monetaria.',
    colorHex: '#0284c7', // Sky blue
    credits: 4,
    progressPercentage: 42,
    classesCount: 14,
    assignmentsCount: 3,
    examsCount: 2,
    schedules: [
      {
        id: 'sch-1',
        courseId: 'course-macro-1',
        dayOfWeek: 1, // Lunes
        dayName: 'Lunes',
        startTime: '08:00',
        endTime: '10:00',
        classroom: 'Aula 402 - Pabellón Central',
      },
      {
        id: 'sch-2',
        courseId: 'course-macro-1',
        dayOfWeek: 3, // Miércoles
        dayName: 'Miércoles',
        startTime: '08:00',
        endTime: '10:00',
        classroom: 'Aula 402 - Pabellón Central',
      },
    ],
  },
  {
    id: 'course-micro-2',
    semesterId: 'sem-4',
    teacherId: 't-micro',
    teacher: INITIAL_TEACHERS['t-micro'],
    code: 'ECO-402',
    name: 'Microeconomía II',
    description: 'Estructuras de mercado no competitivas: monopolio, monopsonio, oligopolio (Cournot, Bertrand, Stackelberg) y teoría de juegos.',
    colorHex: '#059669', // Emerald
    credits: 4,
    progressPercentage: 38,
    classesCount: 14,
    assignmentsCount: 4,
    examsCount: 2,
    schedules: [
      {
        id: 'sch-3',
        courseId: 'course-micro-2',
        dayOfWeek: 2, // Martes
        dayName: 'Martes',
        startTime: '10:00',
        endTime: '12:00',
        classroom: 'Aula 401 - Pabellón Central',
      },
      {
        id: 'sch-4',
        courseId: 'course-micro-2',
        dayOfWeek: 4, // Jueves
        dayName: 'Jueves',
        startTime: '10:00',
        endTime: '12:00',
        classroom: 'Aula 401 - Pabellón Central',
      },
    ],
  },
  {
    id: 'course-costos',
    semesterId: 'sem-4',
    teacherId: 't-costos',
    teacher: INITIAL_TEACHERS['t-costos'],
    code: 'ECO-403',
    name: 'Costos y Presupuestos',
    description: 'Análisis de costos fijos, variables, marginales, sistemas de costeo por procesos y costeo basado en actividades (ABC).',
    colorHex: '#ea580c', // Amber/Orange
    credits: 3,
    progressPercentage: 45,
    classesCount: 12,
    assignmentsCount: 2,
    examsCount: 2,
    schedules: [
      {
        id: 'sch-5',
        courseId: 'course-costos',
        dayOfWeek: 1, // Lunes
        dayName: 'Lunes',
        startTime: '10:30',
        endTime: '12:30',
        classroom: 'Aula 305 - Pabellón FCE',
      },
      {
        id: 'sch-6',
        courseId: 'course-costos',
        dayOfWeek: 3, // Miércoles
        dayName: 'Miércoles',
        startTime: '10:30',
        endTime: '12:30',
        classroom: 'Aula 305 - Pabellón FCE',
      },
    ],
  },
  {
    id: 'course-mat-3',
    semesterId: 'sem-4',
    teacherId: 't-mat',
    teacher: INITIAL_TEACHERS['t-mat'],
    code: 'MAT-404',
    name: 'Matemática Aplicada III',
    description: 'Ecuaciones diferenciales ordinarias y en diferencias finitas aplicadas a la estabilidad macroeconómica y modelos de crecimiento dinámico.',
    colorHex: '#7c3aed', // Purple
    credits: 4,
    progressPercentage: 50,
    classesCount: 14,
    assignmentsCount: 3,
    examsCount: 2,
    schedules: [
      {
        id: 'sch-7',
        courseId: 'course-mat-3',
        dayOfWeek: 2, // Martes
        dayName: 'Martes',
        startTime: '08:00',
        endTime: '10:00',
        classroom: 'Aula 204 - Pabellón Matemáticas',
      },
      {
        id: 'sch-8',
        courseId: 'course-mat-3',
        dayOfWeek: 5, // Viernes
        dayName: 'Viernes',
        startTime: '08:00',
        endTime: '10:00',
        classroom: 'Aula 204 - Pabellón Matemáticas',
      },
    ],
  },
  {
    id: 'course-filo',
    semesterId: 'sem-4',
    teacherId: 't-filo',
    teacher: INITIAL_TEACHERS['t-filo'],
    code: 'HUM-405',
    name: 'Filosofía y Ética Social',
    description: 'Fundamentos éticos de las doctrinas económicas, utilitarismo, teoría de la justicia de Rawls y economía del bienestar.',
    colorHex: '#db2777', // Pink/Rose
    credits: 3,
    progressPercentage: 35,
    classesCount: 12,
    assignmentsCount: 2,
    examsCount: 1,
    schedules: [
      {
        id: 'sch-9',
        courseId: 'course-filo',
        dayOfWeek: 4, // Jueves
        dayName: 'Jueves',
        startTime: '14:00',
        endTime: '17:00',
        classroom: 'Aula 102 - Pabellón de Letras',
      },
    ],
  },
  {
    id: 'course-metodo',
    semesterId: 'sem-4',
    teacherId: 't-met',
    teacher: INITIAL_TEACHERS['t-met'],
    code: 'INV-406',
    name: 'Metodología de la Investigación',
    description: 'Diseño de investigación empírica en ciencias económicas, planteamiento de hipótesis, revisión bibliográfica y protocolos de tesis.',
    colorHex: '#4f46e5', // Indigo
    credits: 3,
    progressPercentage: 30,
    classesCount: 12,
    assignmentsCount: 2,
    examsCount: 1,
    schedules: [
      {
        id: 'sch-10',
        courseId: 'course-metodo',
        dayOfWeek: 5, // Viernes
        dayName: 'Viernes',
        startTime: '10:30',
        endTime: '13:30',
        classroom: 'Aula 105 - Pabellón FCE',
      },
    ],
  },
];

export const INITIAL_CLASSES: ClassSession[] = [
  // Macroeconomía I
  {
    id: 'cls-macro-1',
    courseId: 'course-macro-1',
    sessionNumber: 1,
    title: 'Introducción al Modelo IS-LM en Economía Cerrada',
    classDate: '2026-09-08T08:00:00Z',
    room: 'Aula 402',
    summary: 'Deducción matemática de la curva IS a partir del mercado de bienes y de la curva LM a partir de la demanda de saldos reales.',
    topicsCovered: ['Mercado de Bienes', 'Multiplicador Keynesiano', 'Preferencia por la liquidez', 'Equilibrio conjunto'],
  },
  {
    id: 'cls-macro-2',
    courseId: 'course-macro-1',
    sessionNumber: 2,
    title: 'Efectividad de la Política Fiscal vs Monetaria',
    classDate: '2026-09-10T08:00:00Z',
    room: 'Aula 402',
    summary: 'Casos extremos: trampa de la liquidez y caso clásico. Efecto expulsión (crowding-out) total y parcial.',
    topicsCovered: ['Trampa de la liquidez', 'Crowding out', 'Sensibilidad a la tasa de interés'],
  },
  {
    id: 'cls-macro-3',
    courseId: 'course-macro-1',
    sessionNumber: 3,
    title: 'Modelo Mundell-Fleming en Economía Abierta',
    classDate: '2026-09-15T08:00:00Z',
    room: 'Aula 402',
    summary: 'Tipo de cambio fijo vs flexible bajo perfecta movilidad de capitales. Análisis de choques externos.',
    topicsCovered: ['Paridad de tasas de interés', 'Tipo de cambio flexible', 'Eficacia de políticas'],
  },
  {
    id: 'cls-macro-4',
    courseId: 'course-macro-1',
    sessionNumber: 4,
    title: 'Curva de Phillips y Expectativas Adaptativas',
    classDate: '2026-09-22T08:00:00Z',
    room: 'Aula 402',
    summary: 'Próxima sesión: Derivación de la oferta agregada dinámica y la tasa natural de desempleo de Friedman y Phelps.',
    topicsCovered: ['Tasa natural de desempleo', 'Expectativas inflacionarias', 'Choques de oferta'],
  },

  // Microeconomía II
  {
    id: 'cls-micro-1',
    courseId: 'course-micro-2',
    sessionNumber: 1,
    title: 'Monopolio y Discriminación de Precios de 1.º, 2.º y 3.º Grado',
    classDate: '2026-09-09T10:00:00Z',
    room: 'Aula 401',
    summary: 'Condición IMg = CMg, índice de Lerner, pérdida irrecuperable de eficiencia y captura del excedente del consumidor.',
    topicsCovered: ['Índice de Lerner', 'Pérdida social', 'Tarifas en dos partes', 'Segmentación de mercados'],
  },
  {
    id: 'cls-micro-2',
    courseId: 'course-micro-2',
    sessionNumber: 2,
    title: 'Monopolio en el Mercado de Factores Productivos',
    classDate: '2026-09-16T10:00:00Z',
    room: 'Aula 401',
    summary: 'Demanda derivada de insumos. Diferencia entre Valor del Producto Marginal (VPMg) e Ingreso del Producto Marginal (IPMg).',
    topicsCovered: ['Mercado de factores', 'Monopsonio', 'Salarios y poder de mercado'],
  },
  {
    id: 'cls-micro-3',
    courseId: 'course-micro-2',
    sessionNumber: 3,
    title: 'Oligopolio de Cournot y Equilibrio de Nash',
    classDate: '2026-09-23T10:00:00Z',
    room: 'Aula 401',
    summary: 'Próxima sesión: Determinación simultánea de cantidades, funciones de mejor respuesta y convergencia al resultado competitivo.',
    topicsCovered: ['Funciones de reacción', 'Duopolio simétrico', 'Colusión tácita'],
  },

  // Costos
  {
    id: 'cls-costos-1',
    courseId: 'course-costos',
    sessionNumber: 1,
    title: 'Clasificación de Costos y Punto de Equilibrio',
    classDate: '2026-09-08T10:30:00Z',
    room: 'Aula 305',
    summary: 'Costo-Volumen-Utilidad (CVU), margen de contribución unitario y análisis de sensibilidad para decisiones de producción.',
    topicsCovered: ['Costos fijos y variables', 'Margen de contribución', 'Punto de equilibrio operativo'],
  },
  {
    id: 'cls-costos-2',
    courseId: 'course-costos',
    sessionNumber: 2,
    title: 'Costeo por Órdenes de Trabajo vs Procesos Continuos',
    classDate: '2026-09-15T10:30:00Z',
    room: 'Aula 305',
    summary: 'Tratamiento de inventarios en proceso, unidades equivalentes y asignación de costos indirectos de fabricación (CIF).',
    topicsCovered: ['Producción equivalente', 'Costos indirectos', 'Cédulas de costeo'],
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    courseId: 'course-micro-2',
    title: 'Ejercicio Práctico: Monopolio en el Mercado de Factores',
    description: 'Resolver los problemas de maximización con demanda lineal de trabajo, calcular la explotación monopolística y la pérdida de bienestar.',
    dueDate: '2026-09-23T23:59:00Z',
    maxScore: 20,
    status: 'pending',
  },
  {
    id: 'asg-2',
    courseId: 'course-macro-1',
    title: 'Simulación IS-LM-BP con Tipo de Cambio Flexible',
    description: 'Modelar en Excel o Python el impacto de una subida de la tasa de interés externa sobre el producto doméstico y las reservas.',
    dueDate: '2026-09-25T20:00:00Z',
    maxScore: 20,
    status: 'pending',
  },
  {
    id: 'asg-3',
    courseId: 'course-costos',
    title: 'Cálculo de Punto de Equilibrio y Mezcla de Productos',
    description: 'Determinar el margen ponderado para una empresa con 4 líneas de productos y restricciones de capacidad instalada.',
    dueDate: '2026-09-28T23:59:00Z',
    maxScore: 20,
    status: 'pending',
  },
  {
    id: 'asg-4',
    courseId: 'course-mat-3',
    title: 'Sistemas Dinámicos en Tiempo Discreto (Cobweb Model)',
    description: 'Estudio de estabilidad asintótica del modelo de la telaraña con expectativas racionales y rezago de producción.',
    dueDate: '2026-09-19T23:59:00Z',
    maxScore: 20,
    status: 'completed',
    userScore: 19,
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    courseId: 'course-macro-1',
    title: 'Examen Parcial de Macroeconomía I',
    examDate: '2026-10-12T08:00:00Z',
    weightPercentage: 30,
    classroom: 'Aula Magna - Pabellón Central',
    topics: 'Unidades 1 a 4: Mercado de bienes, equilibrio monetario, IS-LM, Mundell-Fleming y oferta agregada.',
  },
  {
    id: 'exam-2',
    courseId: 'course-micro-2',
    title: 'Examen Parcial de Microeconomía II',
    examDate: '2026-10-14T10:00:00Z',
    weightPercentage: 30,
    classroom: 'Aula Magna - Pabellón Central',
    topics: 'Monopolio, discriminación, mercados de factores, monopsonio y modelos de oligopolio.',
  },
  {
    id: 'exam-3',
    courseId: 'course-costos',
    title: 'Examen Parcial de Costos',
    examDate: '2026-10-19T10:30:00Z',
    weightPercentage: 25,
    classroom: 'Aula 305',
    topics: 'Sistemas de costeo directo y por absorción, punto de equilibrio y presupuesto maestro.',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'user-demo-1',
  email: 'estudiante.economia@unmsm.edu.pe',
  fullName: 'Carlos Alberto Vega',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  role: 'student',
  phoneWhatsapp: '+51987654321',
  universityId: 'uni-1',
  careerId: 'car-1',
  currentSemesterId: 'sem-4',
};
