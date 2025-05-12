import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: params.postId },
      include: { user: true }
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // Don't allow interest in own post
    if (post.user.id === userId) {
      return NextResponse.json(
        { success: false, error: 'Cannot express interest in your own post' },
        { status: 400 }
      );
    }

    // Check if already interested
    const existingInterest = await db.interest.findFirst({
      where: {
        postId: params.postId,
        userId: userId
      }
    });

    if (existingInterest) {
      return NextResponse.json(
        { success: false, error: 'Already expressed interest in this post' },
        { status: 400 }
      );
    }

    // Create new interest
    const interest = await db.interest.create({
      data: {
        postId: params.postId,
        userId: userId,
        message: message || ''
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: interest });
  } catch (error) {
    console.error('Error registering interest:', error);
    return NextResponse.json({ success: false, error: 'Failed to register interest' }, { status: 500 });
  }
}