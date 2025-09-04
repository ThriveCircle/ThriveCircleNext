import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  const q = searchParams.get('q') || undefined;
  const status = searchParams.get('status') || undefined;
  const coachId = searchParams.get('coachId') || undefined;

  const where: any = {};
  if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }];
  if (status) where.status = status as any;
  if (coachId) where.coachId = coachId;

  const [data, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;
  return NextResponse.json({ data, pagination: { page, pageSize, total, totalPages } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await prisma.client.create({ data: body });
  return NextResponse.json({ data: created }, { status: 201 });
}

