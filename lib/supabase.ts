import { createClient } from "@supabase/supabase-js"
import { env } from "./env"

// Create a single supabase client for interacting with your database
export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Types for Supabase users
export type SupabaseUser = {
  id: string
  email: string
  user_metadata: {
    username?: string
    name?: string
    role?: string
    has_pin?: boolean
  }
}

// Helper to get user metadata with defaults
export function getUserMetadata(user: SupabaseUser) {
  return {
    username: user.user_metadata?.username || user.email?.split("@")[0] || "",
    name: user.user_metadata?.name || "",
    role: user.user_metadata?.role || "user",
    hasPin: user.user_metadata?.has_pin || false,
  }
}

