import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { archived } = await req.json();
  const data = await prisma.messageThread.update({ where: { id: params.id }, data: { isArchived: Boolean(archived) } });
  return NextResponse.json({ data });
}

