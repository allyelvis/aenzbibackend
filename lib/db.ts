import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Environment variables validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

// Create admin client for server-side operations
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing environment variable: SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Database types
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]

export type InsertTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]

export type UpdateTables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]

// Helper functions for common database operations
export async function getById<T extends keyof Database["public"]["Tables"]>(table: T, id: string) {
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single()

  if (error) throw error
  return data as Tables<T>
}

export async function getAll<T extends keyof Database["public"]["Tables"]>(
  table: T,
  options?: {
    limit?: number
    offset?: number
    orderBy?: string
    orderDirection?: "asc" | "desc"
  },
) {
  let query = supabase.from(table).select("*")

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.orderDirection === "asc" })
  }

  const { data, error } = await query

  if (error) throw error
  return data as Tables<T>[]
}

export async function insert<T extends keyof Database["public"]["Tables"]>(table: T, data: InsertTables<T>) {
  const { data: result, error } = await supabase.from(table).insert(data).select().single()

  if (error) throw error
  return result as Tables<T>
}

export async function update<T extends keyof Database["public"]["Tables"]>(
  table: T,
  id: string,
  data: UpdateTables<T>,
) {
  const { data: result, error } = await supabase.from(table).update(data).eq("id", id).select().single()

  if (error) throw error
  return result as Tables<T>
}

export async function remove<T extends keyof Database["public"]["Tables"]>(table: T, id: string) {
  const { error } = await supabase.from(table).delete().eq("id", id)

  if (error) throw error
  return true
}

