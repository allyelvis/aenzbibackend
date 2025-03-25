import { type NextRequest, NextResponse } from "next/server"
import { getInventoryReport } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const report = await getInventoryReport()
    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating inventory report:", error)
    return NextResponse.json({ error: "Failed to generate inventory report" }, { status: 500 })
  }
}

