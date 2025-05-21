// src/app/api/chat/initiate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";      // your db instance
import { auth } from "@clerk/nextjs/server"; // if you’re using next-auth

export async function POST(req: NextRequest) {
  try {
    // ── 1.  Parse body ────────────────────────────────
    const { postId, participantId } = await req.json();

    if (!postId || !participantId) {
      return NextResponse.json({ error: "postId and participantId required" }, { status: 400 });
    }

    // (optional) check auth
    const {userId} = await auth();
    if (!userId || userId !== participantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── 2.  Lookup the post & owner ───────────────────
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const ownerId = post.userId;

    // Prevent owner chatting with self
    if (ownerId === participantId) {
      return NextResponse.json({ error: "Owner cannot chat with self" }, { status: 400 });
    }

    // ── 3.  Find-or-create chat ───────────────────────
    const chat = await db.chat.upsert({
      where: {
        postId_participantId: {
          postId,
          participantId,
        },
      },
      update: {},                    // nothing to update if found
      create: {
        postId,
        ownerId,
        participantId,
      },
      include: { messages: true },
    });

    // ── 4.  Respond ───────────────────────────────────
    return NextResponse.json({
      chatId: chat.id,
      postId: chat.postId,
      ownerId: chat.ownerId,
      messages: chat.messages,       // [] for new chat
    });
  } catch (err) {
    console.error("initiate chat error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   return NextResponse.json({ ok: true });
// }