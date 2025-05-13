import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const listings = await db.post.findMany({
      where: {
        type: "LISTING",
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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        imageUrl: true,

        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        status: true,
      }
    });

    console.log("Fetched listings:", listings);


    return NextResponse.json({
      success: true,
      listings
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}