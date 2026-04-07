
CREATE TABLE public.admin_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL DEFAULT '',
  account_type TEXT NOT NULL DEFAULT '',
  account_number TEXT NOT NULL DEFAULT '',
  rut TEXT NOT NULL DEFAULT '',
  holder_name TEXT NOT NULL DEFAULT '',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage config" ON public.admin_config FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view config" ON public.admin_config FOR SELECT TO authenticated USING (true);
CREATE TRIGGER update_admin_config_updated_at BEFORE UPDATE ON public.admin_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.coach_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coach_id, class_id)
);
ALTER TABLE public.coach_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches can view own assignments" ON public.coach_assignments FOR SELECT USING (auth.uid() = coach_id);
CREATE POLICY "Admins can manage assignments" ON public.coach_assignments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches can insert attendance" ON public.attendance FOR INSERT WITH CHECK (
  public.has_role(auth.uid(), 'coach') OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all attendance" ON public.attendance FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Coaches can view class attendance" ON public.attendance FOR SELECT USING (public.has_role(auth.uid(), 'coach'));
