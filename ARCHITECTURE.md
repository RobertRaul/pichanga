# Arquitectura del Sistema

## Overview

Sistema de gestión de canchas deportivas desarrollado con arquitectura moderna y escalable.

## Stack Tecnológico

### Frontend
- **Next.js 14** (App Router): Framework React con SSR y routing
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Utilidades CSS para diseño responsivo
- **React-Leaflet**: Mapas interactivos

### Backend
- **Next.js API Routes**: Endpoints RESTful serverless
- **Prisma ORM**: Abstracción de base de datos type-safe
- **SQLite/PostgreSQL**: Base de datos relacional

## Estructura de Directorios

```
cancha-manager/
│
├── app/                          # App Router de Next.js 14
│   ├── api/                      # API Routes (Backend)
│   │   ├── ciudades/            # CRUD de ciudades
│   │   ├── distritos/           # CRUD de distritos
│   │   └── canchas/             # CRUD de canchas
│   │
│   ├── admin/                   # Panel de administración
│   │   ├── ciudades/           # Gestión de ciudades
│   │   ├── distritos/          # Gestión de distritos
│   │   └── canchas/            # Gestión de canchas
│   │
│   ├── page.tsx                # Vista pública (home)
│   ├── layout.tsx              # Layout principal
│   └── globals.css             # Estilos globales
│
├── components/                  # Componentes React reutilizables
│   └── MapComponent.tsx        # Mapa con Leaflet
│
├── lib/                        # Utilidades y configuraciones
│   └── prisma.ts              # Singleton de Prisma Client
│
├── prisma/                     # Configuración de base de datos
│   ├── schema.prisma          # Schema de base de datos
│   ├── seed.ts                # Datos de ejemplo
│   └── migrations/            # Historial de migraciones
│
└── public/                    # Archivos estáticos
```

## Modelo de Datos

### Entidades Principales

```
Ciudad
├── id: String (CUID)
├── nombre: String
├── distritos: Distrito[]
└── canchas: Cancha[]

Distrito
├── id: String (CUID)
├── nombre: String
├── ciudadId: String (FK)
├── ciudad: Ciudad
└── canchas: Cancha[]

Cancha
├── id: String (CUID)
├── nombre: String
├── ciudadId: String (FK)
├── distritoId: String (FK)
├── direccion: String
├── latitud: Float?
├── longitud: Float?
├── techada: Boolean
├── aceptaEventos: Boolean
├── aceptaFutbol: Boolean
├── aceptaVoley: Boolean
├── tipoCancha: String ("6v6" | "8v8")
├── descripcion: String?
├── activa: Boolean
├── ciudad: Ciudad
├── distrito: Distrito
└── fotos: FotoCancha[]

FotoCancha
├── id: String (CUID)
├── canchaId: String (FK)
├── url: String
├── principal: Boolean
└── cancha: Cancha
```

## API Endpoints

### Ciudades
- `GET /api/ciudades` - Listar todas las ciudades
- `POST /api/ciudades` - Crear nueva ciudad
- `GET /api/ciudades/[id]` - Obtener ciudad específica
- `PUT /api/ciudades/[id]` - Actualizar ciudad
- `DELETE /api/ciudades/[id]` - Eliminar ciudad

### Distritos
- `GET /api/distritos?ciudadId={id}` - Listar distritos (filtro opcional)
- `POST /api/distritos` - Crear nuevo distrito
- `PUT /api/distritos/[id]` - Actualizar distrito
- `DELETE /api/distritos/[id]` - Eliminar distrito

### Canchas
- `GET /api/canchas?ciudadId={id}&distritoId={id}&techada={bool}&tipoCancha={tipo}&deporte={deporte}` - Listar canchas con filtros
- `POST /api/canchas` - Crear nueva cancha
- `GET /api/canchas/[id]` - Obtener cancha específica
- `PUT /api/canchas/[id]` - Actualizar cancha
- `DELETE /api/canchas/[id]` - Eliminar cancha

## Flujo de Datos

### Vista Pública (Home)
1. Usuario accede a `/`
2. Se cargan ciudades desde `/api/ciudades`
3. Al seleccionar ciudad, se cargan distritos desde `/api/distritos?ciudadId={id}`
4. Se aplican filtros y se consulta `/api/canchas?{params}`
5. Las canchas con coordenadas se muestran en el mapa
6. Las canchas se renderizan en formato card

### Panel de Administración
1. Acceso a `/admin`
2. CRUD independiente para cada entidad
3. Formularios controlados con React hooks
4. Validación en cliente y servidor
5. Confirmaciones antes de eliminaciones

## Características de Escalabilidad

### Preparado para:
1. **Sistema de Reservas**: Tabla `Reserva` relacionada con `Cancha`
2. **Usuarios**: Tabla `Usuario` con roles (admin, cliente)
3. **Pagos**: Integración con Stripe/PayPal
4. **Notificaciones**: WebSockets o Push API
5. **Reviews**: Tabla `Review` relacionada con `Cancha` y `Usuario`
6. **Publicidad**: Espacios definidos en layout para ads
7. **API Pública**: Rate limiting y autenticación con tokens

### Mejoras Futuras Sugeridas:

```typescript
// Ejemplo: Sistema de Reservas
model Reserva {
  id         String   @id @default(cuid())
  canchaId   String
  cancha     Cancha   @relation(fields: [canchaId], references: [id])
  usuarioId  String
  usuario    Usuario  @relation(fields: [usuarioId], references: [id])
  fecha      DateTime
  horaInicio String
  horaFin    String
  estado     String   // "pendiente" | "confirmada" | "cancelada"
  precio     Float
  createdAt  DateTime @default(now())
}

// Ejemplo: Sistema de Usuarios
model Usuario {
  id            String    @id @default(cuid())
  email         String    @unique
  nombre        String
  rol           String    @default("cliente") // "admin" | "cliente"
  telefono      String?
  reservas      Reserva[]
  reviews       Review[]
  createdAt     DateTime  @default(now())
}

// Ejemplo: Sistema de Reviews
model Review {
  id          String   @id @default(cuid())
  canchaId    String
  cancha      Cancha   @relation(fields: [canchaId], references: [id])
  usuarioId   String
  usuario     Usuario  @relation(fields: [usuarioId], references: [id])
  rating      Int      // 1-5 estrellas
  comentario  String?
  createdAt   DateTime @default(now())
}
```

## Performance

### Optimizaciones Implementadas:
- Server-side rendering con Next.js
- Carga dinámica del componente de mapas (dynamic import)
- Índices en base de datos para queries frecuentes
- Lazy loading de imágenes

### Métricas Objetivo:
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90

## Seguridad

### Implementado:
- Validación de datos en servidor
- Sanitización de inputs
- Protección CSRF nativa de Next.js
- HTTPS en producción

### Por Implementar:
- Autenticación con NextAuth.js
- Rate limiting en APIs
- CORS configurado apropiadamente
- Validación con Zod/Yup

## Testing (Próximos pasos)

```bash
# Testing recomendado
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright o Cypress
- API tests: Supertest

# Ejemplo estructura:
__tests__/
├── unit/
│   ├── components/
│   └── lib/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

## Documentación Adicional

- [README.md](./README.md): Guía de inicio rápido
- [DEPLOYMENT.md](./DEPLOYMENT.md): Guía de despliegue
- Documentación de Prisma: https://prisma.io/docs
- Documentación de Next.js: https://nextjs.org/docs
