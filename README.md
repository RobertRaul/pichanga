# Sistema de Gestión de Canchas Deportivas

Aplicación web moderna para la gestión y consulta de canchas deportivas en múltiples ciudades.

## Características

### Módulo de Administración
- CRUD completo para Ciudades, Distritos y Canchas
- Gestión de ubicaciones georreferenciadas
- Configuración de tipos de canchas (6v6, 8v8)
- Gestión de deportes permitidos (fútbol, vóley, eventos)

### Vista Pública
- Búsqueda y filtrado avanzado de canchas
- Filtros por ciudad, distrito, tipo de cancha, deporte
- Visualización en mapa interactivo con Leaflet
- Diseño totalmente responsivo

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite (fácil migración a PostgreSQL)
- **ORM**: Prisma
- **Estilos**: Tailwind CSS
- **Mapas**: Leaflet + React-Leaflet

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma migrate dev --name init

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
cancha-manager/
├── app/
│   ├── api/              # API Routes para CRUD
│   ├── admin/            # Panel de administración
│   ├── page.tsx          # Vista pública
│   └── layout.tsx        # Layout principal
├── components/           # Componentes reutilizables
├── lib/                  # Utilidades y configuraciones
├── prisma/              # Schema y migraciones
└── public/              # Archivos estáticos
```

## Funcionalidades Implementadas

### Administración
- ✅ Gestión de ciudades
- ✅ Gestión de distritos por ciudad
- ✅ Gestión completa de canchas
- ✅ Georreferenciación (latitud/longitud)
- ✅ Múltiples características por cancha

### Vista Pública
- ✅ Listado de canchas con filtros
- ✅ Filtro en cascada (ciudad → distrito)
- ✅ Filtros por tipo y deporte
- ✅ Visualización en mapa
- ✅ Diseño responsivo

## Escalabilidad

La arquitectura está preparada para:
- Sistema de reservas en línea
- Pasarela de pagos
- Sistema de publicidad
- Integración con calendarios
- Notificaciones push
- Sistema de reseñas
- API pública

## Base de Datos

Para migrar a PostgreSQL:

1. Actualizar `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

2. Actualizar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Ejecutar migración:
```bash
npx prisma migrate dev
```

## Deploy

### Vercel (Recomendado)
```bash
vercel deploy
```

### Railway / Render
Configurar variables de entorno y conectar repositorio Git.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar producción
npm start

# Prisma Studio (GUI para DB)
npx prisma studio
```

## Licencia

Proyecto desarrollado para gestión de canchas deportivas - 2025
