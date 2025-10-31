import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, nombre: user.nombre }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
