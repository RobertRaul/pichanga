'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  nombre: string;
  createdAt: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', nombre: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Usuario registrado exitosamente');
        setFormData({ username: '', password: '', nombre: '' });
        setShowForm(false);
        fetchUsers();
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (error) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Registrar Nuevo Usuario</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre Completo</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Usuario</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn-primary flex-1">
                Registrar Usuario
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nombre</th>
                  <th className="text-left py-3 px-4">Usuario</th>
                  <th className="text-left py-3 px-4">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.nombre}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
