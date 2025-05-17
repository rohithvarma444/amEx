import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        const whereClause = postId ? {
            AND: [
                { userId: userId },
                { id: postId }
            ]
        } : { userId: userId };

        const posts = await db.post.findMany({
            where: whereClause,
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
                imageUrl: true,
                status: true,
                createdAt: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        imageUrl: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        upiId: true
                    }
                },
                interests: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                },
                deal: {
                    select: {
                        id: true,
                        status: true,
                        createdAt: true,
                        completedAt: true,
                        selectedUser: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        },
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            message: postId ? "Post retrieved successfully" : "Posts retrieved successfully",
            data: postId ? posts[0] : posts
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}