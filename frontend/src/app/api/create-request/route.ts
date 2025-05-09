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
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract and validate required fields
    const { title, caption, description, price, priceUnit, category, imageUrls, location, urgency } = body;
    
    if (!title || !caption || !description || !price || !priceUnit || !category || !imageUrls) {
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

    // Validate urgency
    if (urgency && !['LOW', 'MEDIUM', 'HIGH'].includes(urgency)) {
      return NextResponse.json(
        { success: false, error: 'Urgency must be LOW, MEDIUM, or HIGH' },
        { status: 400 }
      );
    }

    // Create the request in the database
    const newRequest = await db.post.create({
      data: {
        type: "REQUEST",
        title,
        caption,
        description,
        price: priceValue,
        priceUnit,
        categoryId: category,
        imageUrl: imageUrls,
        location: location || null,
        urgency: urgency || null,
        userId,
        status: "ACTIVE"
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Request created successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create request' },
      { status: 500 }
    );
  }
}