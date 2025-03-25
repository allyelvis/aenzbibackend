import type { NextRequest } from "next/server"
import { z } from "zod"
import { successResponse, errorResponse, ErrorCodes, HttpStatus } from "@/lib/api-utils"
import { getCurrentUser } from "@/lib/auth-service"

// Input validation schema for creating a user
const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100),
  role: z.enum(["admin", "manager", "user"]).default("user"),
  department: z.string().optional(),
  position: z.string().optional(),
  phone_number: z.string().optional(),
})

// Input validation schema for updating a user
const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid("Invalid user ID"),
})

// Query parameters schema
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  role: z.enum(["admin", "manager", "user"]).optional(),
  search: z.string().optional(),
  sort: z.enum(["created_at", "updated_at", "username", "email"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

/**
 * GET /api/users
 *
 * Get a list of users with pagination, filtering, and sorting
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 10, max: 100)
 * - role: Filter by role (optional)
 * - search: Search term for username, email, or full name (optional)
 * - sort: Sort field (default: created_at)
 * - order: Sort order (default: desc)
 *
 * Returns:
 * - Array of user objects
 * - Pagination metadata
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return errorResponse("Authentication required", ErrorCodes.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    // Check authorization (only admins and managers can list users)
    if (currentUser.role !== "admin" && currentUser.role !== "manager") {
      return errorResponse(
        "You do not have permission to access this resource",
        ErrorCodes.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      )
    }

    // Parse and validate query parameters
    const url = new URL(request.url)
    const queryParams: Record<string, string> = {}

    url.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    const queryResult = querySchema.safeParse(queryParams)

    if (!queryResult.success) {
      return errorResponse(
        "Invalid query parameters",
        ErrorCodes.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        queryResult.error.format(),
      )
    }

    const { page, limit, role, search, sort, order } = queryResult.data

    // In a real app, this would fetch from a database
    // For this example, we'll return mock data
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({
      id: `user-${i + 1}`,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      full_name: `User ${i + 1}`,
      role: ["admin", "manager", "user"][i % 3] as "admin" | "manager" | "user",
      department: ["IT", "HR", "Finance", "Marketing", "Sales"][i % 5],
      position: ["Developer", "Manager", "Analyst", "Specialist", "Director"][i % 5],
      created_at: new Date(Date.now() - i * 86400000).toISOString(), // Each user created 1 day apart
      updated_at: new Date(Date.now() - i * 43200000).toISOString(), // Each user updated 12 hours apart
    }))

    // Apply filters
    let filteredUsers = [...mockUsers]

    if (role) {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    if (search) {
      const searchTerm = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.full_name.toLowerCase().includes(searchTerm),
      )
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      const aValue = a[sort as keyof typeof a]
      const bValue = b[sort as keyof typeof b]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    // Apply pagination
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedUsers = filteredUsers.slice(offset, offset + limit)

    // Return response
    return successResponse(paginatedUsers, {
      page,
      limit,
      total,
      totalPages,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return errorResponse("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * POST /api/users
 *
 * Create a new user
 *
 * Request body:
 * - email: User's email address
 * - username: User's username
 * - full_name: User's full name
 * - role: User's role (admin, manager, or user)
 * - department: User's department (optional)
 * - position: User's position (optional)
 * - phone_number: User's phone number (optional)
 *
 * Returns:
 * - Created user object
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return errorResponse("Authentication required", ErrorCodes.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    // Check authorization (only admins can create users)
    if (currentUser.role !== "admin") {
      return errorResponse("You do not have permission to create users", ErrorCodes.FORBIDDEN, HttpStatus.FORBIDDEN)
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON in request body", ErrorCodes.BAD_REQUEST, HttpStatus.BAD_REQUEST)
    }

    const validationResult = createUserSchema.safeParse(body)

    if (!validationResult.success) {
      return errorResponse(
        "Invalid user data",
        ErrorCodes.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        validationResult.error.format(),
      )
    }

    const userData = validationResult.data

    // In a real app, this would create a user in the database
    // For this example, we'll return mock data
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Return response
    return successResponse(newUser, undefined)
  } catch (error) {
    console.error("Error creating user:", error)
    return errorResponse("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

