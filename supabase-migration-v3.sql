-- ============================================
-- MIGRACIÓN V3: Sistema de trazabilidad por paciente
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. TABLA: patients
-- Cada paciente tiene un token único para su enlace personalizado
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_clinic ON public.patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_token ON public.patients(token);

-- 2. Añadir patient_id a nps_responses
ALTER TABLE public.nps_responses
ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_nps_patient ON public.nps_responses(patient_id);

-- 3. Añadir team_members a clinics (si no existe ya de v2)
ALTER TABLE public.clinics
ADD COLUMN IF NOT EXISTS team_members TEXT[] DEFAULT '{}';

-- 4. Añadir staff_members a nps_responses (si no existe ya de v2)
ALTER TABLE public.nps_responses
ADD COLUMN IF NOT EXISTS staff_members TEXT[];

-- ============================================
-- RLS para patients
-- ============================================
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer un paciente por token (para la encuesta pública)
CREATE POLICY "Public can read patient by token"
  ON public.patients FOR SELECT
  USING (true);

-- Cualquiera puede crear un paciente (auto-registro desde encuesta)
CREATE POLICY "Anyone can create patient"
  ON public.patients FOR INSERT
  WITH CHECK (true);

-- Solo el dueño de la clínica puede actualizar pacientes
CREATE POLICY "Clinic owners can update their patients"
  ON public.patients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clinics
      WHERE clinics.id = patients.clinic_id
      AND clinics.owner_id = auth.uid()
    )
  );

-- Solo el dueño puede borrar pacientes
CREATE POLICY "Clinic owners can delete their patients"
  ON public.patients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clinics
      WHERE clinics.id = patients.clinic_id
      AND clinics.owner_id = auth.uid()
    )
  );
