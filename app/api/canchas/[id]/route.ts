import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cancha = await prisma.cancha.findUnique({
      where: { id: params.id },
      include: {
        ciudad: true,
        distrito: true,
        fotos: {
          orderBy: { principal: 'desc' }
        }
      }
    });
    if (!cancha) {
      return NextResponse.json({ error: 'Cancha no encontrada' }, { status: 404 });
    }
    return NextResponse.json(cancha);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener cancha' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const cancha = await prisma.cancha.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        ciudadId: body.ciudadId,
        distritoId: body.distritoId,
        direccion: body.direccion,
        latitud: body.latitud,
        longitud: body.longitud,
        googleMapsUrl: body.googleMapsUrl,
        techada: body.techada,
        aceptaEventos: body.aceptaEventos,
        aceptaFutbol: body.aceptaFutbol,
        aceptaVoley: body.aceptaVoley,
        tipoCancha: body.tipoCancha,
        descripcion: body.descripcion,
        telefono1: body.telefono1,
        telefono2: body.telefono2,
        telefono3: body.telefono3,
        horarioInicio: body.horarioInicio,
        horarioFin: body.horarioFin,
        diasAtencion: body.diasAtencion,
        activa: body.activa
      }
    });
    return NextResponse.json(cancha);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar cancha' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.cancha.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Cancha eliminada' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar cancha' }, { status: 500 });
  }
}
