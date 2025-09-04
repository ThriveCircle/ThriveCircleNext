import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const [activeClients, upcomingSessions, totalRevenue] = await Promise.all([
    prisma.client.count({ where: { status: 'active' } }),
    prisma.session.count({ where: { date: { gt: new Date() } } }),
    prisma.invoice.aggregate({ _sum: { amount: true } }),
  ]);

  return NextResponse.json({
    activeClients,
    completionRate: 68,
    upcomingSessions,
    revenueMTD: totalRevenue._sum.amount || 0,
  });
}

