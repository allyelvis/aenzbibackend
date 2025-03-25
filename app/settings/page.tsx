import { Cloud, CreditCard, Lock, Mail, Settings, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <Settings className="h-6 w-6 text-primary" />
          <span>AENZBi Cloud</span>
        </div>
        <nav className="hidden flex-1 md:flex md:justify-center">
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/inventory" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Inventory
            </Link>
            <Link href="#" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Sales
            </Link>
            <Link href="/customers" className="font-medium text-muted-foreground transition-colors hover:text-primary">
              Customers
            </Link>
          </div>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Button variant="outline" size="sm">
            Help
          </Button>
          <Button size="sm">Upgrade Plan</Button>
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
          </div>

          <div className="mt-6">
            <Tabs defaultValue="general">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="md:w-1/4">
                  <TabsList className="flex flex-col items-start gap-1 bg-transparent p-0">
                    <TabsTrigger
                      value="general"
                      className="flex w-full items-center justify-start gap-2 data-[state=active]:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="billing"
                      className="flex w-full items-center justify-start gap-2 data-[state=active]:bg-muted"
                    >
                      <CreditCard className="h-4 w-4" />
                      Billing
                    </TabsTrigger>
                    <TabsTrigger
                      value="security"
                      className="flex w-full items-center justify-start gap-2 data-[state=active]:bg-muted"
                    >
                      <Lock className="h-4 w-4" />
                      Security
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="flex w-full items-center justify-start gap-2 data-[state=active]:bg-muted"
                    >
                      <Mail className="h-4 w-4" />
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="cloud"
                      className="flex w-full items-center justify-start gap-2 data-[state=active]:bg-muted"
                    >
                      <Cloud className="h-4 w-4" />
                      Cloud Storage
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1">
                  <TabsContent value="general" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Manage your account information and preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Company Information</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="company-name">Company Name</Label>
                              <Input id="company-name" defaultValue="Acme Inc." />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="business-type">Business Type</Label>
                              <Select defaultValue="retail">
                                <SelectTrigger id="business-type">
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="retail">Retail</SelectItem>
                                  <SelectItem value="wholesale">Wholesale</SelectItem>
                                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                  <SelectItem value="service">Service</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tax-id">Tax ID / VAT Number</Label>
                              <Input id="tax-id" defaultValue="US123456789" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="currency">Default Currency</Label>
                              <Select defaultValue="usd">
                                <SelectTrigger id="currency">
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="usd">USD ($)</SelectItem>
                                  <SelectItem value="eur">EUR (€)</SelectItem>
                                  <SelectItem value="gbp">GBP (£)</SelectItem>
                                  <SelectItem value="jpy">JPY (¥)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Regional Settings</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select defaultValue="en">
                                <SelectTrigger id="language">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                  <SelectItem value="de">German</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="timezone">Timezone</Label>
                              <Select defaultValue="utc-8">
                                <SelectTrigger id="timezone">
                                  <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                                  <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                                  <SelectItem value="utc+0">UTC</SelectItem>
                                  <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="date-format">Date Format</Label>
                              <RadioGroup defaultValue="mdy" id="date-format" className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="mdy" id="mdy" />
                                  <Label htmlFor="mdy">MM/DD/YYYY</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="dmy" id="dmy" />
                                  <Label htmlFor="dmy">DD/MM/YYYY</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="ymd" id="ymd" />
                                  <Label htmlFor="ymd">YYYY-MM-DD</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="billing" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing Settings</CardTitle>
                        <CardDescription>Manage your subscription and payment methods</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Current Plan</h3>
                          <div className="rounded-lg border p-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                              <div>
                                <h4 className="font-semibold">Business Pro Plan</h4>
                                <p className="text-sm text-muted-foreground">$49.99/month</p>
                              </div>
                              <Button>Upgrade Plan</Button>
                            </div>
                            <div className="mt-4 grid gap-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm">Unlimited users</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm">500GB cloud storage</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm">Advanced analytics</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-sm">24/7 support</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Payment Methods</h3>
                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                <div>
                                  <p className="font-medium">Visa ending in 4242</p>
                                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment Method
                          </Button>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Billing History</h3>
                          <div className="rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead className="text-right">Receipt</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Mar 01, 2025</TableCell>
                                  <TableCell>Business Pro Plan - Monthly</TableCell>
                                  <TableCell>$49.99</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                      Download
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Feb 01, 2025</TableCell>
                                  <TableCell>Business Pro Plan - Monthly</TableCell>
                                  <TableCell>$49.99</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                      Download
                                    </Button>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Jan 01, 2025</TableCell>
                                  <TableCell>Business Pro Plan - Monthly</TableCell>
                                  <TableCell>$49.99</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                      Download
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="cloud" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cloud Storage Settings</CardTitle>
                        <CardDescription>Manage your cloud storage preferences and usage</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Storage Usage</h3>
                          <div className="rounded-lg border p-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Total Storage</span>
                                <span>500 GB</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Used</span>
                                <span className="text-sm text-muted-foreground">234.5 GB (46.9%)</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div className="h-2 w-[46.9%] rounded-full bg-primary" />
                              </div>
                            </div>
                            <div className="mt-4 grid gap-2 md:grid-cols-3">
                              <div className="rounded-md border p-2">
                                <div className="text-sm font-medium">Documents</div>
                                <div className="text-xs text-muted-foreground">125.8 GB</div>
                              </div>
                              <div className="rounded-md border p-2">
                                <div className="text-sm font-medium">Images</div>
                                <div className="text-xs text-muted-foreground">84.2 GB</div>
                              </div>
                              <div className="rounded-md border p-2">
                                <div className="text-sm font-medium">Other</div>
                                <div className="text-xs text-muted-foreground">24.5 GB</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Storage Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="auto-backup">Automatic Backups</Label>
                                <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                              </div>
                              <Switch id="auto-backup" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="file-versioning">File Versioning</Label>
                                <p className="text-sm text-muted-foreground">Keep previous versions of files</p>
                              </div>
                              <Switch id="file-versioning" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="compression">Compress Files</Label>
                                <p className="text-sm text-muted-foreground">
                                  Automatically compress files to save space
                                </p>
                              </div>
                              <Switch id="compression" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Data Retention</h3>
                          <div className="space-y-2">
                            <Label htmlFor="retention-period">Retention Period</Label>
                            <Select defaultValue="90">
                              <SelectTrigger id="retention-period">
                                <SelectValue placeholder="Select retention period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="60">60 days</SelectItem>
                                <SelectItem value="90">90 days</SelectItem>
                                <SelectItem value="180">180 days</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                                <SelectItem value="forever">Forever</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                              Deleted files will be kept in trash for this period before permanent deletion
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

