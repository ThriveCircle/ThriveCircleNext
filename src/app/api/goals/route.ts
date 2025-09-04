import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const goals = await prisma.goal.findMany({
    include: { milestones: true, metrics: { include: { history: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ data: goals });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.goal.create({ data: body });
  return NextResponse.json({ data: created }, { status: 201 });
}

