// src/app/api/chat/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "ap2", // e.g. "ap2"
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    const { chatId, content } = await req.json();

    if (!chatId || !content) {
      return NextResponse.json({ error: "chatId and content required" }, { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is in the chat
    const chat = await db.chat.findUnique({
      where: { id: chatId },
      select: { ownerId: true, participantId: true },
    });

    if (!chat || (chat.ownerId !== userId && chat.participantId !== userId)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Save message
    const message = await db.message.create({
      data: {
        chatId,
        senderId: userId,
        content,
      },
    });

    // Trigger Pusher
    await pusher.trigger(`chat-${chatId}`, "new-message", message);

    return NextResponse.json(message);
  } catch (err) {
    console.error("send message error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}