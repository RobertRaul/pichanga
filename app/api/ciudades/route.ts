import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const ciudades = await prisma.ciudad.findMany({
      include: {
        _count: {
          select: { distritos: true, canchas: true }
        }
      },
      orderBy: { nombre: 'asc' }
    });
    return NextResponse.json(ciudades);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener ciudades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ciudad = await prisma.ciudad.create({
      data: {
        nombre: body.nombre
      }
    });
    return NextResponse.json(ciudad, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear ciudad' }, { status: 500 });
  }
}
