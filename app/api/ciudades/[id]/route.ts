import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const ciudad = await prisma.ciudad.findUnique({
      where: { id: params.id },
      include: {
        distritos: true,
        canchas: true
      }
    });
    if (!ciudad) {
      return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 404 });
    }
    return NextResponse.json(ciudad);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener ciudad' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const ciudad = await prisma.ciudad.update({
      where: { id: params.id },
      data: { nombre: body.nombre }
    });
    return NextResponse.json(ciudad);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar ciudad' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.ciudad.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Ciudad eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar ciudad' }, { status: 500 });
  }
}
