import { type NextRequest, NextResponse } from "next/server"
import { getSaveTheDateLink, initDatabase } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await initDatabase()

    const link = await getSaveTheDateLink(params.id)

    if (!link) {
      return NextResponse.json({ error: "Link not found or expired" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: link })
  } catch (error) {
    console.error("Error fetching Save the Date link:", error)
    return NextResponse.json({ error: "Failed to fetch link" }, { status: 500 })
  }
}
