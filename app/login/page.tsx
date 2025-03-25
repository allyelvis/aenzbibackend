"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertCircle, Key, Mail, Lock, Eye, EyeOff, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { user, loading, error, loginWithPassword, loginWithPin, requestPasswordReset, clearError } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pin, setPin] = useState("")
  const [activeTab, setActiveTab] = useState("password")
  const [showPassword, setShowPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  // Handle password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await loginWithPassword(email, password)
  }

  // Handle PIN login
  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await loginWithPin(email, pin)
  }

  // Handle PIN input
  const handlePinInput = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const pinRegex = /^[0-9]{0,6}$/
    if (pinRegex.test(value)) {
      setPin(value)
    }
  }

  // Handle password reset request
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    await requestPasswordReset(resetEmail)
    setResetSuccess(true)
  }

  // Close reset dialog
  const closeResetDialog = () => {
    setResetDialogOpen(false)
    setResetEmail("")
    setResetSuccess(false)
  }

  // Clear error when changing tabs
  const handleTabChange = (value: string) => {
    clearError()
    setActiveTab(value)
  }

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              AENZBi Cloud
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Business Management System</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">Sign in to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Tabs defaultValue="password" value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger
                    value="password"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all",
                      "data-[state=active]:shadow-md",
                    )}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </TabsTrigger>
                  <TabsTrigger
                    value="pin"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all",
                      "data-[state=active]:shadow-md",
                    )}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    PIN
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="password">
                  <form onSubmit={handlePasswordLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={() => setResetDialogOpen(true)}
                          className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 mt-2 font-medium shadow-md hover:shadow-lg transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Signing in...
                        </>
                      ) : (
                        "Sign in with Password"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="pin">
                  <form onSubmit={handlePinLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin-email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="pin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pin" className="text-sm font-medium">
                        6-Digit PIN
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="pin"
                          type="password"
                          placeholder="Enter your 6-digit PIN"
                          value={pin}
                          onChange={(e) => handlePinInput(e.target.value)}
                          maxLength={6}
                          pattern="[0-9]{6}"
                          inputMode="numeric"
                          className="pl-10 h-12 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 tracking-widest text-center font-mono"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 mt-2 font-medium shadow-md hover:shadow-lg transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Signing in...
                        </>
                      ) : (
                        "Sign in with PIN"
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        PIN login provides quick access for returning users. You can set up a PIN in your profile
                        settings after logging in with your password.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-0 pb-6">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                Don&apos;t have an account? Contact your administrator
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400"
        >
          &copy; {new Date().getFullYear()} AENZBi Cloud. All rights reserved.
        </motion.div>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{resetSuccess ? "Check Your Email" : "Reset Password"}</DialogTitle>
            <DialogDescription>
              {resetSuccess
                ? "If an account exists with that email, we've sent password reset instructions."
                : "Enter your email address and we'll send you a link to reset your password."}
            </DialogDescription>
          </DialogHeader>

          {!resetSuccess ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="h-10 border-gray-200 dark:border-gray-700"
                  required
                />
              </div>

              <DialogFooter className="sm:justify-between">
                <Button type="button" variant="outline" onClick={closeResetDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !resetEmail}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <DialogFooter>
              <Button type="button" onClick={closeResetDialog} className="w-full">
                Close
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

