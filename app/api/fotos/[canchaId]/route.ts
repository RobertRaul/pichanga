import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: { canchaId: string } }) {
  try {
    await prisma.fotoCancha.deleteMany({
      where: { canchaId: params.canchaId }
    });
    return NextResponse.json({ message: 'Fotos eliminadas' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar fotos' }, { status: 500 });
  }
}
