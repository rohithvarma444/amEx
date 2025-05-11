import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json(
                { success: false, message: "Post ID is required" },
                { status: 400 }
            );
        }

        // Check if post exists
        const post = await db.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        // Get all interests for the post with user information
        const interests = await db.interest.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            message: "Interests retrieved successfully",
            data: interests
        });

    } catch (error) {
        console.error("Error fetching interests:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch interests" },
            { status: 500 }
        );
    }
}