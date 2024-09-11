import { createBrowserClient } from '@supabase/ssr'
const PROJECT_URL = process.env.PROJECT_URL || "";
const ANON_PUBLIC = process.env.ANON_PUBLIC || "";
export function createClient() {
  return createBrowserClient(
    PROJECT_URL,ANON_PUBLIC
  )
}