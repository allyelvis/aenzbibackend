"use client"

import { useState } from "react"
import { Search, Book, HelpCircle, FileText, Video, MessageSquare, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter help articles based on search query
  const filterArticles = (articles: any[]) => {
    if (!searchQuery) return articles

    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Help categories
  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Book className="h-5 w-5" />,
      articles: [
        {
          id: "gs-1",
          title: "System Overview",
          description: "Learn about the key features of the AENZBi Cloud Business System",
          link: "/help/articles/system-overview",
        },
        {
          id: "gs-2",
          title: "Setting Up Your Account",
          description: "How to set up your user account and preferences",
          link: "/help/articles/account-setup",
        },
        {
          id: "gs-3",
          title: "Dashboard Guide",
          description: "Understanding the dashboard and key metrics",
          link: "/help/articles/dashboard-guide",
        },
      ],
    },
    {
      id: "customers",
      title: "Customer Management",
      icon: <MessageSquare className="h-5 w-5" />,
      articles: [
        {
          id: "cm-1",
          title: "Adding New Customers",
          description: "How to add and manage customer information",
          link: "/help/articles/adding-customers",
        },
        {
          id: "cm-2",
          title: "Customer Communication",
          description: "Tools for communicating with your customers",
          link: "/help/articles/customer-communication",
        },
        {
          id: "cm-3",
          title: "Customer Analytics",
          description: "Understanding customer behavior and trends",
          link: "/help/articles/customer-analytics",
        },
      ],
    },
    {
      id: "orders",
      title: "Order Processing",
      icon: <FileText className="h-5 w-5" />,
      articles: [
        {
          id: "op-1",
          title: "Creating Orders",
          description: "Step-by-step guide to creating new orders",
          link: "/help/articles/creating-orders",
        },
        {
          id: "op-2",
          title: "Order Fulfillment",
          description: "Managing the order fulfillment process",
          link: "/help/articles/order-fulfillment",
        },
        {
          id: "op-3",
          title: "Returns and Refunds",
          description: "How to process returns and issue refunds",
          link: "/help/articles/returns-refunds",
        },
      ],
    },
  ]

  // FAQ items
  const faqItems = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. You will receive an email with instructions to create a new password. If you don't receive the email, check your spam folder or contact support.",
    },
    {
      question: "Can I export my data to Excel?",
      answer:
        "Yes, you can export data from most tables in the system. Look for the 'Export' button near the top of data tables. You can export to Excel, CSV, or PDF formats depending on your needs.",
    },
    {
      question: "How do I add a new user to my account?",
      answer:
        "To add a new user, go to Settings > User Management and click the 'Add User' button. Fill in the required information and select the appropriate role for the user. They will receive an email invitation to join your account.",
    },
    {
      question: "Is my data backed up automatically?",
      answer:
        "Yes, the system performs automatic daily backups of all your data. You can also create manual backups at any time from the Settings > Backup & Restore page. Backups are retained for 30 days.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can contact customer support by clicking the 'Help' button in the bottom right corner of any page, or by emailing support@aenzbi.com. Our support team is available Monday through Friday, 9am to 5pm EST.",
    },
  ]

  // Video tutorials
  const videoTutorials = [
    {
      id: "vt-1",
      title: "Getting Started with AENZBi",
      description: "A complete overview of the system and its features",
      duration: "10:23",
      thumbnail: "/placeholder.svg?height=180&width=320",
      link: "#",
    },
    {
      id: "vt-2",
      title: "Managing Your Inventory",
      description: "Learn how to track and manage your product inventory",
      duration: "8:45",
      thumbnail: "/placeholder.svg?height=180&width=320",
      link: "#",
    },
    {
      id: "vt-3",
      title: "Processing Orders",
      description: "Step-by-step guide to the order fulfillment process",
      duration: "12:18",
      thumbnail: "/placeholder.svg?height=180&width=320",
      link: "#",
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">Find answers, tutorials, and support resources</p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search help articles..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {filterArticles(category.articles).map((article) => (
                      <li key={article.id}>
                        <a href={article.link} className="flex items-center justify-between text-sm hover:underline">
                          <span>{article.title}</span>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </li>
                    ))}
                    {filterArticles(category.articles).length === 0 && (
                      <li className="text-sm text-muted-foreground">No articles found</li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    View All {category.title} Articles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Popular Articles</CardTitle>
              <CardDescription>Most frequently viewed help resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Importing Customer Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn how to import your existing customer database
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Setting Up Tax Rates</h3>
                      <p className="text-sm text-muted-foreground">Configure tax rates for different regions</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Creating Custom Reports</h3>
                      <p className="text-sm text-muted-foreground">Build custom reports for your business needs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">User Permissions Guide</h3>
                      <p className="text-sm text-muted-foreground">Understanding user roles and permissions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>Contact our support team for assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-sm text-center text-muted-foreground mt-1">
                    Chat with our support team in real-time
                  </p>
                  <Button className="mt-4">Start Chat</Button>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                  <HelpCircle className="h-8 w-8 mb-2" />
                  <h3 className="font-medium">Email Support</h3>
                  <p className="text-sm text-center text-muted-foreground mt-1">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <Button variant="outline" className="mt-4">
                    support@aenzbi.com
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videoTutorials.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-auto rounded-t-md"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3">
                        <Video className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full">
                    Watch Tutorial
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Video Playlists</CardTitle>
              <CardDescription>Organized collections of tutorial videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Getting Started Series</h3>
                      <p className="text-sm text-muted-foreground">5 videos • 45 minutes total</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Playlist
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Advanced Features</h3>
                      <p className="text-sm text-muted-foreground">8 videos • 1 hour 20 minutes total</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Playlist
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Administrator Guide</h3>
                      <p className="text-sm text-muted-foreground">6 videos • 55 minutes total</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Playlist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

