import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatString = "PPP"): string {
  if (!date) return "N/A"

  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    return format(dateObj, formatString)
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}

export function formatCurrency(amount: number | string, currency = "USD"): string {
  if (amount === null || amount === undefined) return "N/A"

  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numAmount)) return "Invalid amount"

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(numAmount)
}

export function generateOrderNumber(prefix = "ORD-"): string {
  const timestamp = new Date().getTime().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}${timestamp}${random}`
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function getInitials(name: string): string {
  if (!name) return ""

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

export function getRandomColor(): string {
  const colors = [
    "#10B981", // green
    "#3B82F6", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#F59E0B", // amber
    "#EF4444", // red
    "#06B6D4", // cyan
    "#F97316", // orange
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}

export function calculatePagination(totalItems: number, currentPage = 1, pageSize = 10) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(startItem + pageSize - 1, totalItems)

  return {
    totalPages,
    startItem,
    endItem,
    currentPage,
    pageSize,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  }
}

