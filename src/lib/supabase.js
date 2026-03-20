import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dgnazpsulhrhikviktfa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbmF6cHN1bGhyaGlrdmlrdGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTQ2NjYsImV4cCI6MjA4OTU3MDY2Nn0.Rs7aonT1hkRsyB0IsdOSJCdvfizVBXgBfgKry2z6FJA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
