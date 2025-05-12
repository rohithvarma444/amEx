import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await db.post.findUnique({
      where: {
        id: postId,
        userId: userId, // Ensure the user is the owner
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interests: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found or you don't have access" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}