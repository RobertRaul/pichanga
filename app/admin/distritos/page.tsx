'use client';

import { useState, useEffect } from 'react';

interface Ciudad {
  id: string;
  nombre: string;
}

interface Distrito {
  id: string;
  nombre: string;
  ciudadId: string;
  ciudad: Ciudad;
  _count?: { canchas: number };
}

export default function DistritosPage() {
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [nombre, setNombre] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCiudades();
    fetchDistritos();
  }, []);

  const fetchCiudades = async () => {
    const res = await fetch('/api/ciudades');
    const data = await res.json();
    setCiudades(data);
  };

  const fetchDistritos = async () => {
    const res = await fetch('/api/distritos');
    const data = await res.json();
    setDistritos(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !ciudadId) return;

    if (editingId) {
      await fetch(`/api/distritos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, ciudadId })
      });
    } else {
      await fetch('/api/distritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, ciudadId })
      });
    }

    setNombre('');
    setCiudadId('');
    setEditingId(null);
    fetchDistritos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este distrito?')) return;
    await fetch(`/api/distritos/${id}`, { method: 'DELETE' });
    fetchDistritos();
  };

  const handleEdit = (distrito: Distrito) => {
    setNombre(distrito.nombre);
    setCiudadId(distrito.ciudadId);
    setEditingId(distrito.id);
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Distritos</h1>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar' : 'Nuevo'} Distrito</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ciudad</label>
            <select
              value={ciudadId}
              onChange={(e) => setCiudadId(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Seleccione una ciudad</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del Distrito</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del distrito"
              className="input-field"
              required
            />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); setNombre(''); setCiudadId(''); }}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Listado de Distritos</h2>
        <div className="space-y-4">
          {distritos.map((distrito) => (
            <div key={distrito.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">{distrito.nombre}</h3>
                <p className="text-sm text-gray-600">
                  {distrito.ciudad.nombre} • {distrito._count?.canchas || 0} canchas
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(distrito)} className="btn-secondary text-sm">
                  Editar
                </button>
                <button onClick={() => handleDelete(distrito.id)} className="btn-secondary text-sm text-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {distritos.length === 0 && (
            <p className="text-gray-500 text-center py-8">No hay distritos registrados</p>
          )}
        </div>
      </div>
    </div>
  );
}
