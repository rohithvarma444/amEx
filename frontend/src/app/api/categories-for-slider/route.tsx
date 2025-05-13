import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
const categories = await db.category.findMany();
const formatted = categories.map((c) => ({
id: c.id,
name: c.name,
icon: c.imageUrl ?? '/default.png',
href: `/categories/${c.name}?id=${c.id}`, // fixed template literal
}));
return NextResponse.json(formatted);
}