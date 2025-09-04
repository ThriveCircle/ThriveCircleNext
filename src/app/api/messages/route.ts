import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get('threadId')!;
  const data = await prisma.message.findMany({ where: { threadId }, orderBy: { createdAt: 'asc' }, include: { attachments: true } });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { attachments = [], ...rest } = body;
  const data = await prisma.message.create({
    data: {
      ...rest,
      attachments: attachments.length ? { connect: attachments.map((id: string) => ({ id })) } : undefined,
    },
    include: { attachments: true },
  });
  await prisma.messageThread.update({ where: { id: data.threadId }, data: { updatedAt: new Date() } });
  return NextResponse.json({ data }, { status: 201 });
}

