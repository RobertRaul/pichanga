import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const distrito = await prisma.distrito.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        ciudadId: body.ciudadId
      }
    });
    return NextResponse.json(distrito);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar distrito' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.distrito.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Distrito eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar distrito' }, { status: 500 });
  }
}
