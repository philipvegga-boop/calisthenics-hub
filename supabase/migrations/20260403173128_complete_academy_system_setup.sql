/*
  # Sistema Completo de Academia Poder Estoico

  1. Enhanced user_profiles with roles (admin, coach, alumno)
  2. Classes - Horarios de clases editables
  3. Class Reservations - Reservas de alumnos
  4. Training Routines - Rutinas por nivel
  5. Routine Exercises - Ejercicios de las rutinas
  6. Accessories - Accesorios/equipamiento
  7. Coach Assignments - Asignación de coaches a clases
  8. Attendance - Asistencias de alumnos
  9. User Assessment - Nivel del alumno
  10. Admin Config - Configuración bancaria del admin
  
  Security: RLS policies implementadas por rol
*/

-- Drop existing tables if they exist to rebuild
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS coach_assignments CASCADE;
DROP TABLE IF EXISTS routine_exercises CASCADE;
DROP TABLE IF EXISTS training_routines CASCADE;
DROP TABLE IF EXISTS accessories CASCADE;
DROP TABLE IF EXISTS class_reservations CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS user_assessment CASCADE;
DROP TABLE IF EXISTS admin_config CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Update user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  role text NOT NULL DEFAULT 'alumno' CHECK (role IN ('admin', 'coach', 'alumno')),
  level text DEFAULT 'principiante' CHECK (level IN ('principiante', 'intermedio', 'avanzado')),
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  day_of_week text NOT NULL CHECK (day_of_week IN ('Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom')),
  start_time text NOT NULL,
  end_time text NOT NULL,
  max_capacity integer NOT NULL DEFAULT 20,
  current_capacity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active classes"
  ON classes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can view all classes"
  ON classes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can create classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Coach Assignments
CREATE TABLE coach_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coach_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coach assignments"
  ON coach_assignments FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage coach assignments"
  ON coach_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Class Reservations
CREATE TABLE class_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  reservation_date date NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, user_id, reservation_date)
);

ALTER TABLE class_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reservations"
  ON class_reservations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all reservations"
  ON class_reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Coaches can view reservations of their classes"
  ON class_reservations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.coach_id = auth.uid()
      AND ca.class_id = class_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Users can insert own reservations"
  ON class_reservations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reservations"
  ON class_reservations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() AND status = 'confirmed');

CREATE POLICY "Admins can manage all reservations"
  ON class_reservations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Training Routines
CREATE TABLE training_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  level text NOT NULL CHECK (level IN ('principiante', 'intermedio', 'avanzado')),
  group_type text NOT NULL CHECK (group_type IN ('G1', 'G2')),
  duration_minutes integer,
  rest_day boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE training_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view routines"
  ON training_routines FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage routines"
  ON training_routines FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Accessories/Equipment
CREATE TABLE accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text CHECK (category IN ('equipment', 'supplement', 'recovery')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view accessories"
  ON accessories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage accessories"
  ON accessories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Routine Exercises
CREATE TABLE routine_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id uuid NOT NULL REFERENCES training_routines(id) ON DELETE CASCADE,
  exercise_name text NOT NULL,
  sets integer,
  reps text,
  rest_seconds integer,
  notes text,
  order_index integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routine_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view routine exercises"
  ON routine_exercises FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage routine exercises"
  ON routine_exercises FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- User Assessment
CREATE TABLE user_assessment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  test_date date DEFAULT CURRENT_DATE,
  push_ups integer,
  pull_ups integer,
  dips integer,
  handstand_hold_seconds integer,
  muscle_up_count integer,
  assessment_notes text,
  UNIQUE(user_id, test_date)
);

ALTER TABLE user_assessment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessment"
  ON user_assessment FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can view all assessments"
  ON user_assessment FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can manage assessments"
  ON user_assessment FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attendance
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  attendance_date date NOT NULL,
  marked_at timestamptz DEFAULT now(),
  marked_by uuid REFERENCES user_profiles(id),
  UNIQUE(class_id, user_id, attendance_date)
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view attendance of their classes"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coach_assignments ca
      WHERE ca.coach_id = auth.uid()
      AND ca.class_id = class_id
      AND ca.is_active = true
    )
  );

CREATE POLICY "Admin can view all attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins and coaches can mark attendance"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'coach')
    )
  );

-- Admin Config
CREATE TABLE admin_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  bank_name text,
  account_type text,
  account_number text,
  rut text,
  holder_name text,
  whatsapp_number text,
  email text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admin config"
  ON admin_config FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage own config"
  ON admin_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_classes_day_time ON classes(day_of_week, start_time);
CREATE INDEX idx_reservations_user ON class_reservations(user_id);
CREATE INDEX idx_reservations_class ON class_reservations(class_id);
CREATE INDEX idx_coach_assignments_coach ON coach_assignments(coach_id);
CREATE INDEX idx_routine_exercises_routine ON routine_exercises(routine_id);
CREATE INDEX idx_assessment_user ON user_assessment(user_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
