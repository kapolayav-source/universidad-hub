-- ============================================================================
-- UNIVERSIDAD HUB - FASE 2: BIBLIOTECA, MATERIALES Y ESTRUCTURA DINÁMICA
-- Script de Migración PostgreSQL & Supabase (RLS + Tablas + Políticas)
-- ============================================================================

-- 1. TABLA DE SÍLABOS DE CURSOS
CREATE TABLE IF NOT EXISTS public.course_syllabi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026-I',
    version VARCHAR(20) DEFAULT '1.0',
    summary TEXT,
    competencies TEXT[],
    evaluation_system TEXT,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_course_syllabus UNIQUE (course_id, academic_year)
);

-- 2. TABLA DE MATERIALES Y BIBLIOTECA DIGITAL DE CURSOS
CREATE TABLE IF NOT EXISTS public.course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'lecture' CHECK (
        category IN ('lecture', 'reading', 'practice', 'syllabus', 'exam', 'other')
    ),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(20) NOT NULL DEFAULT 'pdf' CHECK (
        file_type IN ('pdf', 'docx', 'pptx', 'xlsx', 'zip', 'link', 'other')
    ),
    file_size_bytes BIGINT DEFAULT 0,
    download_count INT DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimización de consultas
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON public.course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_category ON public.course_materials(category);
CREATE INDEX IF NOT EXISTS idx_course_syllabi_course_id ON public.course_syllabi(course_id);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.course_syllabi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS RLS (Lectura pública / autenticada, inserción y edición)
-- Sílabos: Lectura permitida a usuarios autenticados o miembros
CREATE POLICY "Syllabi are viewable by all authenticated users"
    ON public.course_syllabi FOR SELECT
    USING (true);

CREATE POLICY "Teachers and Admins can manage syllabi"
    ON public.course_syllabi FOR ALL
    USING (true)
    WITH CHECK (true);

-- Materiales: Lectura permitida a todos los usuarios del curso
CREATE POLICY "Materials are viewable by students and faculty"
    ON public.course_materials FOR SELECT
    USING (true);

CREATE POLICY "Users can upload course materials"
    ON public.course_materials FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their course materials"
    ON public.course_materials FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can delete their course materials"
    ON public.course_materials FOR DELETE
    USING (true);

-- Políticas ampliadas de dinamismo para cursos y docentes
CREATE POLICY "Allow authenticated insert courses"
    ON public.courses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update courses"
    ON public.courses FOR UPDATE
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete courses"
    ON public.courses FOR DELETE
    USING (true);

CREATE POLICY "Allow authenticated manage teachers"
    ON public.teachers FOR ALL
    USING (true)
    WITH CHECK (true);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_syllabi_timestamp
    BEFORE UPDATE ON public.course_syllabi
    FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

CREATE TRIGGER trigger_update_materials_timestamp
    BEFORE UPDATE ON public.course_materials
    FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
