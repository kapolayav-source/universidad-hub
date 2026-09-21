-- ============================================================================
-- UNIVERSIDAD HUB - MIGRACIÓN DEFINITIVA DE SEGURIDAD, AUTENTICACIÓN Y RLS
-- Archivo: 003_secure_auth_roles_and_rls.sql
-- ============================================================================
-- Esta migración implementa la arquitectura de seguridad estricta para:
-- 1. Control de Roles Real (Únicamente 2 roles funcionales: 'admin' y 'student').
-- 2. Función de Seguridad PostgreSQL is_admin() (SECURITY DEFINER).
-- 3. Blindaje de Row Level Security (RLS) en todas las tablas:
--    - Administrador Global: Control total (Crear/Editar/Eliminar cursos, docentes, sílabos, biblioteca y ciclos de alumnos).
--    - Alumno: Lectura de cursos, descarga de sílabos y biblioteca. No puede alterar cursos, ni docentes, ni subir/eliminar archivos, ni modificar su ciclo oficial.
-- 4. Inmutabilidad del rol y del ciclo desde el lado del alumno.
-- ============================================================================

-- 1. ACTUALIZACIÓN DE LA TABLA PROFILES
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS student_code VARCHAR(50),
    ADD COLUMN IF NOT EXISTS enrolled_semester_number INT DEFAULT 4;

-- Asegurar restricción de roles válidos
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'student'));

-- 2. FUNCIÓN DE VERIFICACIÓN DE ADMINISTRADOR (SECURITY DEFINER)
-- Ejecuta con permisos del creador para consultar profiles de forma segura sin bypass de RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE id = auth.uid() 
          AND role = 'admin'
    );
END;
$$;

-- 3. LIMPIEZA DE POLÍTICAS PREVIAS INSEGURAS (DE FASE 1 Y FASE 2)
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Profiles select policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;

DROP POLICY IF EXISTS "Allow authenticated insert courses" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated update courses" ON public.courses;
DROP POLICY IF EXISTS "Allow authenticated delete courses" ON public.courses;
DROP POLICY IF EXISTS "Courses are viewable by all authenticated users" ON public.courses;
DROP POLICY IF EXISTS "Cursos visibles para usuarios autenticados" ON public.courses;

DROP POLICY IF EXISTS "Allow authenticated manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers are viewable by all authenticated users" ON public.teachers;
DROP POLICY IF EXISTS "Profesores visibles para usuarios autenticados" ON public.teachers;

DROP POLICY IF EXISTS "Syllabi are viewable by all authenticated users" ON public.course_syllabi;
DROP POLICY IF EXISTS "Teachers and Admins can manage syllabi" ON public.course_syllabi;

DROP POLICY IF EXISTS "Materials are viewable by students and faculty" ON public.course_materials;
DROP POLICY IF EXISTS "Users can upload course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Users can update their course materials" ON public.course_materials;
DROP POLICY IF EXISTS "Users can delete their course materials" ON public.course_materials;

DROP POLICY IF EXISTS "Universidades visibles para usuarios autenticados" ON public.universities;
DROP POLICY IF EXISTS "Facultades visibles para usuarios autenticados" ON public.faculties;
DROP POLICY IF EXISTS "Carreras visibles para usuarios autenticados" ON public.careers;
DROP POLICY IF EXISTS "Semestres visibles para usuarios autenticados" ON public.semesters;

-- 4. HABILITACIÓN ESTRICTA DE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_syllabi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- 5. NUEVAS POLÍTICAS RLS SEGURAS

-- A. PROFILES (Perfiles de Usuario)
-- Lectura: El propio usuario puede ver su perfil, o un Administrador Global puede ver todos
CREATE POLICY "profiles_select_policy"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin());

-- Actualización:
-- - Un Administrador Global puede modificar cualquier perfil (incluyendo rol y ciclo asignado).
-- - Un Alumno SOLO puede modificar sus datos personales (ej. teléfono WhatsApp o avatar).
--   NO puede modificar su rol (role) ni su ciclo asignado (enrolled_semester_number).
CREATE POLICY "profiles_update_policy"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (
        public.is_admin()
        OR (
            auth.uid() = id
            AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
            AND COALESCE(enrolled_semester_number, 4) = COALESCE((SELECT p.enrolled_semester_number FROM public.profiles p WHERE p.id = auth.uid()), 4)
        )
    );

-- B. JERARQUÍA ACADÉMICA (Universidades, Facultades, Carreras, Semestres)
-- Lectura pública para cualquier usuario autenticado
CREATE POLICY "universities_read" ON public.universities FOR SELECT TO authenticated USING (true);
CREATE POLICY "faculties_read" ON public.faculties FOR SELECT TO authenticated USING (true);
CREATE POLICY "careers_read" ON public.careers FOR SELECT TO authenticated USING (true);
CREATE POLICY "semesters_read" ON public.semesters FOR SELECT TO authenticated USING (true);

-- Modificación: SOLO Administrador Global
CREATE POLICY "universities_admin" ON public.universities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "faculties_admin" ON public.faculties FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "careers_admin" ON public.careers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "semesters_admin" ON public.semesters FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- C. DOCENTES (Teachers)
-- Lectura: Todos los usuarios autenticados pueden ver la plana docente asociada a los cursos
CREATE POLICY "teachers_read" ON public.teachers FOR SELECT TO authenticated USING (true);

-- Modificación: SOLO Administrador Global
CREATE POLICY "teachers_admin_write" ON public.teachers FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "teachers_admin_update" ON public.teachers FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "teachers_admin_delete" ON public.teachers FOR DELETE TO authenticated USING (public.is_admin());

-- D. CURSOS (Courses)
-- Lectura: Todos los alumnos y administradores pueden ver los cursos del plan de estudios
CREATE POLICY "courses_read" ON public.courses FOR SELECT TO authenticated USING (true);

-- Modificación: SOLO Administrador Global (Crear, Editar, Eliminar cursos)
CREATE POLICY "courses_admin_insert" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "courses_admin_update" ON public.courses FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "courses_admin_delete" ON public.courses FOR DELETE TO authenticated USING (public.is_admin());

-- E. SÍLABOS OFICIALES (Course Syllabi)
-- Lectura: Cualquier alumno o profesor puede consultar y descargar los sílabos
CREATE POLICY "syllabi_read" ON public.course_syllabi FOR SELECT TO authenticated USING (true);

-- Modificación: SOLO Administrador Global puede crear o modificar sílabos oficiales
CREATE POLICY "syllabi_admin_write" ON public.course_syllabi FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- F. BIBLIOTECA Y MATERIALES DIGITALES (Course Materials)
-- Lectura: Todos los alumnos pueden buscar, filtrar y descargar materiales
CREATE POLICY "materials_read" ON public.course_materials FOR SELECT TO authenticated USING (true);

-- Modificación: SOLO Administrador Global puede subir archivos a la biblioteca o eliminarlos
CREATE POLICY "materials_admin_insert" ON public.course_materials FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "materials_admin_update" ON public.course_materials FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "materials_admin_delete" ON public.course_materials FOR DELETE TO authenticated USING (public.is_admin());

-- 6. TRIGGER DE REGISTRO SEGURO EN SUPABASE AUTH
-- Al registrarse un usuario en auth.users, se le asigna por defecto el rol 'student'
-- de manera que NINGÚN usuario pueda autoproclamarse administrador en el registro.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url, 
        role, 
        student_code, 
        enrolled_semester_number
    )
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'),
        'student', -- FORZADO: Siempre 'student' por defecto
        COALESCE(new.raw_user_meta_data->>'student_code', '22060142'),
        4          -- Semestre 4 por defecto
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = now();
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. INSTRUCCIÓN PARA ASIGNAR EL PRIMER ADMINISTRADOR GLOBAL:
-- En el editor SQL de Supabase, una vez registrado el usuario administrador, ejecutar:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@unmsm.edu.pe';
