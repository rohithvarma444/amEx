import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

// Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
    const { postId, userId: selectedUserId, interestId } = await req.json();

    if (!postId || !selectedUserId || !interestId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the post exists and belongs to the current user
    const post = await db.post.findUnique({
      where: {
        id: postId,
        userId: userId, // Ensure the post belongs to the current user
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found or you do not have permission' },
        { status: 404 }
      );
    }

    // Verify the interest exists and belongs to the selected user
    const interest = await db.interest.findFirst({
      where: {
        id: interestId,
        userId: selectedUserId,
        postId: postId,
      },
    });

    if (!interest) {
      return NextResponse.json(
        { success: false, message: 'Interest not found' },
        { status: 404 }
      );
    }

    // Check if a deal already exists for this post
    const existingDeal = await db.deal.findFirst({
      where: {
        postId: postId,
      },
    });

    if (existingDeal) {
      return NextResponse.json(
        { success: false, message: 'A deal already exists for this post' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otpCode = generateOTP();
    
    // Create the deal with OTP
    const deal = await db.deal.create({
      data: {
        postId: postId,
        selectedUserId: selectedUserId,
        status: 'PENDING',
        otpCode: otpCode,
        otpUsed: false,
        paymentStatus: 'PENDING'
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Deal created successfully', 
        data: deal 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create deal' },
      { status: 500 }
    );
  }
}