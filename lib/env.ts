// Environment variables validation and export
export function validateEnv() {
  // Required environment variables
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  // Optional environment variables with defaults
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  }

  // In development, provide some default values for easier setup
  if (process.env.NODE_ENV === "development") {
    if (!envVars.JWT_SECRET) {
      console.warn("JWT_SECRET not set, using default for development")
      envVars.JWT_SECRET = "dev-jwt-secret-do-not-use-in-production"
    }
  }

  // Check for missing required variables
  const missingVars = requiredEnvVars.filter((name) => !process.env[name] && !envVars[name as keyof typeof envVars])

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`)
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
    }
  }

  return envVars
}

// Export env for direct access
export const env = validateEnv()

