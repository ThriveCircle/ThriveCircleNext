import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const threads = await prisma.messageThread.findMany({
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      participants: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const data = threads.map((t) => ({
    id: t.id,
    participants: t.participants.map((p) => p.userId),
    subject: t.subject,
    lastMessage: t.messages[0],
    unreadCount: 0,
    isMuted: t.isMuted,
    isArchived: t.isArchived,
    retentionPolicy: t.retentionPolicy,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  }));

  return NextResponse.json({ data });
}

