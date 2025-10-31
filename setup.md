# 🚀 Guía de Configuración Rápida (5 minutos)

## Prerequisitos
- Node.js 18+ instalado
- npm o yarn
- Git (opcional)

## Instalación Paso a Paso

### 1. Instalar dependencias (2 min)
```bash
cd cancha-manager
npm install
```

### 2. Configurar base de datos (1 min)
```bash
# Crear y migrar la base de datos
npx prisma migrate dev --name init

# Poblar con datos de ejemplo
npx tsx prisma/seed.ts
```

### 3. Iniciar servidor (30 seg)
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## Accesos Rápidos

### Vista Pública
- **Home**: http://localhost:3000
- Ver y filtrar todas las canchas disponibles

### Panel de Administración
- **Admin Dashboard**: http://localhost:3000/admin
- **Ciudades**: http://localhost:3000/admin/ciudades
- **Distritos**: http://localhost:3000/admin/distritos
- **Canchas**: http://localhost:3000/admin/canchas

## Datos de Prueba Incluidos

### Ciudades:
- Lima (4 distritos, 4 canchas)
- Arequipa (2 distritos, 2 canchas)
- Cusco (sin datos)

### Canchas de ejemplo:
1. **Cancha Los Campeones** - Miraflores, Lima (6v6, techada)
2. **Complejo Deportivo El Estadio** - Surco, Lima (6v6, múltiple)
3. **Futsal San Isidro** - San Isidro, Lima (5v5, techada)
4. **Arena Deportiva San Borja** - San Borja, Lima (6v6, techada)
5. **Cancha Misti FC** - Cayma, Arequipa (6v6)
6. **Complejo La Cantera** - Cercado, Arequipa (8v8, techada)

## Pruebas Rápidas

### 1. Vista Pública
- Abrir http://localhost:3000
- Probar filtros por ciudad
- Probar filtros por distrito
- Ver canchas en el mapa
- Verificar diseño responsivo

### 2. Administración
- Crear una nueva ciudad
- Crear un distrito en esa ciudad
- Crear una cancha con todos los campos
- Editar una cancha existente
- Eliminar una cancha

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Base de datos
npx prisma studio    # Abrir interfaz visual de la BD
npx prisma generate  # Regenerar cliente de Prisma
npx prisma migrate dev  # Crear nueva migración

# Producción
npm run build        # Compilar para producción
npm start            # Ejecutar en modo producción
```

## Resolución de Problemas

### Error: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Error: "Database not found"
```bash
npx prisma migrate dev --name init
```

### Puerto 3000 ocupado
```bash
# Cambiar puerto
PORT=3001 npm run dev
```

### Problemas con el mapa
- El mapa se carga dinámicamente
- Asegúrate de tener conexión a internet (usa CDN para tiles)
- Verifica que las canchas tengan latitud y longitud

## Próximos Pasos

1. **Personalizar diseño**: Editar `app/globals.css` y `tailwind.config.ts`
2. **Añadir autenticación**: Integrar NextAuth.js
3. **Sistema de fotos**: Integrar Cloudinary o similar
4. **Deploy**: Seguir guía en `DEPLOYMENT.md`

## Estructura de Archivos Principales

```
cancha-manager/
├── app/
│   ├── page.tsx              # Vista pública
│   ├── layout.tsx            # Layout principal
│   ├── admin/                # Panel de administración
│   └── api/                  # Endpoints de API
├── components/
│   └── MapComponent.tsx      # Componente de mapa
├── prisma/
│   ├── schema.prisma         # Schema de BD
│   └── seed.ts               # Datos de ejemplo
└── lib/
    └── prisma.ts             # Cliente de Prisma
```

## Features Implementados ✅

- ✅ CRUD completo de Ciudades
- ✅ CRUD completo de Distritos
- ✅ CRUD completo de Canchas
- ✅ Vista pública con filtros avanzados
- ✅ Mapas interactivos con Leaflet
- ✅ Diseño responsivo (mobile-first)
- ✅ Georreferenciación de canchas
- ✅ Filtros en cascada (ciudad → distrito)
- ✅ Base de datos con Prisma ORM
- ✅ TypeScript para type-safety

## Features Preparados para Futuro 🚀

- Sistema de reservas
- Autenticación de usuarios
- Pagos en línea
- Upload de fotos
- Sistema de reviews
- Notificaciones
- API pública
- Espacios publicitarios

## Soporte

¿Problemas o preguntas? Revisa:
- [README.md](./README.md) - Documentación general
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura técnica
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue

---

**Tiempo total de setup**: ~5 minutos
**Tecnologías**: Next.js 14, TypeScript, Prisma, Tailwind, Leaflet
