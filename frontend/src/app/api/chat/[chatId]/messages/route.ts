import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;

    if (!chatId) {
      return NextResponse.json({ error: "chatId required" }, { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is part of the chat
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      select: {
        participantId: true,
        ownerId: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat || (chat.participantId !== userId && chat.ownerId !== userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(chat.messages);
  } catch (err) {
    console.error("fetch messages error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}