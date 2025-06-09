import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Get all chats where user is either owner or participant
    const chats = await db.chat.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { participantId: userId }
        ]
      },
      include: {
        post: true,
        owner: true,
        participant: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      chats
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chats" }, 
      { status: 500 }
    );
  }
} 