import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoryId = searchParams.get("categoryId");

    const requests = await db.request.findMany({
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

    const formattedRequests = requests.map((request) => ({
      id: request.id,
      title: request.title,
      description: request.details,
      price: request.price ? `₹${request.price}${request.priceUnit ? `/${request.priceUnit.toLowerCase()}` : ""}` : "Negotiable",
      image: request.imageUrl || "/img1.png",
      user: {
        id: request.user.id,
        name: `${request.user.firstName} ${request.user.lastName}`,
      },
      urgency: request.urgency,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
      href: `/requests/${request.id}`,
      category: request.category?.name,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
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
      details, // Changed from description to details
      imageUrl, 
      imageUrls, 
      categories, 
      price, 
      priceUnit, 
      locationId,
      urgency = "MEDIUM",
      latitude,
      longitude
    } = body;
    
    // Validate required fields
    if (!title || !details || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create the request
    const newRequest = await db.request.create({
      data: {
        title,
        details, // Use details instead of description
        urgency: urgency as any, // Cast to Prisma enum
        status: "open",
        latitude: latitude || null,
        longitude: longitude || null,
        userId,
        categoryId: categories[0], // Primary category
        imageUrl: imageUrl || "",
      },
    });
    
    return NextResponse.json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}