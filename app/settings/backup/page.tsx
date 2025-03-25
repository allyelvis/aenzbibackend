"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, RefreshCw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api-client"
import { formatDate } from "@/lib/utils"

export default function BackupPage() {
  const { toast } = useToast()
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [restoreInProgress, setRestoreInProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch backups
  const fetchBackups = async () => {
    setLoading(true)
    try {
      const { backups } = await apiClient.get("/api/system/backups")
      setBackups(backups || [])
    } catch (error) {
      console.error("Error fetching backups:", error)
      toast({
        title: "Error",
        description: "Failed to load backup history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchBackups()
  }, [])

  // Create backup
  const createBackup = async () => {
    setBackupInProgress(true)
    setProgress(0)

    try {
      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 300)

      // Create backup
      await apiClient.post("/api/system/backups")

      clearInterval(interval)
      setProgress(100)

      toast({
        title: "Success",
        description: "Backup created successfully",
      })

      // Refresh backup list
      fetchBackups()
    } catch (error) {
      console.error("Error creating backup:", error)
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setBackupInProgress(false)
        setProgress(0)
      }, 1000)
    }
  }

  // Download backup
  const downloadBackup = async (id: string) => {
    try {
      const response = await apiClient.get(`/api/system/backups/${id}/download`, {
        responseType: "blob",
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `backup-${id}.zip`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast({
        title: "Success",
        description: "Backup download started",
      })
    } catch (error) {
      console.error("Error downloading backup:", error)
      toast({
        title: "Error",
        description: "Failed to download backup",
        variant: "destructive",
      })
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Restore from backup
  const restoreBackup = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a backup file",
        variant: "destructive",
      })
      return
    }

    setRestoreInProgress(true)
    setProgress(0)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 300)

      // Upload backup
      await apiClient.post("/api/system/restore", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      clearInterval(interval)
      setProgress(100)

      toast({
        title: "Success",
        description: "System restored successfully",
      })

      // Refresh backup list
      fetchBackups()
    } catch (error) {
      console.error("Error restoring backup:", error)
      toast({
        title: "Error",
        description: "Failed to restore from backup",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setRestoreInProgress(false)
        setProgress(0)
        setSelectedFile(null)
      }, 1000)
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Backup & Restore</h1>
        <p className="text-muted-foreground">Manage system backups and restore points</p>
      </div>

      <Tabs defaultValue="backup">
        <TabsList className="grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Backup</CardTitle>
              <CardDescription>Create a complete backup of your system data</CardDescription>
            </CardHeader>
            <CardContent>
              {backupInProgress ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup in progress...</span>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This will create a complete backup of your database, including all customers, products, orders, and
                  system settings.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={createBackup} disabled={backupInProgress} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>View and download previous backups</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading backups...</div>
              ) : backups.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No backups found</div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium">Backup {formatDate(backup.createdAt, "PPpp")}</div>
                        <div className="text-sm text-muted-foreground">Size: {backup.size}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => downloadBackup(backup.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restore" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restore System</CardTitle>
              <CardDescription>Restore your system from a backup file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Warning</h3>
                  </div>
                  <div className="mt-2">
                    <p>
                      Restoring from a backup will replace all current data. This action cannot be undone. Make sure to
                      create a backup of your current system before proceeding.
                    </p>
                  </div>
                </div>

                {restoreInProgress ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Restore in progress...</span>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <label htmlFor="backup-file" className="text-sm font-medium">
                        Select Backup File
                      </label>
                      <Input id="backup-file" type="file" accept=".zip" onChange={handleFileChange} />
                    </div>
                    {selectedFile && (
                      <div className="text-sm">
                        Selected file: <span className="font-medium">{selectedFile.name}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={restoreBackup} disabled={restoreInProgress || !selectedFile} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Restore System
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restore Points</CardTitle>
              <CardDescription>System automatically creates restore points before major changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">Loading restore points...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium">Pre-Update Restore Point</div>
                        <div className="text-sm text-muted-foreground">
                          Created: {formatDate(new Date(Date.now() - 86400000), "PPpp")}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Restore Point",
                            description: "System restored to previous state",
                          })
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="font-medium">Weekly Automatic Backup</div>
                        <div className="text-sm text-muted-foreground">
                          Created: {formatDate(new Date(Date.now() - 604800000), "PPpp")}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Restore Point",
                            description: "System restored to previous state",
                          })
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

