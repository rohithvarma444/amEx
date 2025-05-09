import { NextRequest, NextResponse } from 'next/server';
import {db} from '@/lib/db';
export async function GET(request: NextRequest) {
  try {
    const listings = await db.post.findMany({
      where:{
        status: "ACTIVE",
        type: "LISTING"
      },
      select: {
        id: true,
        title: true,
        caption: true,
        description: true,
        price: true,
        priceUnit: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 8
    });


    const requests = await db.post.findMany({
      where:{
        status: "ACTIVE",
        type: "REQUEST"
      },select: {
        id: true,
        title: true,
        caption: true,
        description: true,
        price: true,
        priceUnit: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        urgency: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 8
    });

    const urgentRequests = await db.post.findMany({
      where:{
        status: "ACTIVE",
        type: "REQUEST",
        urgency: "HIGH"
      },select: {
        id: true,
        title: true,
        caption: true,
        description: true,
        price: true,
        priceUnit: true,
        category: true,
        imageUrl: true,
        createdAt: true,
        urgency: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 8
    })


    return NextResponse.json({
      success: true,
      listings: listings,
      requests: requests,
      urgentRequests: urgentRequests
    });
  } catch (error) {
    console.error("Error fetching listings and requests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch listings and requests" },
      { status: 500 }
    );  
  }
}