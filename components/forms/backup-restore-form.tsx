"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Download, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"

const backupFormSchema = z.object({
  includeFiles: z.boolean().default(true),
  includeSettings: z.boolean().default(true),
  includeUsers: z.boolean().default(true),
})

const restoreFormSchema = z.object({
  backupFile: z.instanceof(File).refine((file) => {
    return file.size <= 100 * 1024 * 1024 // 100MB max
  }, "File size must be less than 100MB"),
})

type BackupFormValues = z.infer<typeof backupFormSchema>
type RestoreFormValues = z.infer<typeof restoreFormSchema>

export function BackupRestoreForm() {
  const { toast } = useToast()
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)

  const backupForm = useForm<BackupFormValues>({
    resolver: zodResolver(backupFormSchema),
    defaultValues: {
      includeFiles: true,
      includeSettings: true,
      includeUsers: true,
    },
  })

  const restoreForm = useForm<RestoreFormValues>({
    resolver: zodResolver(restoreFormSchema),
  })

  async function onBackupSubmit(data: BackupFormValues) {
    try {
      setIsBackingUp(true)

      // In a real app, this would call your backup API
      const response = await apiClient.post<{
        success: boolean
        message: string
        timestamp: string
        backupId: string
      }>("/api/backup", data)

      setLastBackupDate(response.timestamp)

      toast({
        title: "Backup created",
        description: `Backup ID: ${response.backupId}`,
      })
    } catch (error) {
      toast({
        title: "Backup failed",
        description: error instanceof Error ? error.message : "An error occurred during backup",
        variant: "destructive",
      })
    } finally {
      setIsBackingUp(false)
    }
  }

  async function onRestoreSubmit(data: RestoreFormValues) {
    try {
      setIsRestoring(true)

      // In a real app, this would upload the backup file to your restore API
      // For demo purposes, we'll just simulate a successful restore

      // Create a FormData object to upload the file
      const formData = new FormData()
      formData.append("backupFile", data.backupFile)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Restore completed",
        description: "Your system has been restored successfully.",
      })

      // Reset the form
      restoreForm.reset()
    } catch (error) {
      toast({
        title: "Restore failed",
        description: error instanceof Error ? error.message : "An error occurred during restore",
        variant: "destructive",
      })
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Create Backup</CardTitle>
          <CardDescription>Create a backup of your system data</CardDescription>
        </CardHeader>
        <Form {...backupForm}>
          <form onSubmit={backupForm.handleSubmit(onBackupSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={backupForm.control}
                name="includeFiles"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Files</FormLabel>
                      <FormDescription>Include uploaded files and documents in the backup</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={backupForm.control}
                name="includeSettings"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Settings</FormLabel>
                      <FormDescription>Include system settings and configurations</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={backupForm.control}
                name="includeUsers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Users</FormLabel>
                      <FormDescription>Include user accounts and permissions</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              {lastBackupDate && (
                <div className="text-sm text-muted-foreground">
                  Last backup: {new Date(lastBackupDate).toLocaleString()}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isBackingUp}>
                {isBackingUp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Download className="mr-2 h-4 w-4" />
                {isBackingUp ? "Creating Backup..." : "Create Backup"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restore System</CardTitle>
          <CardDescription>Restore your system from a previous backup</CardDescription>
        </CardHeader>
        <Form {...restoreForm}>
          <form onSubmit={restoreForm.handleSubmit(onRestoreSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={restoreForm.control}
                name="backupFile"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Backup File</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="file"
                        accept=".zip,.sql,.json"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            onChange(file)
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Select a backup file to restore (.zip, .sql, or .json)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                <p className="font-medium">Warning</p>
                <p className="mt-1">
                  Restoring a backup will overwrite your current data. This action cannot be undone.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="destructive" disabled={isRestoring}>
                {isRestoring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                {isRestoring ? "Restoring..." : "Restore System"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

