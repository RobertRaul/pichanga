import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ciudadId = searchParams.get('ciudadId');

    const distritos = await prisma.distrito.findMany({
      where: ciudadId ? { ciudadId } : undefined,
      include: {
        ciudad: true,
        _count: {
          select: { canchas: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(distritos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener distritos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const distrito = await prisma.distrito.create({
      data: {
        nombre: body.nombre,
        ciudadId: body.ciudadId
      },
      include: { ciudad: true }
    });
    return NextResponse.json(distrito, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear distrito' }, { status: 500 });
  }
}
