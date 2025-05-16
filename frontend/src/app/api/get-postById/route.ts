import { NextRequest, NextResponse } from "next/server";
import {db} from "@/lib/db";
import {auth} from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = auth();
        const postId = req.nextUrl.searchParams.get('postId');

        if(!postId) return NextResponse.json({
            success: false,
            message: "required fields"
        }, { status: 400 });

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            select: {
                id: true,
                type: true,
                title: true,
                caption: true,
                description: true,
                price: true,
                priceUnit: true,
                location: true,
                urgency: true,
                createdAt: true,
                imageUrl: true,
                status: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true
                    }
                },
                _count: {
                    select: {
                        interests: true
                    }
                },
                interests: userId ? {
                    where: {
                        userId: userId
                    },
                    select: {
                        id: true
                    }
                } : false
            }
        });

        if (!post) {
            return NextResponse.json({
                success: false,
                message: "Post not found"
            }, { status: 404 });
        }

        // Add hasUserInterested flag
        const hasUserInterested = post.interests && post.interests.length > 0;
        delete post.interests; // Remove the raw interests data

        return NextResponse.json({
            success: true,
            data: {
                ...post,
                hasUserInterested
            }
        });

    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch post",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}