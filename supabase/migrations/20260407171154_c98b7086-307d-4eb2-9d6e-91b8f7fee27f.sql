
CREATE TYPE public.app_role AS ENUM ('admin', 'coach', 'alumno');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role app_role NOT NULL DEFAULT 'alumno',
  level TEXT NOT NULL DEFAULT 'principiante',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.user_profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Calistenia',
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 20,
  current_capacity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view classes" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.class_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reservation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.class_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reservations" ON public.class_reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reservations" ON public.class_reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reservations" ON public.class_reservations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all reservations" ON public.class_reservations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.training_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'principiante',
  group_type TEXT NOT NULL DEFAULT 'push',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.training_routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view routines" ON public.training_routines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage routines" ON public.training_routines FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.classes (name, day_of_week, start_time, end_time) VALUES
  ('Calistenia Lunes', 'Lunes', '09:00', '10:00'),
  ('Calistenia Lunes', 'Lunes', '18:00', '19:00'),
  ('Calistenia Lunes', 'Lunes', '19:00', '20:00'),
  ('Calistenia Lunes', 'Lunes', '20:00', '21:00'),
  ('Calistenia Martes', 'Martes', '09:00', '10:00'),
  ('Calistenia Martes', 'Martes', '18:00', '19:00'),
  ('Calistenia Martes', 'Martes', '19:00', '20:00'),
  ('Calistenia Martes', 'Martes', '20:00', '21:00'),
  ('Calistenia Miércoles', 'Miércoles', '09:00', '10:00'),
  ('Calistenia Miércoles', 'Miércoles', '18:00', '19:00'),
  ('Calistenia Miércoles', 'Miércoles', '19:00', '20:00'),
  ('Calistenia Miércoles', 'Miércoles', '20:00', '21:00'),
  ('Calistenia Jueves', 'Jueves', '09:00', '10:00'),
  ('Calistenia Jueves', 'Jueves', '18:00', '19:00'),
  ('Calistenia Jueves', 'Jueves', '19:00', '20:00'),
  ('Calistenia Jueves', 'Jueves', '20:00', '21:00'),
  ('Calistenia Viernes', 'Viernes', '09:00', '10:00'),
  ('Calistenia Viernes', 'Viernes', '18:00', '19:00'),
  ('Calistenia Viernes', 'Viernes', '19:00', '20:00'),
  ('Calistenia Viernes', 'Viernes', '20:00', '21:00'),
  ('Calistenia Sábado', 'Sábado', '09:00', '10:00'),
  ('Calistenia Sábado', 'Sábado', '18:00', '19:00');
