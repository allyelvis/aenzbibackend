"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Key, Lock, Shield, Smartphone, AlertTriangle, Clock, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

export default function SecurityPage() {
  const { user, loading, error, setupPin } = useAuth()

  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [pinError, setPinError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.two_factor_enabled || false)
  const [securityScore, setSecurityScore] = useState(0)

  // Calculate security score
  useState(() => {
    if (user) {
      let score = 50 // Base score

      if (user.has_pin) score += 15
      if (user.two_factor_enabled) score += 25
      if (user.phone_number) score += 10

      // Animate security score
      const timer = setTimeout(() => {
        setSecurityScore(score)
      }, 500)

      return () => clearTimeout(timer)
    }
  })

  // Handle PIN input
  const handlePinInput = (value: string, setter: (value: string) => void) => {
    // Only allow numbers and limit to 6 digits
    const pinRegex = /^[0-9]{0,6}$/
    if (pinRegex.test(value)) {
      setter(value)
    }
  }

  // Handle PIN setup
  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPinError(null)
    setSuccess(null)

    // Validate PIN
    if (pin.length !== 6) {
      setPinError("PIN must be 6 digits")
      return
    }

    if (pin !== confirmPin) {
      setPinError("PINs do not match")
      return
    }

    try {
      await setupPin(pin)
      setSuccess("PIN set up successfully")
      setPin("")
      setConfirmPin("")
    } catch (error) {
      setPinError("Failed to set up PIN")
    }
  }

  // Handle two-factor toggle
  const handleTwoFactorToggle = async (checked: boolean) => {
    setTwoFactorEnabled(checked)
    setSuccess(`Two-factor authentication ${checked ? "enabled" : "disabled"}`)
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Security Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account security and authentication methods
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <span className="text-sm font-medium">Security Score:</span>
              <span className="ml-1 text-sm font-bold">{securityScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Overview */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Security Overview
            </CardTitle>
            <CardDescription>Your account security status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Security Score</span>
                  <span className="text-sm font-medium">{securityScore}%</span>
                </div>
                <Progress value={securityScore} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {securityScore < 70
                    ? "Your account security could be improved. Consider enabling additional security features."
                    : "Your account has good security measures in place."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 mr-3">
                      <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Strong password set</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mr-3">
                      <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium">PIN Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quick access with 6-digit PIN</p>
                    </div>
                  </div>
                  {user.has_pin ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
                      <Smartphone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Additional security layer</p>
                    </div>
                  </div>
                  {user.two_factor_enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Recent Security Activity
            </CardTitle>
            <CardDescription>Recent security-related events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start"
              >
                <div className="mr-4 p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Successful login</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Today at 10:30 AM • Chrome on Windows</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-start"
              >
                <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Profile information updated</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday at 2:15 PM</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-start"
              >
                <div className="mr-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">PIN authentication set up</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
              </motion.div>

              <div className="text-center mt-2">
                <Button variant="link" size="sm">
                  View all activity
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* PIN Setup */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2 text-primary" />
              PIN Authentication
            </CardTitle>
            <CardDescription>
              {user.has_pin ? "Change your 6-digit PIN for quick access" : "Set up a 6-digit PIN for quick access"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pinError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{pinError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSetupPin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-sm font-medium">
                    New 6-Digit PIN
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="pin"
                      type="password"
                      placeholder="Enter 6-digit PIN"
                      value={pin}
                      onChange={(e) => handlePinInput(e.target.value, setPin)}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 tracking-widest text-center font-mono"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-pin" className="text-sm font-medium">
                    Confirm PIN
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-pin"
                      type="password"
                      placeholder="Confirm 6-digit PIN"
                      value={confirmPin}
                      onChange={(e) => handlePinInput(e.target.value, setConfirmPin)}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      inputMode="numeric"
                      className="pl-10 h-11 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20 tracking-widest text-center font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
              <Button type="submit" className="h-11 px-6 font-medium shadow-md hover:shadow-lg transition-all mt-2">
                {user.has_pin ? "Update PIN" : "Set up PIN"}
              </Button>
            </form>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your PIN allows you to quickly sign in without entering your full password. Keep it secure and don't
                  share it with anyone.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2 text-primary" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="space-y-0.5">
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Require a verification code when signing in
                </div>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Two-factor authentication is currently in development. This toggle is for demonstration purposes only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Questions */}
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-950">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Security Questions
            </CardTitle>
            <CardDescription>Set up security questions for account recovery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="flex">
                <FileText className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Security questions help verify your identity if you need to recover your account. This feature is
                  coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

