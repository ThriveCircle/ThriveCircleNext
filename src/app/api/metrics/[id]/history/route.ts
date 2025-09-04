import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const { value, notes } = await req.json();
  const history = await prisma.metricHistory.create({ data: { metricId: id, value, notes } });
  await prisma.goalMetric.update({ where: { id }, data: { currentValue: value } });
  return NextResponse.json({ data: history }, { status: 201 });
}

