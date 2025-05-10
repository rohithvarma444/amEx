import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const urgentRequests = await db.post.findMany({
      where: {
        status: "ACTIVE",
        type: "REQUEST",
        urgency: "HIGH"
      },
      select: {
        id: true,
        title: true,
        caption: true,
        description: true,
        price: true,
        priceUnit: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        urgency: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 8  // Changed from limit: 8 to take: 8
    });

    return NextResponse.json({
      success: true,
      requests: urgentRequests
    });
  } catch (error) {
    console.error("Error fetching high priority requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch high priority requests" },
      { status: 500 }
    );
  }
}