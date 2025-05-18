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

    const { dealId, otpCode } = await req.json();

    if (!dealId || !otpCode) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const deal = await db.deal.findUnique({
      where: {
        id: dealId,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Update deal with OTP used
    if(deal.otpCode !== otpCode){
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      );
    }
    
    const updatedDeal = await db.deal.update({
      where: { id: dealId },
      data: { otpUsed: true }
    });

    return NextResponse.json({
      success: true,
      data: updatedDeal
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}