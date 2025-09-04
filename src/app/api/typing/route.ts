import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { userId, threadId, isTyping } = await req.json();
  const data = await prisma.typingIndicator.upsert({
    where: { userId_threadId: { userId, threadId } },
    update: { isTyping, lastActivity: new Date() },
    create: { userId, threadId, isTyping },
  });
  return NextResponse.json(data);
}

