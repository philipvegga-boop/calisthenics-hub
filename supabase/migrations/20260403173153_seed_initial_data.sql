/*
  # Datos Iniciales - Academia Poder Estoico
  
  Clases base, rutinas por nivel, accesorios y configuración del admin
  
  NOTA: El admin debe ser creado manualmente con:
  - Email: Será el del usuario admin
  - Rol: admin
  - RUT: 201859271
*/

-- Insert sample classes (Horarios de la Academia)
INSERT INTO classes (name, description, day_of_week, start_time, end_time, max_capacity)
VALUES
  ('Calistenia Principiante', 'Rutina para iniciantes en calistenia', 'Lun', '18:00', '19:00', 20),
  ('Calistenia Avanzado', 'Técnicas avanzadas y skills', 'Lun', '19:15', '20:15', 15),
  ('Calistenia Principiante', 'Rutina para iniciantes', 'Mar', '18:00', '19:00', 20),
  ('Calistenia Intermedio', 'Progresión de fuerza', 'Mar', '19:15', '20:15', 18),
  ('Calistenia Principiante', 'Rutina para iniciantes', 'Mié', '18:00', '19:00', 20),
  ('Calistenia Avanzado', 'Técnicas avanzadas', 'Mié', '19:15', '20:15', 15),
  ('Calistenia Intermedio', 'Progresión de fuerza', 'Jue', '18:00', '19:00', 18),
  ('Calistenia Avanzado', 'Skills y movimientos complejos', 'Jue', '19:15', '20:15', 15),
  ('Calistenia Principiante', 'Rutina para iniciantes', 'Vie', '18:00', '19:00', 20),
  ('Calistenia Intermedio', 'Progresión de fuerza', 'Vie', '19:15', '20:15', 18),
  ('Calistenia Completo', 'Sesión integral', 'Sáb', '09:00', '10:30', 25),
  ('Calistenia Avanzado', 'Skills y freestyle', 'Sáb', '11:00', '12:30', 15)
ON CONFLICT DO NOTHING;

-- Insert Training Routines (Rutinas organizadas por nivel y grupo)
-- PRINCIPIANTE
INSERT INTO training_routines (name, description, level, group_type, duration_minutes)
VALUES
  ('Rutina Base - G1', 'Fundamentos de calistenia Grupo 1', 'principiante', 'G1', 60),
  ('Rutina Base - G2', 'Fundamentos de calistenia Grupo 2', 'principiante', 'G2', 60),
  ('Descanso Activo', 'Día de recuperación y movilidad', 'principiante', 'G1', 45)
ON CONFLICT DO NOTHING;

-- INTERMEDIO
INSERT INTO training_routines (name, description, level, group_type, duration_minutes)
VALUES
  ('Progresión Fuerza - G1', 'Aumento de fuerza y resistencia Grupo 1', 'intermedio', 'G1', 60),
  ('Progresión Fuerza - G2', 'Aumento de fuerza y resistencia Grupo 2', 'intermedio', 'G2', 60),
  ('Descanso Activo Intermedio', 'Recuperación enfocada', 'intermedio', 'G1', 45)
ON CONFLICT DO NOTHING;

-- AVANZADO
INSERT INTO training_routines (name, description, level, group_type, duration_minutes)
VALUES
  ('Skills Avanzados - G1', 'Desarrollo de movimientos complejos Grupo 1', 'avanzado', 'G1', 75),
  ('Skills Avanzados - G2', 'Desarrollo de movimientos complejos Grupo 2', 'avanzado', 'G2', 75),
  ('Descanso Activo Avanzado', 'Recuperación y prevención de lesiones', 'avanzado', 'G1', 45)
ON CONFLICT DO NOTHING;

-- Insert Exercises for Principiante - G1
INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Calentamiento General', 1, '5 min', 0, 'Movilidad dinámica', 1
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Flexiones (Rodillas)', 3, '8-12', 90, 'Progresión básica', 2
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Sentadillas Simples', 3, '12-15', 90, 'Peso corporal', 3
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Flexiones en Barra (Negativas)', 3, '5-8', 120, 'Asistidas si es necesario', 4
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Dips en Banco', 3, '6-10', 90, 'Controlados', 5
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Planchas Abdominales', 3, '20-30 seg', 60, 'Mantener posición', 6
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Estiramiento Final', 1, '5 min', 0, 'Recuperación', 7
FROM training_routines WHERE name = 'Rutina Base - G1'
ON CONFLICT DO NOTHING;

-- Insert Exercises for Intermedio - G1
INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Calentamiento Dinámico', 1, '5 min', 0, 'Movilidad y agilidad', 1
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Flexiones Palmas Normales', 4, '12-15', 90, 'Aumentar reps', 2
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Dominadas Asistidas', 4, '6-10', 120, 'Banda elástica si es necesario', 3
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Pistol Squat Progresión', 3, '5-8 por lado', 120, 'Con apoyo', 4
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Dips Profundos', 3, '8-12', 120, 'Control total', 5
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Abdominales Colgantes', 3, '8-12', 90, 'Elevaciones de piernas', 6
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Estiramiento Completo', 1, '5-7 min', 0, 'Recuperación y flexibilidad', 7
FROM training_routines WHERE name = 'Progresión Fuerza - G1'
ON CONFLICT DO NOTHING;

-- Insert Exercises for Avanzado - G1
INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Calentamiento Intenso', 1, '5-7 min', 0, 'Preparación articular', 1
FROM training_routines WHERE name = 'Skills Avanzados - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Flexiones Diamante', 4, '10-15', 90, 'Aumentar intensidad', 2
FROM training_routines WHERE name = 'Skills Avanzados - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Dominadas Estrictas', 5, '8-12', 120, 'Sin balanceo', 3
FROM training_routines WHERE name = 'Skills Avanzados - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Front Lever Progresión', 4, '5-15 seg', 180, 'Hacia la retención', 4
FROM training_routines WHERE name = 'Skills Avanzados - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Muscle Ups', 3, '3-6', 180, 'Técnica pura', 5
FROM training_routines WHERE name = 'Skills Avanzados - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Plancha Lateral en L', 3, '15-30 seg cada lado', 120, 'Control y fuerza core', 6
FROM training_routines WHERE name = 'Skills Avanzados - G1'
ON CONFLICT DO NOTHING;

INSERT INTO routine_exercises (routine_id, exercise_name, sets, reps, rest_seconds, notes, order_index)
SELECT id, 'Enfriamiento y Recuperación', 1, '7-10 min', 0, 'Movilidad y estiramientos', 7
FROM training_routines WHERE name = 'Skills Avanzado - G1'
ON CONFLICT DO NOTHING;

-- Insert Accessories/Equipment
INSERT INTO accessories (name, description, category)
VALUES
  ('Barra de Dominadas', 'Barra fija para dominadas', 'equipment'),
  ('Banda Elástica', 'Para asistencia en movimientos', 'equipment'),
  ('Paralelas Calistenia', 'Estructura para dips y movimientos', 'equipment'),
  ('Mat Yoga/Entrenamiento', 'Colchoneta de protección', 'equipment'),
  ('Whey Protein', 'Proteína para recuperación', 'supplement'),
  ('BCAA', 'Aminoácidos ramificados', 'supplement'),
  ('Foam Roller', 'Masaje y recuperación muscular', 'recovery'),
  ('Lacrosse Ball', 'Punto de presión para tensión', 'recovery'),
  ('Electrolitos', 'Hidratación durante entrenamientos', 'supplement')
ON CONFLICT DO NOTHING;

-- Insert Admin Config (Se actualizará después con datos reales)
-- Este es un placeholder que se actualiza desde el panel admin
INSERT INTO admin_config (admin_id, bank_name, account_type, account_number, rut, holder_name, whatsapp_number, email)
SELECT 
  (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1),
  'Mercado Pago',
  'Cuenta Vista',
  '1046686070',
  '201859271',
  'Philip Jorge Alexander Vega Mercado',
  '+56912345678',
  'philipvegga@gmail.com'
WHERE EXISTS (SELECT 1 FROM user_profiles WHERE role = 'admin')
ON CONFLICT DO NOTHING;
