'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Cancha {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: { nombre: string };
  distrito: { nombre: string };
  latitud?: number;
  longitud?: number;
  tipoCancha: string;
}

interface MapComponentProps {
  canchas: Cancha[];
}

export default function MapComponent({ canchas }: MapComponentProps) {
  // Centro por defecto (Lima, Perú)
  const defaultCenter: [number, number] = [-12.0464, -77.0428];

  // Si hay canchas, centrar en la primera
  const center: [number, number] = canchas.length > 0 && canchas[0].latitud && canchas[0].longitud
    ? [canchas[0].latitud, canchas[0].longitud]
    : defaultCenter;

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {canchas.map((cancha) => {
          if (!cancha.latitud || !cancha.longitud) return null;

          return (
            <Marker
              key={cancha.id}
              position={[cancha.latitud, cancha.longitud]}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold mb-1">{cancha.nombre}</h3>
                  <p className="text-xs text-gray-600">{cancha.ciudad.nombre} - {cancha.distrito.nombre}</p>
                  <p className="text-xs text-gray-600">{cancha.direccion}</p>
                  <p className="text-xs mt-1">
                    <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                      {cancha.tipoCancha}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
