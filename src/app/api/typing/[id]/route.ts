import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await prisma.typingIndicator.findMany({ where: { threadId: id } });
  return NextResponse.json(data);
}

