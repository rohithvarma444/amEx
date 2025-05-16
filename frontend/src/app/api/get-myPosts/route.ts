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

        // Get all posts by the user
        const posts = await db.post.findMany({
            where: { 
                userId: userId
            },
            include: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                
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
                        email: true
                    }
                },
                interests: {
                    select: {
                        id: true,
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Separate posts into listings and requests
        const listings = posts.filter(post => post.type === 'LISTING');
        const requests = posts.filter(post => post.type === 'REQUEST');

        return NextResponse.json({
            success: true,
            message: "Posts retrieved successfully",
            data: {
                listings,
                requests
            }
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}