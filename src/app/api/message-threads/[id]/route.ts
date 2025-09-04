import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = await prisma.messageThread.findUnique({ where: { id: params.id } });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data = await prisma.messageThread.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ data });
}

