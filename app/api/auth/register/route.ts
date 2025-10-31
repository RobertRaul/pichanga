import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password, nombre } = await request.json();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Usuario ya existe' }, { status: 400 });
    }

    // Crear usuario (sin encriptación por simplicidad)
    const user = await prisma.user.create({
      data: {
        username,
        password, // En producción, usa bcrypt
        nombre
      }
    });

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: { id: user.id, username: user.username, nombre: user.nombre }
    }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
