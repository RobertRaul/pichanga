import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('=== Crear Usuario Administrador ===\n');

  const username = await question('Username: ');
  const password = await question('Password: ');
  const nombre = await question('Nombre completo: ');

  if (!username || !password || !nombre) {
    console.error('❌ Todos los campos son requeridos');
    process.exit(1);
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      console.error(`❌ El usuario "${username}" ya existe`);
      process.exit(1);
    }

    // Crear nuevo usuario
    const user = await prisma.user.create({
      data: {
        username,
        password, // NOTA: En producción deberías usar bcrypt
        nombre
      }
    });

    console.log('\n✅ Usuario creado exitosamente!');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Nombre: ${user.nombre}`);
    console.log(`   Creado: ${user.createdAt}`);
    console.log('\n⚠️  NOTA: La contraseña no está encriptada. Considera usar bcrypt en producción.');
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
