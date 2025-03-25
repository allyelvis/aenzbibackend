import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth-service"
import { supabase } from "@/lib/supabase/client"

export async function GET() {
  try {
    // Create tables if they don't exist
    await createTables()

    // Create default users if they don't exist
    const defaultUsers = [
      {
        email: "admin@example.com",
        password: "admin123",
        username: "admin",
        full_name: "System Administrator",
        role: "admin" as const,
        department: "IT",
        position: "Administrator",
        pin: "123456",
        phone_number: "+1234567890",
      },
      {
        email: "manager@example.com",
        password: "manager123",
        username: "manager",
        full_name: "System Manager",
        role: "manager" as const,
        department: "Operations",
        position: "Manager",
        phone_number: "+1234567891",
      },
      {
        email: "user@example.com",
        password: "user123",
        username: "user",
        full_name: "Regular User",
        role: "user" as const,
        department: "Sales",
        position: "Sales Representative",
        phone_number: "+1234567892",
      },
    ]

    const results = await Promise.allSettled(
      defaultUsers.map(async (userData) => {
        // Check if user exists
        const { data: existingUsers } = await supabase.from("user_profiles").select("id").eq("email", userData.email)

        if (existingUsers && existingUsers.length > 0) {
          console.log(`User ${userData.email} already exists`)
          return null
        }

        // Create user
        return createUser(userData)
      }),
    )

    const createdUsers = results
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled" && result.value !== null && result.value.user !== null,
      )
      .map((result) => ({
        email: result.value.user.email,
        username: result.value.user.username,
        role: result.value.user.role,
      }))

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      createdUsers: createdUsers.length,
      users: createdUsers,
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize database", details: String(error) }, { status: 500 })
  }
}

// Helper function to create tables
async function createTables() {
  // Create user_profiles table
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS public.user_profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT,
      avatar_url TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      department TEXT,
      position TEXT,
      last_active TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      has_pin BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      phone_number TEXT,
      two_factor_enabled BOOLEAN DEFAULT FALSE
    );
    CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON public.user_profiles (username);
    CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON public.user_profiles (email);
    CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON public.user_profiles (role);
  `)

  // Create user_pins table
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS public.user_pins (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      pin_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      last_used TIMESTAMP WITH TIME ZONE,
      attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP WITH TIME ZONE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS user_pins_user_id_idx ON public.user_pins (user_id);
  `)

  // Create activity_logs table
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS public.activity_logs (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      details JSONB,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON public.activity_logs (user_id);
    CREATE INDEX IF NOT EXISTS activity_logs_action_idx ON public.activity_logs (action);
    CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON public.activity_logs (created_at);
  `)

  // Create security_questions table
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS public.security_questions (
      id SERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      answer_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS security_questions_user_id_idx ON public.security_questions (user_id);
  `)
}

