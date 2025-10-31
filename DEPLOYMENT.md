# Guía de Despliegue - Sistema de Gestión de Canchas

## Despliegue en Vercel (Recomendado)

### Pasos:

1. **Crear cuenta en Vercel**: https://vercel.com

2. **Instalar Vercel CLI**:
```bash
npm i -g vercel
```

3. **Conectar proyecto**:
```bash
cd cancha-manager
vercel
```

4. **Configurar base de datos**:
   - Para producción, usa **Vercel Postgres** o **Neon**
   - Añade la variable de entorno en Vercel Dashboard:
     ```
     DATABASE_URL="postgresql://user:pass@host/db"
     ```

5. **Deploy**:
```bash
vercel --prod
```

## Despliegue en Railway

### Pasos:

1. **Crear cuenta en Railway**: https://railway.app

2. **Nuevo proyecto desde GitHub**:
   - Conecta tu repositorio
   - Railway detectará automáticamente Next.js

3. **Añadir base de datos PostgreSQL**:
   - Add service → PostgreSQL
   - Railway generará automáticamente `DATABASE_URL`

4. **Variables de entorno**:
   ```
   DATABASE_URL=(generado automáticamente por Railway)
   NODE_ENV=production
   ```

5. **Deploy automático**:
   - Railway hará deploy en cada push a main

## Migración de SQLite a PostgreSQL

### 1. Actualizar schema:
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Cambiar de sqlite
  url      = env("DATABASE_URL")
}
```

### 2. Actualizar .env:
```
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

### 3. Crear nueva migración:
```bash
npx prisma migrate dev --name postgresql_migration
```

### 4. Ejecutar seed en producción:
```bash
npx tsx prisma/seed.ts
```

## Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://..."

# Next.js (opcional)
NEXT_PUBLIC_API_URL="https://tu-dominio.com"

# Para producción
NODE_ENV=production
```

## Comandos Importantes

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Ejecutar producción localmente
npm start

# Base de datos
npx prisma migrate deploy    # Aplicar migraciones en producción
npx prisma studio            # GUI para visualizar datos
npx prisma generate          # Regenerar cliente de Prisma
```

## Checklist Pre-Deploy

- [ ] Migrar de SQLite a PostgreSQL
- [ ] Configurar variables de entorno
- [ ] Ejecutar `npm run build` localmente
- [ ] Probar que no haya errores de TypeScript
- [ ] Verificar que todas las rutas funcionen
- [ ] Ejecutar seed para datos de ejemplo
- [ ] Configurar dominio personalizado (opcional)

## Monitoreo y Mantenimiento

### Logs en Vercel:
```bash
vercel logs
```

### Logs en Railway:
- Disponibles en el dashboard de Railway

### Base de datos:
```bash
npx prisma studio  # Interfaz visual
```

## Escalabilidad

### Futuras optimizaciones:
1. **CDN para imágenes**: Cloudinary o Uploadcare
2. **Cache**: Redis para queries frecuentes
3. **Rate limiting**: Proteger APIs públicas
4. **Monitoring**: Sentry para errores
5. **Analytics**: Vercel Analytics o Plausible

## Costos Estimados

### Tier Gratuito:
- **Vercel**: Gratis para proyectos personales
- **Neon/Vercel Postgres**: 0.5GB gratis
- **Total**: $0/mes (hasta cierto tráfico)

### Tier Producción:
- **Vercel Pro**: $20/mes
- **Neon Scale**: $19/mes (10GB)
- **Total**: ~$40/mes

## Soporte

Para problemas o preguntas:
- Documentación de Next.js: https://nextjs.org/docs
- Documentación de Prisma: https://prisma.io/docs
- Soporte de Vercel: https://vercel.com/support
