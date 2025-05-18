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
    const { dealId, paymentMethod, upiId = null } = await req.json();

    if (!dealId || !paymentMethod) {
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

    // Verify the user is either the post owner or the selected user
    if (deal.post.userId !== userId && deal.selectedUserId !== userId) {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to process payment for this deal' },
        { status: 403 }
      );
    }

    // Verify OTP has been used
    if (!deal.otpUsed) {
      return NextResponse.json(
        { success: false, message: 'OTP verification is required before processing payment' },
        { status: 400 }
      );
    }

    // Update payment details
    const updatedDeal = await db.deal.update({
      where: {
        id: dealId,
      },
      data: {
        buyerUpiId: upiId,
        amountPaid: deal.post.price,
        paymentStatus: 'RECEIVED',
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Mark the post as fulfilled
    await db.post.update({
      where: {
        id: deal.postId,
      },
      data: {
        status: 'FULLFILLED',
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Payment processed successfully', 
        data: updatedDeal 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process payment' },
      { status: 500 }
    );
  }
}