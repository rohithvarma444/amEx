import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { postId } = body;

        if (!postId) {
            return NextResponse.json(
                { success: false, message: "Post ID is required" },
                { status: 400 }
            );
        }

        // Check if post exists and belongs to the requesting user
        const post = await db.post.findUnique({
            where: { 
                id: postId
            }
        });

        if (!post) {
            return NextResponse.json(
                { success: false, message: "Post not found" },
                { status: 404 }
            );
        }

        if (userId !== post.userId) {
            return NextResponse.json(
                { success: false, message: "You don't have permission to view this post's interests" },
                { status: 403 }
            );
        }

        // Get all interests from other users for the post
        const interests = await db.interest.findMany({
            where: { 
                postId,
                NOT: {
                    userId: userId
                }
            },
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