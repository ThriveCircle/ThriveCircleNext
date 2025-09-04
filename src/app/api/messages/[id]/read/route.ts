import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await req.json();
  const data = await prisma.messageRead.upsert({
    where: { messageId_userId: { messageId: params.id, userId } },
    update: { readAt: new Date() },
    create: { messageId: params.id, userId },
  });
  return NextResponse.json({ data });
}

