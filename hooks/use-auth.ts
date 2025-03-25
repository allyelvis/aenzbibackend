"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { UserProfile } from "@/lib/supabase/client"

// Create Supabase client
const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Auth context type
interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  error: string | null
  loginWithPassword: (email: string, password: string) => Promise<void>
  loginWithPin: (email: string, pin: string) => Promise<void>
  logout: () => Promise<void>
  setupPin: (pin: string) => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (password: string) => Promise<void>
  setupSecurityQuestions: (questions: Array<{ question: string; answer: string }>) => Promise<void>
  verifySecurityQuestions: (userId: string, answers: Array<{ id: number; answer: string }>) => Promise<boolean>
  getActivityLogs: (limit?: number, offset?: number) => Promise<{ logs: any[]; count: number }>
  clearError: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode
}

// Auth provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check authentication status on mount and when auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        checkAuth()
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    checkAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/me")

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Clear error
  const clearError = () => {
    setError(null)
  }

  // Login with email and password
  const loginWithPassword = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        router.push("/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Login with PIN
  const loginWithPin = async (email: string, pin: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pin }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        router.push("/dashboard")
      } else {
        setError(data.error || "PIN login failed")
      }
    } catch (error) {
      console.error("PIN login error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Set up PIN
  const setupPin = async (pin: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/setup-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        return
      } else {
        setError(data.error || "Failed to set up PIN")
      }
    } catch (error) {
      console.error("Setup PIN error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Update profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        setUser(responseData.user)
        return
      } else {
        setError(responseData.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Update profile error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to request password reset")
      }
    } catch (error) {
      console.error("Password reset request error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to reset password")
      }
    } catch (error) {
      console.error("Password reset error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Setup security questions
  const setupSecurityQuestions = async (questions: Array<{ question: string; answer: string }>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/security-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to set up security questions")
      }
    } catch (error) {
      console.error("Setup security questions error:", error)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Verify security questions
  const verifySecurityQuestions = async (userId: string, answers: Array<{ id: number; answer: string }>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/security-questions/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, answers }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to verify security questions")
        return false
      }

      return data.success
    } catch (error) {
      console.error("Verify security questions error:", error)
      setError("An unexpected error occurred")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Get activity logs
  const getActivityLogs = async (limit = 50, offset = 0) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/auth/activity?limit=${limit}&offset=${offset}`)

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to get activity logs")
        return { logs: [], count: 0 }
      }

      return { logs: data.logs, count: data.count }
    } catch (error) {
      console.error("Get activity logs error:", error)
      \
      setError('An unexpected error  {
      console.error('Get activity logs error:', error)
      setError("An unexpected error occurred")
      return { logs: [], count: 0 }
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setLoading(true)

      await fetch("/api/auth/logout", {
        method: "POST",
      })

      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithPassword,
        loginWithPin,
        logout,
        setupPin,
        updateProfile,
        requestPasswordReset,
        resetPassword,
        setupSecurityQuestions,
        verifySecurityQuestions,
        getActivityLogs,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

