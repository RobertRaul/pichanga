# Guía de Despliegue en Vercel con PostgreSQL

Esta guía te llevará paso a paso para desplegar tu aplicación de gestión de canchas en Vercel con una base de datos PostgreSQL.

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com) (gratis)
- Cuenta en [GitHub](https://github.com) (gratis)
- Base de datos PostgreSQL (opciones gratuitas más adelante)

---

## Paso 1: Preparar el Repositorio en GitHub

### 1.1 Inicializar Git (si no lo has hecho)

```bash
cd cancha-manager
git init
git add .
git commit -m "Initial commit - ready for Vercel deployment"
```

### 1.2 Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio (público o privado)
3. NO inicialices con README, .gitignore o licencia

### 1.3 Subir código a GitHub

```bash
git remote add origin https://github.com/tu-usuario/tu-repo.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Configurar Base de Datos PostgreSQL

Tienes varias opciones gratuitas. Elige una:

### Opción A: Vercel Postgres (Recomendado - Más fácil)

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Storage" en el menú lateral
3. Click en "Create Database"
4. Selecciona "Postgres"
5. Elige tu región (cerca de donde estén tus usuarios)
6. Click en "Create"
7. **Guarda el `DATABASE_URL`** que te proporciona

### Opción B: Neon (Alternativa gratuita)

1. Ve a [Neon](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto
3. Selecciona la región
4. **Copia el connection string** que aparece
5. Asegúrate de que termine con `?sslmode=require`

### Opción C: Supabase

1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. **Copia el "Connection string"** en modo "Transaction" o "Session"
5. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

---

## Paso 3: Desplegar en Vercel

### 3.1 Importar proyecto desde GitHub

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New..." → "Project"
3. Busca tu repositorio de GitHub
4. Click en "Import"

### 3.2 Configurar el proyecto

En la pantalla de configuración:

**Framework Preset:** Next.js (se detecta automáticamente)

**Root Directory:** `cancha-manager` (IMPORTANTE: el proyecto está en esta carpeta)

**Build Command:** (usa el predeterminado o especifica)
```bash
prisma generate && prisma migrate deploy && next build
```

**Output Directory:** `.next` (predeterminado)

### 3.3 Configurar Variables de Entorno

En la sección "Environment Variables", añade:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public&sslmode=require
```

Reemplaza con tu connection string del Paso 2.

Si usas Supabase para almacenar fotos, también añade:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3.4 Desplegar

1. Click en "Deploy"
2. Espera 2-3 minutos mientras Vercel construye y despliega tu aplicación
3. Una vez completado, verás un mensaje de éxito con tu URL

---

## Paso 4: Configurar Base de Datos (Migraciones)

Después del primer despliegue, las migraciones de Prisma deberían ejecutarse automáticamente. Si no:

### 4.1 Verificar que las tablas se crearon

Si usas **Neon** o **Supabase**:
1. Ve al dashboard de tu proveedor
2. Busca el SQL Editor o Query Editor
3. Ejecuta:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

Si usas **Vercel Postgres**:
1. Ve a Storage > Tu base de datos > Data
2. Deberías ver las tablas: Ciudad, Distrito, Cancha, FotoCancha, User

### 4.2 Ejecutar migraciones manualmente (si es necesario)

Si las tablas no se crearon, ejecuta desde tu terminal local:

```bash
cd cancha-manager

# Crear migración inicial
npx prisma migrate dev --name init

# Aplicar a producción usando DATABASE_URL de Vercel
DATABASE_URL="tu-connection-string-aqui" npx prisma migrate deploy
```

---

## Paso 5: Poblar la Base de Datos (Seed)

Para agregar datos de ejemplo (ciudades, distritos, canchas):

### 5.1 Ejecutar seed localmente apuntando a producción

```bash
cd cancha-manager

# Ejecutar seed con la DATABASE_URL de producción
DATABASE_URL="tu-connection-string-aqui" npx tsx prisma/seed.ts
```

### 5.2 Verificar que los datos se cargaron

Visita tu aplicación desplegada:
```
https://tu-proyecto.vercel.app
```

Deberías ver canchas en el mapa.

---

## Paso 6: Configurar Dominio Personalizado (Opcional)

1. Ve a tu proyecto en Vercel Dashboard
2. Click en "Settings" → "Domains"
3. Añade tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

---

## Paso 7: Configurar Almacenamiento de Fotos (Supabase)

Si quieres que los usuarios suban fotos de canchas:

### 7.1 Crear bucket en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a "Storage" en el menú lateral
4. Click en "Create a new bucket"
5. Nombre: `cancha-photos`
6. Public bucket: **Sí** ✓
7. Click en "Create bucket"

### 7.2 Configurar políticas de acceso

En el bucket `cancha-photos`, ve a "Policies" y añade:

**Policy para lectura pública:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'cancha-photos' );
```

**Policy para inserción:**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'cancha-photos' );
```

### 7.3 Añadir variables de entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

Redeploy el proyecto para que tome las nuevas variables.

---

## Solución de Problemas

### Error: "Can't reach database server"

**Solución:**
- Verifica que el `DATABASE_URL` esté correcto
- Asegúrate de que termine con `?sslmode=require`
- Verifica que la base de datos esté activa en tu proveedor

### Error: "Prisma Client not generated"

**Solución:**
```bash
npx prisma generate
git add .
git commit -m "Regenerate Prisma Client"
git push
```

### Error de migración: "Table already exists"

**Solución:**
```bash
npx prisma migrate resolve --applied "nombre_de_la_migracion"
```

### Las fotos no se cargan

**Solución:**
- Verifica que las variables `NEXT_PUBLIC_SUPABASE_*` estén configuradas
- Verifica que el bucket sea público
- Verifica las políticas de acceso en Supabase

---

## Comandos Útiles

### Ver logs en Vercel
```bash
# Instalar CLI
npm i -g vercel

# Ver logs en tiempo real
vercel logs --follow
```

### Ejecutar build localmente
```bash
cd cancha-manager
npm run build
npm start
```

### Conectarse a la base de datos
```bash
# Prisma Studio (interfaz visual)
DATABASE_URL="tu-connection-string" npx prisma studio
```

### Hacer cambios al schema

1. Edita `prisma/schema.prisma`
2. Crea migración:
   ```bash
   npx prisma migrate dev --name nombre_del_cambio
   ```
3. Aplicar a producción:
   ```bash
   DATABASE_URL="tu-connection-string" npx prisma migrate deploy
   ```
4. Commit y push:
   ```bash
   git add .
   git commit -m "Update database schema"
   git push
   ```

---

## Mejores Prácticas

### 1. Variables de Entorno
- **NUNCA** commitees archivos `.env` con datos reales
- Usa `.env.local` para desarrollo local
- Configura variables en Vercel Dashboard para producción

### 2. Migraciones
- Siempre crea migraciones con `prisma migrate dev`
- Nunca edites manualmente la base de datos de producción
- Mantén un backup antes de migraciones grandes

### 3. Monitoreo
- Configura [Vercel Analytics](https://vercel.com/analytics)
- Usa [Sentry](https://sentry.io) para tracking de errores
- Revisa logs regularmente

### 4. Performance
- Habilita caché de Vercel
- Optimiza imágenes con Next.js Image
- Usa lazy loading para el mapa

---

## Costos Estimados

### Plan Gratuito (Hobby)
- **Vercel:** Gratis (100GB bandwidth/mes)
- **Vercel Postgres:** 0.5 GB gratis
- **Neon:** 0.5 GB gratis
- **Supabase:** 500 MB storage + 2GB bandwidth
- **Total:** $0/mes

### Plan Producción
- **Vercel Pro:** $20/mes
- **Vercel Postgres:** $0.20/GB (~$4/mes para 20GB)
- **Supabase Pro:** $25/mes (100GB storage)
- **Total:** ~$50/mes

---

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Prisma + Vercel Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## Checklist de Despliegue

- [ ] Código subido a GitHub
- [ ] Base de datos PostgreSQL creada
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Primera build exitosa
- [ ] Migraciones aplicadas
- [ ] Seed ejecutado (datos de ejemplo)
- [ ] Aplicación funciona en producción
- [ ] Supabase configurado (si usas fotos)
- [ ] Dominio personalizado configurado (opcional)

---

## Soporte

Si tienes problemas:
1. Revisa los logs en Vercel Dashboard
2. Consulta la sección de Solución de Problemas
3. Revisa la documentación oficial de Vercel y Prisma
4. Busca en [Stack Overflow](https://stackoverflow.com) con tags: `vercel`, `prisma`, `nextjs`

---

**¡Tu aplicación debería estar funcionando ahora!** 🎉

URL de ejemplo: `https://tu-proyecto.vercel.app`
