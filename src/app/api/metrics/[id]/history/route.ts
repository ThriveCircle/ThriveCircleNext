import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { value, notes } = await req.json();
  const history = await prisma.metricHistory.create({ data: { metricId: params.id, value, notes } });
  // Update currentValue on metric
  await prisma.goalMetric.update({ where: { id: params.id }, data: { currentValue: value } });
  return NextResponse.json({ data: history }, { status: 201 });
}

