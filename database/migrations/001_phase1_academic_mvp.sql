-- ============================================================================
-- UNIVERSIDAD HUB - FASE 1: MVP ACADÉMICO
-- Script de Migración PostgreSQL & Supabase (RLS + Triggers + Seed Data)
-- ============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES DE USUARIO (Enlace a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'moderator', 'admin', 'superadmin')),
    phone_whatsapp VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. JERARQUÍA ACADÉMICA
-- Universidades
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    country_code VARCHAR(3) DEFAULT 'PER',
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Facultades
CREATE TABLE IF NOT EXISTS public.faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Carreras
CREATE TABLE IF NOT EXISTS public.careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    total_semesters INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Semestres
CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    career_id UUID NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    number INT NOT NULL CHECK (number >= 1 AND number <= 14),
    academic_period VARCHAR(20) NOT NULL, -- Ej: '2026-I'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(career_id, number, academic_period)
);

-- Profesores
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    department VARCHAR(255),
    office_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cursos
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color_hex VARCHAR(7) DEFAULT '#2563eb',
    credits INT DEFAULT 4,
    classroom_course_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Matriculación / Inscripciones
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_in_course VARCHAR(50) DEFAULT 'student' CHECK (role_in_course IN ('student', 'delegate', 'assistant', 'teacher')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(course_id, user_id)
);

-- Horarios de Clases
CREATE TABLE IF NOT EXISTS public.course_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7), -- 1=Lunes, 7=Domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    classroom VARCHAR(100) NOT NULL,
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_url TEXT
);

-- Clases / Sesiones Académicas
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    session_number INT,
    class_date TIMESTAMP WITH TIME ZONE NOT NULL,
    room VARCHAR(100),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tareas
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_score NUMERIC(5, 2) DEFAULT 20.00,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'submitted', 'graded')),
    classroom_task_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Exámenes
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
    weight_percentage NUMERIC(5, 2) DEFAULT 25.00,
    classroom VARCHAR(100),
    topics TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SEGURIDAD: ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura Pública/Autenticada para el Catálogo Académico
CREATE POLICY "Catálogo académico visible para usuarios autenticados"
ON public.universities FOR SELECT TO authenticated USING (true);

CREATE POLICY "Facultades visibles para usuarios autenticados"
ON public.faculties FOR SELECT TO authenticated USING (true);

CREATE POLICY "Carreras visibles para usuarios autenticados"
ON public.careers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Semestres visibles para usuarios autenticados"
ON public.semesters FOR SELECT TO authenticated USING (true);

CREATE POLICY "Cursos visibles para usuarios autenticados"
ON public.courses FOR SELECT TO authenticated USING (true);

CREATE POLICY "Horarios visibles para usuarios autenticados"
ON public.course_schedules FOR SELECT TO authenticated USING (true);

CREATE POLICY "Profesores visibles para usuarios autenticados"
ON public.teachers FOR SELECT TO authenticated USING (true);

-- Políticas para Clases y Tareas basadas en Matrícula
CREATE POLICY "Ver clases de cursos inscritos"
ON public.classes FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.course_enrollments ce
        WHERE ce.course_id = classes.course_id AND ce.user_id = auth.uid()
    )
);

CREATE POLICY "Ver tareas de cursos inscritos"
ON public.assignments FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.course_enrollments ce
        WHERE ce.course_id = assignments.course_id AND ce.user_id = auth.uid()
    )
);

CREATE POLICY "Ver exámenes de cursos inscritos"
ON public.exams FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.course_enrollments ce
        WHERE ce.course_id = exams.course_id AND ce.user_id = auth.uid()
    )
);

-- Políticas de Perfil
CREATE POLICY "Usuarios pueden ver su propio perfil"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- 5. TRIGGER AUTOMÁTICO AL CREAR USUARIO EN SUPABASE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'student'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
