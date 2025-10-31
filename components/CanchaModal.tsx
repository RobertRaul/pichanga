'use client';

import { useEffect, useState } from 'react';

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
  descripcion?: string;
  latitud?: number;
  longitud?: number;
  googleMapsUrl?: string;
  telefono1?: string;
  telefono2?: string;
  telefono3?: string;
  horarioInicio?: string;
  horarioFin?: string;
  diasAtencion?: string;
  fotos?: Array<{ url: string; principal: boolean }>;
}

interface CanchaModalProps {
  cancha: Cancha | null;
  onClose: () => void;
}

export default function CanchaModal({ cancha, onClose }: CanchaModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (cancha) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0); // Reset image index when modal opens
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [cancha]);

  if (!cancha) return null;

  const fotos = cancha.fotos || [];
  const hasFotos = fotos.length > 0;

  const nextImage = () => {
    if (hasFotos) {
      setCurrentImageIndex((prev) => (prev + 1) % fotos.length);
    }
  };

  const prevImage = () => {
    if (hasFotos) {
      setCurrentImageIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
    }
  };

  const googleMapsUrl = cancha.googleMapsUrl
    ? cancha.googleMapsUrl
    : cancha.latitud && cancha.longitud
    ? `https://www.google.com/maps/search/?api=1&query=${cancha.latitud},${cancha.longitud}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cancha.direccion + ', ' + cancha.ciudad.nombre)}`;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
        {/* Header con carrusel de imágenes */}
        <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700">
          {hasFotos ? (
            <>
              <img
                src={fotos[currentImageIndex].url}
                alt={`${cancha.nombre} - Imagen ${currentImageIndex + 1}`}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />

              {/* Botones de navegación del carrusel */}
              {fotos.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-lg"
                    aria-label="Imagen anterior"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-lg"
                    aria-label="Siguiente imagen"
                  >
                    →
                  </button>

                  {/* Indicadores de imagen */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {fotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-8'
                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Contador de imágenes */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentImageIndex + 1} / {fotos.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2}/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1010 10M12 2v20" />
              </svg>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8">
          {/* Título */}
          <h2 className="text-3xl font-bold mb-2">{cancha.nombre}</h2>
          <p className="text-gray-600 mb-4">
            {cancha.ciudad.nombre} - {cancha.distrito.nombre}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
              {cancha.tipoCancha}
            </span>
            {cancha.techada && (
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Techada
              </span>
            )}
            {cancha.aceptaFutbol && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Fútbol
              </span>
            )}
            {cancha.aceptaVoley && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                Vóley
              </span>
            )}
            {cancha.aceptaEventos && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Eventos
              </span>
            )}
          </div>

          {/* Dirección */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Ubicación</h3>
            <p className="text-gray-700 mb-3">{cancha.direccion}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              Ver en Google Maps
            </a>
          </div>

          {/* Descripción */}
          {cancha.descripcion && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{cancha.descripcion}</p>
            </div>
          )}

          {/* Contacto y Horario */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Teléfonos */}
            {(cancha.telefono1 || cancha.telefono2 || cancha.telefono3) && (
              <div>
                <h3 className="text-lg font-bold mb-3">Contacto</h3>
                <div className="space-y-2">
                  {cancha.telefono1 && (
                    <a href={`tel:${cancha.telefono1}`} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{cancha.telefono1}</span>
                    </a>
                  )}
                  {cancha.telefono2 && (
                    <a href={`tel:${cancha.telefono2}`} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{cancha.telefono2}</span>
                    </a>
                  )}
                  {cancha.telefono3 && (
                    <a href={`tel:${cancha.telefono3}`} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{cancha.telefono3}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Horario */}
            {(cancha.horarioInicio || cancha.diasAtencion) && (
              <div>
                <h3 className="text-lg font-bold mb-3">Horario</h3>
                <div className="space-y-2">
                  {cancha.diasAtencion && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{cancha.diasAtencion}</span>
                    </div>
                  )}
                  {cancha.horarioInicio && cancha.horarioFin && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{cancha.horarioInicio} - {cancha.horarioFin}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Características */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Características</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cancha.techada ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Techada</p>
                  <p className="text-sm text-gray-600">{cancha.techada ? 'Sí' : 'No'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Tipo de Cancha</p>
                  <p className="text-sm text-gray-600">{cancha.tipoCancha}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cancha.aceptaFutbol ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2}/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1010 10M12 2v20" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Fútbol</p>
                  <p className="text-sm text-gray-600">{cancha.aceptaFutbol ? 'Disponible' : 'No disponible'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cancha.aceptaVoley ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth={2}/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Vóley</p>
                  <p className="text-sm text-gray-600">{cancha.aceptaVoley ? 'Disponible' : 'No disponible'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cancha.aceptaEventos ? 'bg-purple-100' : 'bg-gray-100'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Eventos</p>
                  <p className="text-sm text-gray-600">{cancha.aceptaEventos ? 'Disponible' : 'No disponible'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de cerrar */}
          <div className="mt-8 flex gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
            >
              Cómo llegar
            </a>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
