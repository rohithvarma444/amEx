import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {db} from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const { userId } =await auth();

    console.log('userId', userId);
    console.log("--------------------------------")

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    const {
      type,
      title,
      caption,
      description,
      imageUrls,
      categoryId,
      price,
      priceUnit,
      location,
      urgency
    } = body;

    // Validate required fields
    if (!type || !title || !categoryId || !price) {
      const missingFields = [];
      if (!type) missingFields.push('type');
      if (!title) missingFields.push('title');
      if (!categoryId) missingFields.push('categoryId');
      if (!price) missingFields.push('price');

      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Get the user from the database
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Create the post
    const post = await db.post.create({
      data: {
        type,
        title,
        caption,
        description,
        imageUrl: imageUrls || [],
        price: parseFloat(price),
        priceUnit,
        location,
        urgency,
        userId: user.id,
        categoryId,
      }
    });

    // Return success response with redirect URL
    return NextResponse.json(
      { 
        success: true, 
        message: 'Post created successfully', 
        post,
        redirectUrl: '/dashboard' // Add redirect URL for the client to use
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create post' },
      { status: 500 }
    );
  }
}