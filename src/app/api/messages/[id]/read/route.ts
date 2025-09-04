import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { userId } = await req.json();
  const data = await prisma.messageRead.upsert({
    where: { messageId_userId: { messageId: id, userId } },
    update: { readAt: new Date() },
    create: { messageId: id, userId },
  });
  return NextResponse.json({ data });
}

