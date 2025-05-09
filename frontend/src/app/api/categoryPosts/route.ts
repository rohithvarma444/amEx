import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await request.json();
    const { categoryId } = body;
    
    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const posts = await db.post.findMany({
      where: {
        categoryId: categoryId
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
        imageUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      posts: posts
    });
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category posts" },
      { status: 500 }
    );
  }
}