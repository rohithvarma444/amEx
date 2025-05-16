import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function POST(request: Request) {
  try {
    const { name,description,imageUrl } = await request.json();

    if (!name || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await db.category.create({
      data: {
        name,
        description,
        imageUrl,
      },
    })
    return NextResponse.json(
      { success: true, message: "Category created successfully", category },
      { status: 200 }
    )
  }catch(error){
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}