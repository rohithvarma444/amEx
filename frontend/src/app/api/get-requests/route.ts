import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const requests = await db.post.findMany({
      where: {
        type: "REQUEST",
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        title: true,
        caption: true,
        description: true,
        price: true,
        priceUnit: true,
        category: true,
        createdAt: true,
        user: {
            select: {
                id: true,
                firstName: true,
                lastName: true,
            }
        },
        urgency: true,
        status: true,
      }
    });

    return NextResponse.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}