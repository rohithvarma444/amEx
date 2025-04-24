

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, firstName, lastName, imageUrl } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing user ID or email" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if (!existingUser) {
      await db.user.create({
        data: {
          id: userId,
          email,
          firstName,
          lastName,
          imageUrl,
        },
      });
      console.log("✅ User created in DB");
    } else {
      console.log("ℹ️ User already exists in DB");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error in sync-user route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}