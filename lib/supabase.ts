import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://loepddodudqrglogtabj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZXBkZG9kdWRxcmdsb2d0YWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0ODAwNDcsImV4cCI6MjA2NjA1NjA0N30.wG_UYk7Iz-q3mVHk4iNF57zos1dsW26G8ozlFx0b_ig"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
