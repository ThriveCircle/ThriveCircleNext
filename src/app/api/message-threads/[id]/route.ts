import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await prisma.messageThread.findUnique({ where: { id } });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const data = await prisma.messageThread.update({ where: { id }, data: body });
  return NextResponse.json({ data });
}

