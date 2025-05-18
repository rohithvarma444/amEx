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

    const { dealId } = await req.json();

    if (!dealId) {
      return NextResponse.json(
        { success: false, message: 'Missing deal ID' },
        { status: 400 }
      );
    }

    const deal = await db.deal.findUnique({
      where: {
        id: dealId,
        selectedUserId: userId
      }
    });

    if (!deal) {
      return NextResponse.json(
        { success: false, message: 'Deal not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedDeal = await db.deal.update({
      where: { id: dealId },
      data: {
        paymentStatus: 'RECEIVED',
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedDeal
    });
  } catch (error) {
    console.error('Error completing payment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to complete payment' },
      { status: 500 }
    );
  }
}