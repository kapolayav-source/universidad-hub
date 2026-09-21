export type UserRole = 'student' | 'teacher' | 'moderator' | 'admin' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  phoneWhatsapp?: string;
  studentCode?: string;
  universityId?: string;
  careerId?: string;
  currentSemesterId?: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  logoUrl?: string;
}

export interface Faculty {
  id: string;
  universityId: string;
  name: string;
  code?: string;
}

export interface Career {
  id: string;
  facultyId: string;
  name: string;
  totalSemesters: number;
}

export interface Semester {
  id: string;
  careerId: string;
  number: number;
  academicPeriod: string;
}

export interface Teacher {
  id: string;
  fullName: string;
  email?: string;
  department?: string;
  officeLocation?: string;
}

export interface CourseSyllabus {
  id: string;
  courseId: string;
  academicYear: string;
  version?: string;
  summary: string;
  competencies: string[];
  evaluationSystem: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  updatedAt: string;
}

export type MaterialCategory = 'lecture' | 'reading' | 'practice' | 'syllabus' | 'exam' | 'other';

export interface CourseMaterial {
  id: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  title: string;
  description?: string;
  category: MaterialCategory;
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'zip' | 'link' | 'other';
  fileSize: string;
  uploadedBy?: string;
  downloadCount?: number;
  createdAt: string;
}

export interface CourseSchedule {
  id: string;
  courseId: string;
  dayOfWeek: number; // 1 = Lunes, ..., 7 = Domingo
  dayName: string;   // 'Lunes', 'Martes', etc.
  startTime: string; // '08:00'
  endTime: string;   // '10:00'
  classroom: string;
  isVirtual?: boolean;
}

export interface ClassSession {
  id: string;
  courseId: string;
  sessionNumber: number;
  title: string;
  classDate: string; // ISO date
  room: string;
  summary: string;
  topicsCovered: string[];
}

export type AssignmentStatus = 'pending' | 'completed' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date
  maxScore: number;
  status: AssignmentStatus;
  userScore?: number;
  classroomTaskId?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  examDate: string; // ISO date
  weightPercentage: number;
  classroom: string;
  topics: string;
}

export interface Course {
  id: string;
  semesterId: string;
  teacherId?: string;
  teacher?: Teacher;
  code: string;
  name: string;
  description: string;
  colorHex: string;
  credits: number;
  schedules: CourseSchedule[];
  classesCount: number;
  assignmentsCount: number;
  examsCount: number;
  progressPercentage: number;
  materialsCount?: number;
  syllabus?: CourseSyllabus;
}

