import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { dealId } = await req.json();

    if (!dealId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the deal
    const deal = await db.deal.findUnique({
      where: {
        id: dealId,
      },
      include: {
        post: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { success: false, message: 'Deal not found' },
        { status: 404 }
      );
    }

    // Verify the user is the post owner
    if (deal.post.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Only the post owner can cancel this deal' },
        { status: 403 }
      );
    }

    // Delete the deal
    await db.deal.delete({
      where: {
        id: dealId,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Deal cancelled successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling deal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel deal' },
      { status: 500 }
    );
  }
}