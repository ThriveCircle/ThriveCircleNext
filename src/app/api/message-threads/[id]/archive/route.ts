import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { archived } = await req.json();
  const data = await prisma.messageThread.update({ where: { id }, data: { isArchived: Boolean(archived) } });
  return NextResponse.json({ data });
}

