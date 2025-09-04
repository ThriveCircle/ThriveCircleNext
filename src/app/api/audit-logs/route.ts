import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const data = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  return NextResponse.json({ data });
}

