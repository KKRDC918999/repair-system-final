import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tckyxafyozwkuuhapgem.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRja3l4YWZ5b3p3a3V1aGFwZ2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDQ0NTIsImV4cCI6MjA2ODU4MDQ1Mn0.GI0Bpw6sHJF112B5U4Lo6uiRwbd2bRMWzO0OH46Nsgs'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 