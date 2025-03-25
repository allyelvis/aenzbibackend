"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Download, Filter, RefreshCw, Search } from "lucide-react"

export type Column<T> = {
  id: string
  header: string
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (row: T) => React.ReactNode
  enableSorting?: boolean
  enableFiltering?: boolean
  meta?: Record<string, any>
}

export type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  title?: string
  description?: string
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
  }
  sorting?: {
    sortBy: string
    sortOrder: "asc" | "desc"
    onSortChange: (column: string, order: "asc" | "desc") => void
  }
  filtering?: {
    filters: Record<string, any>
    onFilterChange: (filters: Record<string, any>) => void
  }
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (term: string) => void
  loading?: boolean
  onRefresh?: () => void
  onExport?: () => void
  rowClassName?: (row: T) => string
  emptyState?: React.ReactNode
}

export function DataTable<T>({
  data,
  columns,
  title,
  description,
  pagination,
  sorting,
  filtering,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  loading = false,
  onRefresh,
  onExport,
  rowClassName,
  emptyState,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  // Handle search
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!sorting || !column.enableSorting) return

    const newOrder = sorting.sortBy === column.id && sorting.sortOrder === "asc" ? "desc" : "asc"

    sorting.onSortChange(column.id, newOrder)
  }

  // Get sort icon
  const getSortIcon = (column: Column<T>) => {
    if (!sorting || !column.enableSorting) return null

    if (sorting.sortBy === column.id) {
      return sorting.sortOrder === "asc" ? (
        <ChevronUp className="h-4 w-4 ml-1" />
      ) : (
        <ChevronDown className="h-4 w-4 ml-1" />
      )
    }

    return null
  }

  // Render cell content
  const renderCell = (row: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(row)
    }

    if (column.accessorFn) {
      return column.accessorFn(row)
    }

    if (column.accessorKey) {
      return row[column.accessorKey] as React.ReactNode
    }

    return null
  }

  return (
    <Card>
      {(title || description || searchable || onRefresh || onExport) && (
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {(title || description) && (
              <div>
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {searchable && (
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 h-10 w-full md:w-[200px]"
                  />
                </div>
              )}
              {filtering && (
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              )}
              {onRefresh && (
                <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              )}
              {onExport && (
                <Button variant="outline" size="icon" onClick={onExport}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className={column.enableSorting ? "cursor-pointer select-none" : ""}
                    onClick={() => column.enableSorting && handleSort(column)}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {getSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: pagination?.pageSize || 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((column) => (
                      <TableCell key={`skeleton-${index}-${column.id}`}>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyState || (
                      <div className="flex flex-col items-center justify-center py-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`} className={rowClassName ? rowClassName(row) : ""}>
                    {columns.map((column) => (
                      <TableCell key={`cell-${rowIndex}-${column.id}`}>{renderCell(row, column)}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {pagination && (
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
            Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.length)} of {data.length} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                  disabled={pagination.pageIndex === 0}
                />
              </PaginationItem>

              {Array.from({ length: pagination.pageCount }, (_, i) => i)
                .filter(
                  (page) =>
                    page === 0 ||
                    page === pagination.pageIndex - 1 ||
                    page === pagination.pageIndex ||
                    page === pagination.pageIndex + 1 ||
                    page === pagination.pageCount - 1,
                )
                .slice(0, 5)
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => pagination.onPageChange(page)}
                      isActive={pagination.pageIndex === page}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                  disabled={pagination.pageIndex === pagination.pageCount - 1}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  )
}

