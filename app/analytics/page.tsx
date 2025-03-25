"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataChart } from "@/components/charts/chart-container"
import { DataTable } from "@/components/ui/data-table"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [period, setPeriod] = useState("month")
  const [salesData, setSalesData] = useState<any[]>([])
  const [productData, setProductData] = useState<any[]>([])
  const [customerData, setCustomerData] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState({
    sales: true,
    products: true,
    customers: true,
    topProducts: true,
    topCustomers: true,
  })

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading((prev) => ({ ...prev, sales: true }))

      try {
        const { data } = await apiClient.get(`/api/analytics/sales?period=${period}`)
        setSalesData(data || [])
      } catch (error) {
        console.error("Error fetching sales data:", error)
        toast({
          title: "Error",
          description: "Failed to load sales data",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, sales: false }))
      }
    }

    fetchSalesData()
  }, [period, toast])

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading((prev) => ({ ...prev, products: true }))

      try {
        const { data } = await apiClient.get(`/api/analytics/products?period=${period}`)
        setProductData(data || [])
      } catch (error) {
        console.error("Error fetching product data:", error)
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, products: false }))
      }
    }

    fetchProductData()
  }, [period, toast])

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading((prev) => ({ ...prev, customers: true }))

      try {
        const { data } = await apiClient.get(`/api/analytics/customers?period=${period}`)
        setCustomerData(data || [])
      } catch (error) {
        console.error("Error fetching customer data:", error)
        toast({
          title: "Error",
          description: "Failed to load customer data",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, customers: false }))
      }
    }

    fetchCustomerData()
  }, [period, toast])

  // Fetch top products
  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading((prev) => ({ ...prev, topProducts: true }))

      try {
        const { products } = await apiClient.get(`/api/analytics/top-products?period=${period}`)
        setTopProducts(products || [])
      } catch (error) {
        console.error("Error fetching top products:", error)
        toast({
          title: "Error",
          description: "Failed to load top products",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, topProducts: false }))
      }
    }

    fetchTopProducts()
  }, [period, toast])

  // Fetch top customers
  useEffect(() => {
    const fetchTopCustomers = async () => {
      setLoading((prev) => ({ ...prev, topCustomers: true }))

      try {
        const { customers } = await apiClient.get(`/api/analytics/top-customers?period=${period}`)
        setTopCustomers(customers || [])
      } catch (error) {
        console.error("Error fetching top customers:", error)
        toast({
          title: "Error",
          description: "Failed to load top customers",
          variant: "destructive",
        })
      } finally {
        setLoading((prev) => ({ ...prev, topCustomers: false }))
      }
    }

    fetchTopCustomers()
  }, [period, toast])

  // Top products columns
  const productColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Product",
    },
    {
      accessorKey: "quantity",
      header: "Units Sold",
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => formatCurrency(row.getValue("revenue")),
    },
    {
      accessorKey: "profit",
      header: "Profit",
      cell: ({ row }) => formatCurrency(row.getValue("profit")),
    },
  ]

  // Top customers columns
  const customerColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Customer",
    },
    {
      accessorKey: "orders",
      header: "Orders",
    },
    {
      accessorKey: "revenue",
      header: "Total Spent",
      cell: ({ row }) => formatCurrency(row.getValue("revenue")),
    },
    {
      accessorKey: "lastOrder",
      header: "Last Order",
      cell: ({ row }) => new Date(row.getValue("lastOrder")).toLocaleDateString(),
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed business performance metrics and trends</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DataChart
              title="Sales Performance"
              description="Revenue and order count over time"
              data={salesData}
              series={[
                { name: "Revenue", key: "revenue", color: "#10b981" },
                { name: "Orders", key: "orders", color: "#3b82f6" },
              ]}
              type="line"
              timeRanges={["week", "month", "quarter", "year"]}
              defaultTimeRange={period}
              loading={loading.sales}
              height={300}
              allowTypeChange={true}
              onTimeRangeChange={(range) => setPeriod(range)}
            />
            <DataChart
              title="Top Product Categories"
              description="Revenue by product category"
              data={productData}
              series={[{ name: "Revenue", key: "value" }]}
              type="pie"
              timeRanges={["week", "month", "quarter", "year"]}
              defaultTimeRange={period}
              loading={loading.products}
              height={300}
              onTimeRangeChange={(range) => setPeriod(range)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={productColumns} data={topProducts} loading={loading.topProducts} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={customerColumns} data={topCustomers} loading={loading.topCustomers} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 mt-4">
          <DataChart
            title="Product Performance"
            description="Revenue by product over time"
            data={productData}
            series={[{ name: "Revenue", key: "value" }]}
            type="bar"
            timeRanges={["week", "month", "quarter", "year"]}
            defaultTimeRange={period}
            loading={loading.products}
            height={400}
            allowTypeChange={true}
            onTimeRangeChange={(range) => setPeriod(range)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={productColumns}
                data={topProducts}
                loading={loading.topProducts}
                searchColumn="name"
                searchPlaceholder="Search products..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4 mt-4">
          <DataChart
            title="Customer Acquisition"
            description="New customers over time"
            data={customerData}
            series={[
              { name: "New Customers", key: "new", color: "#10b981" },
              { name: "Returning", key: "returning", color: "#3b82f6" },
            ]}
            type="line"
            timeRanges={["week", "month", "quarter", "year"]}
            defaultTimeRange={period}
            loading={loading.customers}
            height={400}
            allowTypeChange={true}
            onTimeRangeChange={(range) => setPeriod(range)}
          />

          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={customerColumns}
                data={topCustomers}
                loading={loading.topCustomers}
                searchColumn="name"
                searchPlaceholder="Search customers..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

