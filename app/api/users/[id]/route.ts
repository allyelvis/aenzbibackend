import type { NextRequest } from "next/server"
import { z } from "zod"
import { successResponse, errorResponse, ErrorCodes, HttpStatus } from "@/lib/api-utils"
import { getCurrentUser } from "@/lib/auth-service"

// Input validation schema for updating a user
const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100).optional(),
  role: z.enum(["admin", "manager", "user"]).optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  phone_number: z.string().optional(),
  is_active: z.boolean().optional(),
})

/**
 * GET /api/users/[id]
 *
 * Get a specific user by ID
 *
 * Path parameters:
 * - id: User ID
 *
 * Returns:
 * - User object
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check authentication
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return errorResponse("Authentication required", ErrorCodes.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    // Check authorization (users can only view their own profile, admins and managers can view any)
    if (currentUser.role !== "admin" && currentUser.role !== "manager" && currentUser.id !== id) {
      return errorResponse(
        "You do not have permission to access this resource",
        ErrorCodes.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      )
    }

    // In a real app, this would fetch from a database
    // For this example, we'll return mock data
    const mockUser = {
      id,
      username: `user${id}`,
      email: `user${id}@example.com`,
      full_name: `User ${id}`,
      role: ["admin", "manager", "user"][Number.parseInt(id) % 3] as "admin" | "manager" | "user",
      department: ["IT", "HR", "Finance", "Marketing", "Sales"][Number.parseInt(id) % 5],
      position: ["Developer", "Manager", "Analyst", "Specialist", "Director"][Number.parseInt(id) % 5],
      is_active: true,
      created_at: new Date(Date.now() - Number.parseInt(id) * 86400000).toISOString(),
      updated_at: new Date(Date.now() - Number.parseInt(id) * 43200000).toISOString(),
    }

    // Return response
    return successResponse(mockUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    return errorResponse("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * PATCH /api/users/[id]
 *
 * Update a specific user by ID
 *
 * Path parameters:
 * - id: User ID
 *
 * Request body:
 * - Partial user data to update
 *
 * Returns:
 * - Updated user object
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check authentication
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return errorResponse("Authentication required", ErrorCodes.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    // Check authorization (users can only update their own profile, admins can update any)
    if (currentUser.role !== "admin" && currentUser.id !== id) {
      return errorResponse("You do not have permission to update this user", ErrorCodes.FORBIDDEN, HttpStatus.FORBIDDEN)
    }

    // Parse and validate request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      return errorResponse("Invalid JSON in request body", ErrorCodes.BAD_REQUEST, HttpStatus.BAD_REQUEST)
    }

    const validationResult = updateUserSchema.safeParse(body)

    if (!validationResult.success) {
      return errorResponse(
        "Invalid user data",
        ErrorCodes.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        validationResult.error.format(),
      )
    }

    const updateData = validationResult.data

    // Additional authorization check: only admins can change roles
    if (updateData.role && currentUser.role !== "admin") {
      return errorResponse(
        "You do not have permission to change user roles",
        ErrorCodes.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      )
    }

    // In a real app, this would update a user in the database
    // For this example, we'll return mock data
    const mockUser = {
      id,
      username: updateData.username || `user${id}`,
      email: updateData.email || `user${id}@example.com`,
      full_name: updateData.full_name || `User ${id}`,
      role: updateData.role || (["admin", "manager", "user"][Number.parseInt(id) % 3] as "admin" | "manager" | "user"),
      department: updateData.department || ["IT", "HR", "Finance", "Marketing", "Sales"][Number.parseInt(id) % 5],
      position:
        updateData.position || ["Developer", "Manager", "Analyst", "Specialist", "Director"][Number.parseInt(id) % 5],
      is_active: updateData.is_active !== undefined ? updateData.is_active : true,
      created_at: new Date(Date.now() - Number.parseInt(id) * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Return response
    return successResponse(mockUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return errorResponse("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * DELETE /api/users/[id]
 *
 * Delete a specific user by ID
 *
 * Path parameters:
 * - id: User ID
 *
 * Returns:
 * - Success message
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Check authentication
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return errorResponse("Authentication required", ErrorCodes.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    // Check authorization (only admins can delete users)
    if (currentUser.role !== "admin") {
      return errorResponse("You do not have permission to delete users", ErrorCodes.FORBIDDEN, HttpStatus.FORBIDDEN)
    }

    // In a real app, this would delete a user from the database
    // For this example, we'll just return a success message

    // Return response
    return successResponse({
      message: `User with ID ${id} has been deleted successfully`,
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return errorResponse("An unexpected error occurred", ErrorCodes.INTERNAL_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

