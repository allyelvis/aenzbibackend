"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// User type
export interface User {
  id: string
  email: string
  name: string
  role: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Public routes that don't require authentication
const publicRoutes = ["/login", "/forgot-password", "/reset-password"]

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname || "")

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { user } = await apiClient.get("/api/auth/me")
        setUser(user)
      } catch (error) {
        setUser(null)

        // Redirect to login if not on a public route
        if (!isPublicRoute) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
  }, [router, isPublicRoute, pathname])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { user } = await apiClient.post("/api/auth/login", { email, password })
      setUser(user)
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)

    try {
      await apiClient.post("/api/auth/logout", {})
      setUser(null)
      router.push("/login")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect if authenticated user tries to access public route
  useEffect(() => {
    if (user && isPublicRoute) {
      router.push("/dashboard")
    }
  }, [user, isPublicRoute, router])

  // Show loading spinner while checking authentication
  if (isLoading && !isPublicRoute) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
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

