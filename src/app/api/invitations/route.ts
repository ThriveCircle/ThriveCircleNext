import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { coachId, email, name } = await req.json();
  const token = crypto.randomBytes(16).toString('hex');
  const data = await prisma.invitation.create({ data: { coachId, email, name, token } });
  return NextResponse.json({ data }, { status: 201 });
}

