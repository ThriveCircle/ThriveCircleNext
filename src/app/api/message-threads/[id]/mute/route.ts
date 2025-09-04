import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { muted } = await req.json();
  const data = await prisma.messageThread.update({ where: { id: params.id }, data: { isMuted: Boolean(muted) } });
  return NextResponse.json({ data });
}

