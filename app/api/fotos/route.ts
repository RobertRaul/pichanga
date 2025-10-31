import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const foto = await prisma.fotoCancha.create({
      data: {
        canchaId: body.canchaId,
        url: body.url,
        principal: body.principal || false
      }
    });
    return NextResponse.json(foto, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear foto' }, { status: 500 });
  }
}
