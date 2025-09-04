import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();
  const updated = await prisma.goal.update({ where: { id }, data: body });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.goal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

