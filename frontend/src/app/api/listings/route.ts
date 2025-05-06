import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("categoryId");

    const listings = await db.listing.findMany({
      where: categoryId ? { categoryId } : undefined,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        category: true,
      },
    });

    const formattedListings = listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: `₹${listing.price}${listing?.priceUnit ? `/${listing?.priceUnit.toLowerCase()}` : ""}`,
      image: listing.imageUrl || "/img1.png", // Fallback image
      user: {
        id: listing.user.id,
        name: `${listing.user.firstName} ${listing.user.lastName}`,
      },
      createdAt: listing.createdAt.toISOString(),
      href: `/listings/${listing.id}`,
      category: listing.category?.name,
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { 
      title, 
      caption, 
      description, 
      imageUrl, 
      imageUrls, 
      categories, 
      price, 
      priceUnit, 
      locationId,
      latitude,
      longitude
    } = body;
    
    // Validate required fields
    if (!title || !description || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create the listing
    const listing = await db.listing.create({
      data: {
        title,
        description,
        price: price || 0,
        imageUrl: imageUrl || "",
        userId,
        categoryId: categories[0], // Primary category
      },
    });
    
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}