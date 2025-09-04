import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { name, type, size, mimeType } = await req.json();
  const data = await prisma.attachment.create({
    data: {
      name,
      type,
      url: `/uploads/${name}`,
      size,
      mimeType,
      isVirusScanned: true,
      virusScanStatus: 'clean',
    }
  });
  return NextResponse.json(data, { status: 201 });
}

