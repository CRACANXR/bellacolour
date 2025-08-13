import { type NextRequest, NextResponse } from "next/server"
// import { createSaveTheDateLink, initDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    await initDatabase()

    const { partner1Name, partner2Name, weddingDate } = await request.json()

    if (!weddingDate) {
      return NextResponse.json({ error: "Wedding date is required" }, { status: 400 })
    }

    const linkId = await createSaveTheDateLink(partner1Name, partner2Name, weddingDate)

    return NextResponse.json({
      success: true,
      linkId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/save-the-date/${linkId}`,
    })
  } catch (error) {
    console.error("Error creating Save the Date link:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}
