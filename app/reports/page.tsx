"use client"

import { useState } from "react"
import type React from "react"
import {
  BarChart3,
  Download,
  FileText,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  Mail,
  Printer,
  FileSpreadsheet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { motion } from "framer-motion"

// Mock report templates
const reportTemplates = [
  {
    id: "user-activity",
    name: "User Activity Report",
    icon: Users,
    description: "User logins, registrations, and activity metrics",
  },
  {
    id: "system-performance",
    name: "System Performance Report",
    icon: BarChart3,
    description: "Response times, error rates, and system metrics",
  },
  {
    id: "audit-log",
    name: "Audit Log Report",
    icon: FileText,
    description: "User actions and system changes for compliance",
  },
]

// Mock report data
const generateMockReportData = (rows = 10) => {
  return Array.from({ length: rows }, (_, i) => ({
    id: `REP-${1000 + i}`,
    name: `Report ${i + 1}`,
    type: ["User Activity", "System Performance", "Audit Log"][Math.floor(Math.random() * 3)],
    createdAt: format(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), "MMM dd, yyyy"),
    createdBy: ["Admin User", "John Doe", "Jane Smith"][Math.floor(Math.random() * 3)],
    status: ["Completed", "Processing", "Failed"][Math.floor(Math.random() * 3)],
  }))
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("generate")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [reportFormat, setReportFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)
  const [recentReports, setRecentReports] = useState(generateMockReportData())

  // Handle report generation
  const handleGenerateReport = () => {
    if (!selectedTemplate || !startDate || !endDate) return

    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)

      // Add new report to recent reports
      const newReport = {
        id: `REP-${1000 + recentReports.length}`,
        name: reportTemplates.find((t) => t.id === selectedTemplate)?.name || "Custom Report",
        type: reportTemplates.find((t) => t.id === selectedTemplate)?.name.split(" ")[0] || "Custom",
        createdAt: format(new Date(), "MMM dd, yyyy"),
        createdBy: "Admin User",
        status: "Completed",
      }

      setRecentReports([newReport, ...recentReports])
      setActiveTab("history")
    }, 2000)
  }

  // Get file icon based on format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Generate and manage custom reports</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Report Template</CardTitle>
              <CardDescription>Choose a template to generate your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon
                  const isSelected = selectedTemplate === template.id

                  return (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div
                            className={`p-2 rounded-full ${
                              isSelected
                                ? "bg-primary/20 text-primary"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Parameters</CardTitle>
              <CardDescription>Configure the parameters for your report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      placeholder="Enter report name"
                      defaultValue={
                        selectedTemplate ? reportTemplates.find((t) => t.id === selectedTemplate)?.name : ""
                      }
                    />
                  </div>

                  <div>
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-2 gap-4 mt-1.5">
                      <div>
                        <DatePicker placeholder="Start date" selected={startDate} onSelect={setStartDate} />
                      </div>
                      <div>
                        <DatePicker placeholder="End date" selected={endDate} onSelect={setEndDate} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="report-format">Report Format</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger id="report-format" className="mt-1.5">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Include Sections</Label>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="section-summary" defaultChecked />
                        <Label htmlFor="section-summary" className="font-normal">
                          Executive Summary
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="section-charts" defaultChecked />
                        <Label htmlFor="section-charts" className="font-normal">
                          Charts and Visualizations
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="section-details" defaultChecked />
                        <Label htmlFor="section-details" className="font-normal">
                          Detailed Data Tables
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="section-trends" defaultChecked />
                        <Label htmlFor="section-trends" className="font-normal">
                          Trend Analysis
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Delivery Options</Label>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-download" defaultChecked />
                        <Label htmlFor="delivery-download" className="font-normal">
                          Download Immediately
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-email" />
                        <Label htmlFor="delivery-email" className="font-normal">
                          Send via Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="delivery-schedule" />
                        <Label htmlFor="delivery-schedule" className="font-normal">
                          Schedule for Later
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedTemplate || !startDate || !endDate || isGenerating}
                className="min-w-[120px]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>View and download your previously generated reports</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report, index) => (
                      <motion.tr
                        key={report.id}
                        initial={
                          index === 0 && activeTab === "history" ? { backgroundColor: "rgba(147, 197, 253, 0.3)" } : {}
                        }
                        animate={{ backgroundColor: "transparent" }}
                        transition={{ duration: 2 }}
                      >
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.createdAt}</TableCell>
                        <TableCell>{report.createdBy}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.status === "Completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : report.status === "Processing"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {report.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="icon" disabled={report.status !== "Completed"}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" disabled={report.status !== "Completed"}>
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" disabled={report.status !== "Completed"}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Manage your scheduled recurring reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No Scheduled Reports</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                  You haven't set up any scheduled reports yet. Create a report and select the "Schedule for Later"
                  option to get started.
                </p>
                <Button className="mt-6" onClick={() => setActiveTab("generate")}>
                  Create Scheduled Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SavedReportCard({
  title,
  description,
  lastRun,
  icon,
}: {
  title: string
  description: string
  lastRun: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">Last run: {lastRun}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="outline" size="sm">
          Run Again
        </Button>
      </CardFooter>
    </Card>
  )
}

const topProducts = [
  { name: "Laptop Pro X", category: "Electronics", revenue: 325000, units: 250 },
  { name: "Wireless Earbuds", category: "Electronics", revenue: 180000, units: 2000 },
  { name: "Smartphone X12", category: "Electronics", revenue: 135000, units: 150 },
  { name: "Office Chair", category: "Furniture", revenue: 95000, units: 475 },
  { name: "Coffee Maker", category: "Appliances", revenue: 68000, units: 850 },
]

const salesChannels = [
  { name: "Online Store", percentage: 45, color: "#4f46e5" },
  { name: "Marketplace", percentage: 30, color: "#0ea5e9" },
  { name: "Retail Stores", percentage: 15, color: "#10b981" },
  { name: "Wholesale", percentage: 10, color: "#f59e0b" },
]

const stockAlerts = [
  { product: "Wireless Earbuds", sku: "P002", type: "low", stock: 8 },
  { product: "Office Chair", sku: "P003", type: "low", stock: 5 },
  { product: "Coffee Maker", sku: "P004", type: "out", stock: 0 },
  { product: "Desk Lamp", sku: "P006", type: "low", stock: 3 },
]

const customerSegments = [
  { name: "New Customers", percentage: 25, color: "#4f46e5" },
  { name: "Returning", percentage: 40, color: "#0ea5e9" },
  { name: "Loyal", percentage: 20, color: "#10b981" },
  { name: "At Risk", percentage: 15, color: "#f59e0b" },
]

const expenseCategories = [
  { name: "Payroll", percentage: 45, color: "#4f46e5" },
  { name: "Rent & Utilities", percentage: 20, color: "#0ea5e9" },
  { name: "Marketing", percentage: 15, color: "#10b981" },
  { name: "Software", percentage: 10, color: "#f59e0b" },
  { name: "Other", percentage: 10, color: "#6b7280" },
]

