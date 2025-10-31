'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/ciudades" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">🏙️</div>
          <h2 className="text-xl font-bold mb-2">Ciudades</h2>
          <p className="text-gray-600">Gestionar ciudades del sistema</p>
        </Link>

        <Link href="/admin/distritos" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">📍</div>
          <h2 className="text-xl font-bold mb-2">Distritos</h2>
          <p className="text-gray-600">Gestionar distritos por ciudad</p>
        </Link>

        <Link href="/admin/canchas" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-4">⚽</div>
          <h2 className="text-xl font-bold mb-2">Canchas</h2>
          <p className="text-gray-600">Gestionar canchas deportivas</p>
        </Link>
      </div>
    </div>
  );
}
