import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.goalMilestone.create({ data: body });
  return NextResponse.json({ data: created }, { status: 201 });
}

