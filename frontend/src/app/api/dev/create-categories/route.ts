import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { name, description, imageUrl } = await req.json();

    // Check if category exists
    const exists = await db.category.findUnique({
      where: { name }
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    // Create category
    const category = await db.category.create({
      data: { name, description, imageUrl }
    });

    console.log("done");
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}