import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ciudadId = searchParams.get('ciudadId');
    const distritoId = searchParams.get('distritoId');
    const techada = searchParams.get('techada');
    const tipoCancha = searchParams.get('tipoCancha');
    const deporte = searchParams.get('deporte');

    const where: any = { activa: true };

    if (ciudadId) where.ciudadId = ciudadId;
    if (distritoId) where.distritoId = distritoId;
    if (techada !== null) where.techada = techada === 'true';
    if (tipoCancha) where.tipoCancha = tipoCancha;

    if (deporte === 'futbol') where.aceptaFutbol = true;
    if (deporte === 'voley') where.aceptaVoley = true;
    if (deporte === 'eventos') where.aceptaEventos = true;

    const canchas = await prisma.cancha.findMany({
      where,
      include: {
        ciudad: true,
        distrito: true,
        fotos: {
          orderBy: { principal: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(canchas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener canchas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cancha = await prisma.cancha.create({
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
        activa: body.activa ?? true
      },
      include: {
        ciudad: true,
        distrito: true
      }
    });
    return NextResponse.json(cancha, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear cancha' }, { status: 500 });
  }
}
