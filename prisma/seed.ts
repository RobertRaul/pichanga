import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Crear ciudades
  const lima = await prisma.ciudad.create({
    data: { nombre: 'Lima' }
  });

  const arequipa = await prisma.ciudad.create({
    data: { nombre: 'Arequipa' }
  });

  const cusco = await prisma.ciudad.create({
    data: { nombre: 'Cusco' }
  });

  // Crear distritos de Lima
  const sanIsidro = await prisma.distrito.create({
    data: { nombre: 'San Isidro', ciudadId: lima.id }
  });

  const miraflores = await prisma.distrito.create({
    data: { nombre: 'Miraflores', ciudadId: lima.id }
  });

  const surco = await prisma.distrito.create({
    data: { nombre: 'Santiago de Surco', ciudadId: lima.id }
  });

  const sanBorja = await prisma.distrito.create({
    data: { nombre: 'San Borja', ciudadId: lima.id }
  });

  // Crear distritos de Arequipa
  const cayma = await prisma.distrito.create({
    data: { nombre: 'Cayma', ciudadId: arequipa.id }
  });

  const cercado = await prisma.distrito.create({
    data: { nombre: 'Cercado', ciudadId: arequipa.id }
  });

  // Crear canchas en Lima
  await prisma.cancha.create({
    data: {
      nombre: 'Cancha Los Campeones',
      ciudadId: lima.id,
      distritoId: miraflores.id,
      direccion: 'Av. Arequipa 2450',
      latitud: -12.1195,
      longitud: -77.0310,
      techada: true,
      aceptaFutbol: true,
      aceptaVoley: false,
      aceptaEventos: true,
      tipoCancha: '6v6',
      descripcion: 'Cancha de grass sintético de alta calidad, ideal para partidos nocturnos. Cuenta con vestuarios y estacionamiento.',
      activa: true
    }
  });

  await prisma.cancha.create({
    data: {
      nombre: 'Complejo Deportivo El Estadio',
      ciudadId: lima.id,
      distritoId: surco.id,
      direccion: 'Calle Los Frutales 320',
      latitud: -12.1323,
      longitud: -76.9930,
      techada: false,
      aceptaFutbol: true,
      aceptaVoley: true,
      aceptaEventos: true,
      tipoCancha: '6v6',
      descripcion: 'Amplio complejo con múltiples canchas. Disponible para fútbol y vóley. Cafetería en el local.',
      activa: true
    }
  });

  await prisma.cancha.create({
    data: {
      nombre: 'Futsal San Isidro',
      ciudadId: lima.id,
      distritoId: sanIsidro.id,
      direccion: 'Av. Prescott 456',
      latitud: -12.0950,
      longitud: -77.0364,
      techada: true,
      aceptaFutbol: true,
      aceptaVoley: false,
      aceptaEventos: false,
      tipoCancha: '5v5',
      descripcion: 'Cancha profesional de futsal con superficie de madera. Solo para fútbol.',
      activa: true
    }
  });

  await prisma.cancha.create({
    data: {
      nombre: 'Arena Deportiva San Borja',
      ciudadId: lima.id,
      distritoId: sanBorja.id,
      direccion: 'Av. San Borja Norte 1234',
      latitud: -12.0900,
      longitud: -77.0100,
      techada: true,
      aceptaFutbol: true,
      aceptaVoley: true,
      aceptaEventos: true,
      tipoCancha: '6v6',
      descripcion: 'Moderna arena deportiva multiusos. Acepta eventos corporativos y deportivos.',
      activa: true
    }
  });

  // Crear canchas en Arequipa
  await prisma.cancha.create({
    data: {
      nombre: 'Cancha Misti FC',
      ciudadId: arequipa.id,
      distritoId: cayma.id,
      direccion: 'Av. Cayma 890',
      latitud: -16.3989,
      longitud: -71.5350,
      techada: false,
      aceptaFutbol: true,
      aceptaVoley: false,
      aceptaEventos: false,
      tipoCancha: '6v6',
      descripcion: 'Cancha de grass natural con vista al Misti. Ambiente familiar.',
      activa: true
    }
  });

  await prisma.cancha.create({
    data: {
      nombre: 'Complejo La Cantera',
      ciudadId: arequipa.id,
      distritoId: cercado.id,
      direccion: 'Calle Mercaderes 230',
      latitud: -16.3988,
      longitud: -71.5369,
      techada: true,
      aceptaFutbol: true,
      aceptaVoley: true,
      aceptaEventos: true,
      tipoCancha: '5v5',
      descripcion: 'Cancha pequeña ideal para partidos rápidos. Techada y con iluminación LED.',
      activa: true
    }
  });

  console.log('✅ Base de datos poblada con datos de ejemplo');
  console.log(`Ciudades creadas: ${[lima, arequipa, cusco].length}`);
  console.log('Distritos creados: 6');
  console.log('Canchas creadas: 6');
}

main()
  .catch((e) => {
    console.error('Error al poblar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
