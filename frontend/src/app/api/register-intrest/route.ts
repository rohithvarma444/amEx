import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const {postId, message} = await req.json();
        const { userId } = await auth(); 

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

        if(post.userId === userId){
            return NextResponse.json(
                { success: false, message: "You cannot register interest for your own post" },
                { status: 400 }
            );
        }

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
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering interest:", error);
        return NextResponse.json(
            { success: false, message: "Failed to register interest" },
            { status: 500 }
        );
    }
}