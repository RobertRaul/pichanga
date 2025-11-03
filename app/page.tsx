'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CanchaModal from '@/components/CanchaModal';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">Cargando mapa...</div>
});

interface Ciudad {
  id: string;
  nombre: string;
}

interface Distrito {
  id: string;
  nombre: string;
}

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
  fotos: Array<{ url: string; principal: boolean }>;
}

export default function HomePage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [selectedCancha, setSelectedCancha] = useState<Cancha | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    ciudadId: '',
    distritoId: '',
    techada: '',
    tipoCancha: '',
    deporte: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCiudades();
    fetchCanchas();
  }, []);

  useEffect(() => {
    if (filters.ciudadId) {
      fetchDistritos(filters.ciudadId);
    } else {
      setDistritos([]);
    }
  }, [filters.ciudadId]);

  useEffect(() => {
    fetchCanchas();
  }, [filters]);

  const fetchCiudades = async () => {
    const res = await fetch('/api/ciudades');
    const data = await res.json();
    setCiudades(data);
  };

  const fetchDistritos = async (ciudadId: string) => {
    const res = await fetch(`/api/distritos?ciudadId=${ciudadId}`);
    const data = await res.json();
    setDistritos(data);
  };

  const fetchCanchas = async () => {
    const params = new URLSearchParams();
    if (filters.ciudadId) params.append('ciudadId', filters.ciudadId);
    if (filters.distritoId) params.append('distritoId', filters.distritoId);
    if (filters.techada) params.append('techada', filters.techada);
    if (filters.tipoCancha) params.append('tipoCancha', filters.tipoCancha);
    if (filters.deporte) params.append('deporte', filters.deporte);

    const res = await fetch(`/api/canchas?${params}`);
    const data = await res.json();
    setCanchas(data);
    setLoading(false);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'ciudadId' && { distritoId: '' }) // Reset distrito si cambia ciudad
    }));
  };

  const clearFilters = () => {
    setFilters({
      ciudadId: '',
      distritoId: '',
      techada: '',
      tipoCancha: '',
      deporte: ''
    });
  };

  const activeFiltersCount = [filters.ciudadId, filters.distritoId, filters.techada, filters.tipoCancha, filters.deporte].filter(f => f).length;

  return (
    <div>
      <CanchaModal cancha={selectedCancha} onClose={() => setSelectedCancha(null)} />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Organiza tu Reto!
          </h1>
          <p className="text-gray-600 text-lg">Busca, descubre y reserva en las mejores canchas</p>
        </div>

        {/* Barra de búsqueda rápida */}
        <div className="mb-6">
          <div className="flex gap-3 flex-wrap">
            {/* Ciudad */}
            <select
              value={filters.ciudadId}
              onChange={(e) => handleFilterChange('ciudadId', e.target.value)}
              className="input-field flex-1 min-w-[200px]"
            >
              <option value="">Selecciona tu ciudad</option>
              {ciudades.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            {/* Distrito */}
            {filters.ciudadId && (
              <select
                value={filters.distritoId}
                onChange={(e) => handleFilterChange('distritoId', e.target.value)}
                className="input-field flex-1 min-w-[200px]"
              >
                <option value="">Todos los distritos</option>
                {distritos.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            )}

            {/* Botón de filtros avanzados */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-primary relative"
            >
              {showFilters ? 'Cerrar' : 'Filtros'}
              {activeFiltersCount > 0 && !showFilters && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filtros avanzados (colapsables) */}
        {showFilters && (
          <div className="card mb-6 animate-slideDown">
            <h3 className="font-bold mb-4 text-lg">Filtros Avanzados</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Deporte</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('deporte', filters.deporte === 'futbol' ? '' : 'futbol')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.deporte === 'futbol'
                        ? 'bg-green-100 border-green-500 text-green-700 font-bold'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    Fútbol
                  </button>
                  <button
                    onClick={() => handleFilterChange('deporte', filters.deporte === 'voley' ? '' : 'voley')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.deporte === 'voley'
                        ? 'bg-orange-100 border-orange-500 text-orange-700 font-bold'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    Vóley
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tamaño</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('tipoCancha', filters.tipoCancha === '6v6' ? '' : '6v6')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.tipoCancha === '6v6'
                        ? 'bg-primary-100 border-primary-500 text-primary-700 font-bold'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    6v6
                  </button>
                  <button
                    onClick={() => handleFilterChange('tipoCancha', filters.tipoCancha === '8v8' ? '' : '8v8')}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      filters.tipoCancha === '8v8'
                        ? 'bg-primary-100 border-primary-500 text-primary-700 font-bold'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    8v8
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Techada</label>
                <button
                  onClick={() => handleFilterChange('techada', filters.techada === 'true' ? '' : 'true')}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${
                    filters.techada === 'true'
                      ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  Solo techadas
                </button>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="btn-secondary text-sm w-full">
                Limpiar todos los filtros
              </button>
            )}
          </div>
        )}

        {/* Resultados */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            {loading ? 'Cargando...' : `${canchas.length} cancha${canchas.length !== 1 ? 's' : ''} encontrada${canchas.length !== 1 ? 's' : ''}`}
          </h2>
        </div>

        {/* Mapa */}
        {canchas.some(c => c.latitud && c.longitud) && (
          <div className="mb-8">
            <MapComponent canchas={canchas.filter(c => c.latitud && c.longitud)} />
          </div>
        )}

        {/* Listado de canchas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canchas.map((cancha) => {
          const googleMapsUrl = cancha.latitud && cancha.longitud
            ? `https://www.google.com/maps/search/?api=1&query=${cancha.latitud},${cancha.longitud}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cancha.direccion + ', ' + cancha.ciudad.nombre)}`;

          return (
            <div
              key={cancha.id}
              className="card hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
              onClick={() => setSelectedCancha(cancha)}
            >
              {/* Imagen */}
              <div className="mb-4 relative overflow-hidden rounded-lg">
                {cancha.fotos?.[0] ? (
                  <img
                    src={cancha.fotos[0].url}
                    alt={cancha.nombre}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth={2}/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 1010 10M12 2v20" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Ver detalles
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <h3 className="font-bold text-xl mb-2 group-hover:text-primary-600 transition-colors">{cancha.nombre}</h3>
              <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                {cancha.ciudad.nombre} - {cancha.distrito.nombre}
              </p>
              <p className="text-sm text-gray-600 mb-3">{cancha.direccion}</p>

              {cancha.descripcion && (
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{cancha.descripcion}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">
                  {cancha.tipoCancha}
                </span>
                {cancha.techada && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Techada
                  </span>
                )}
                {cancha.aceptaFutbol && (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    Fútbol
                  </span>
                )}
                {cancha.aceptaVoley && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                    Vóley
                  </span>
                )}
                {cancha.aceptaEventos && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    Eventos
                  </span>
                )}
              </div>

              {/* Botón Google Maps - detiene la propagación */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Cómo llegar
              </a>
            </div>
          );
        })}

        {canchas.length === 0 && !loading && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-2xl font-bold mb-2">No se encontraron canchas</p>
            <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
