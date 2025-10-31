'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <Link href="/admin" className="font-bold text-lg text-primary-600">
                Panel Admin
              </Link>
              <Link href="/admin/canchas" className="hover:text-primary-600">
                Canchas
              </Link>
              <Link href="/admin/ciudades" className="hover:text-primary-600">
                Ciudades
              </Link>
              <Link href="/admin/distritos" className="hover:text-primary-600">
                Distritos
              </Link>
              <Link href="/admin/usuarios" className="hover:text-primary-600">
                Usuarios
              </Link>
            </div>
            <div className="flex gap-4 items-center">
              <Link href="/" className="text-sm hover:text-primary-600">
                Ver sitio público
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
}
