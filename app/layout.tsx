import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gestor de Canchas Deportivas",
  description: "Sistema de gestión de canchas deportivas en múltiples ciudades",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                ⚽ Pichanga
              </Link>
              <div className="flex gap-4">
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Inicio
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>Encuentra tu cancha</p>
            <p className="text-sm text-gray-400 mt-2">Dev by. Robert Raul - 2025</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
