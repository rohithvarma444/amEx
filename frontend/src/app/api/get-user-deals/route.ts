import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get deals on posts owned by the user
    const myDeals = await db.deal.findMany({
      where: {
        post: {
          userId: userId,
        },
        status: {
          in: ['ACTIVE', 'PENDING', 'COMPLETED']
        }
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        completedAt: true,
        otpCode: true,      
        otpExpiresAt: true, 
        otpUsed: true,      
        post: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            priceUnit: true,
            imageUrl: true,
            type: true,
            category: {
              select: {
                name: true,
              },
            },
            userId: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                upiId: true,
              },
            },
          },
        },
        selectedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get deals where the user is selected
    const selectedForDeals = await db.deal.findMany({
      where: {
        selectedUserId: userId,
        status: {
          in: ['ACTIVE', 'PENDING', 'COMPLETED']
        }
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        completedAt: true,
        otpUsed: true,
        paymentStatus: true,
        // Do not include OTP fields for selectedUser
        post: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            priceUnit: true,
            imageUrl: true,
            type: true,
            category: {
              select: {
                name: true,
              },
            },
            userId: true,
          },
        },
        selectedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            upiId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        myDeals,
        selectedForDeals,
      },
    });
  } catch (error) {
    console.error('Error fetching user deals:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}