import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.coach.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } });
  return NextResponse.json({ data });
}

