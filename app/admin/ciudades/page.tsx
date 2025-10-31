'use client';

import { useState, useEffect } from 'react';

interface Ciudad {
  id: string;
  nombre: string;
  _count?: { distritos: number; canchas: number };
}

export default function CiudadesPage() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [nombre, setNombre] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCiudades();
  }, []);

  const fetchCiudades = async () => {
    const res = await fetch('/api/ciudades');
    const data = await res.json();
    setCiudades(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingId) {
      await fetch(`/api/ciudades/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
    } else {
      await fetch('/api/ciudades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
    }

    setNombre('');
    setEditingId(null);
    fetchCiudades();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta ciudad?')) return;
    await fetch(`/api/ciudades/${id}`, { method: 'DELETE' });
    fetchCiudades();
  };

  const handleEdit = (ciudad: Ciudad) => {
    setNombre(ciudad.nombre);
    setEditingId(ciudad.id);
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Ciudades</h1>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar' : 'Nueva'} Ciudad</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la ciudad"
            className="input-field flex-1"
            required
          />
          <button type="submit" className="btn-primary">
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setNombre(''); }}
              className="btn-secondary"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Listado de Ciudades</h2>
        <div className="space-y-4">
          {ciudades.map((ciudad) => (
            <div key={ciudad.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{ciudad.nombre}</h3>
                <p className="text-sm text-gray-600">
                  {ciudad._count?.distritos || 0} distritos • {ciudad._count?.canchas || 0} canchas
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(ciudad)} className="btn-secondary text-sm">
                  Editar
                </button>
                <button onClick={() => handleDelete(ciudad.id)} className="btn-secondary text-sm text-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {ciudades.length === 0 && (
            <p className="text-gray-500 text-center py-8">No hay ciudades registradas</p>
          )}
        </div>
      </div>
    </div>
  );
}
