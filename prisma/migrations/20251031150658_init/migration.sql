-- CreateTable
CREATE TABLE "Ciudad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Distrito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "ciudadId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Distrito_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "Ciudad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cancha" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "ciudadId" TEXT NOT NULL,
    "distritoId" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "latitud" REAL,
    "longitud" REAL,
    "techada" BOOLEAN NOT NULL DEFAULT false,
    "aceptaEventos" BOOLEAN NOT NULL DEFAULT false,
    "aceptaFutbol" BOOLEAN NOT NULL DEFAULT true,
    "aceptaVoley" BOOLEAN NOT NULL DEFAULT false,
    "tipoCancha" TEXT NOT NULL,
    "descripcion" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cancha_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "Ciudad" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Cancha_distritoId_fkey" FOREIGN KEY ("distritoId") REFERENCES "Distrito" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FotoCancha" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canchaId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FotoCancha_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "Cancha" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Distrito_ciudadId_idx" ON "Distrito"("ciudadId");

-- CreateIndex
CREATE INDEX "Cancha_ciudadId_idx" ON "Cancha"("ciudadId");

-- CreateIndex
CREATE INDEX "Cancha_distritoId_idx" ON "Cancha"("distritoId");

-- CreateIndex
CREATE INDEX "Cancha_activa_idx" ON "Cancha"("activa");

-- CreateIndex
CREATE INDEX "FotoCancha_canchaId_idx" ON "FotoCancha"("canchaId");
