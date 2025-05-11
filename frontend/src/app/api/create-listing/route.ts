import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { userId } = await auth();
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(userId);

    // Extract and validate required fields
    const { title, caption, description, price, priceUnit, category, imageUrls, location } = body;
    
    if (!title || !price || !priceUnit || !category || !imageUrls) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceValue = parseFloat(price);
    if (isNaN(priceValue)) {
      return NextResponse.json(
        { success: false, error: 'Price must be a valid number' },
        { status: 400 }
      );
    }

    // Create the listing in the database
    const newListing = await db.post.create({
      data: {
        type: "LISTING",
        title,
        caption,
        description,
        price: priceValue,
        priceUnit,
        categoryId: category,
        imageUrl: imageUrls,
        location: location || null,
        userId,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Listing created successfully',
      listing: newListing
    });
  } catch (error: any) {
    //console.error('Error creating listing:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error'  },
      { status: 500 }
    );
  }
}