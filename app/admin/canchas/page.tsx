'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Cancha {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: { nombre: string };
  distrito: { nombre: string };
  techada: boolean;
  tipoCancha: string;
  aceptaFutbol: boolean;
  aceptaVoley: boolean;
  aceptaEventos: boolean;
}

export default function CanchasAdminPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCanchas();
  }, []);

  const fetchCanchas = async () => {
    const res = await fetch('/api/canchas');
    const data = await res.json();
    setCanchas(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta cancha?')) return;
    await fetch(`/api/canchas/${id}`, { method: 'DELETE' });
    fetchCanchas();
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Canchas</h1>
        <Link href="/admin/canchas/nueva" className="btn-primary">
          + Nueva Cancha
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canchas.map((cancha) => (
          <div key={cancha.id} className="card">
            <h3 className="font-bold text-lg mb-2">{cancha.nombre}</h3>
            <p className="text-sm text-gray-600 mb-1">{cancha.ciudad.nombre} - {cancha.distrito.nombre}</p>
            <p className="text-sm text-gray-600 mb-3">{cancha.direccion}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {cancha.tipoCancha}
              </span>
              {cancha.techada && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Techada
                </span>
              )}
              {cancha.aceptaFutbol && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Fútbol
                </span>
              )}
              {cancha.aceptaVoley && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  Vóley
                </span>
              )}
              {cancha.aceptaEventos && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  Eventos
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/canchas/${cancha.id}`} className="btn-secondary text-sm flex-1 text-center">
                Editar
              </Link>
              <button onClick={() => handleDelete(cancha.id)} className="btn-secondary text-sm text-red-600">
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {canchas.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No hay canchas registradas
          </div>
        )}
      </div>
    </div>
  );
}
