'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', data.user.nombre);
        router.push('/admin');
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Administración</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.push('/')} className="text-sm text-gray-600 hover:text-primary-600">
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
