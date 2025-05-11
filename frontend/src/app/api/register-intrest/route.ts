import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, message, postId } = body;

        if (!userId || !message || !postId) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
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

        // Create interest record
        const interest = await db.interest.create({
            data: {
                userId,
                postId,
                description: message
            }
        });

        return NextResponse.json({
            success: true,
            message: "Interest registered successfully",
            data: interest
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering interest:", error);
        return NextResponse.json(
            { success: false, message: "Failed to register interest" },
            { status: 500 }
        );
    }
}