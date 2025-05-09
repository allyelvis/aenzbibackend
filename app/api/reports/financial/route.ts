import { type NextRequest, NextResponse } from "next/server"
import { getFinancialReport } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const startDateParam = url.searchParams.get("startDate")
    const endDateParam = url.searchParams.get("endDate")

    if (!startDateParam || !endDateParam) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    const startDate = new Date(startDateParam)
    const endDate = new Date(endDateParam)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
    }

    const report = await getFinancialReport(startDate, endDate)
    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating financial report:", error)
    return NextResponse.json({ error: "Failed to generate financial report" }, { status: 500 })
  }
}

