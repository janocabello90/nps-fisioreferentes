-- Migration v4: Prevent duplicate patients by email per clinic
-- Run this in Supabase SQL Editor

-- First, merge any existing duplicate patients (same email, same clinic)
-- This keeps the oldest record and reassigns responses from duplicates
DO $$
DECLARE
  dup RECORD;
  keep_id UUID;
BEGIN
  FOR dup IN
    SELECT clinic_id, email, array_agg(id ORDER BY created_at ASC) AS ids
    FROM patients
    WHERE email IS NOT NULL AND email != ''
    GROUP BY clinic_id, email
    HAVING COUNT(*) > 1
  LOOP
    keep_id := dup.ids[1]; -- keep the oldest
    -- Reassign all responses from duplicates to the kept patient
    UPDATE nps_responses
    SET patient_id = keep_id
    WHERE patient_id = ANY(dup.ids[2:]);
    -- Delete the duplicate patient records
    DELETE FROM patients
    WHERE id = ANY(dup.ids[2:]);
  END LOOP;
END $$;

-- Now create a unique index (only for non-null emails)
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_clinic_email_unique
ON patients (clinic_id, email)
WHERE email IS NOT NULL AND email != '';
