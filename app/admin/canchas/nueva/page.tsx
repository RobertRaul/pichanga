'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

interface Ciudad {
    id: string;
    nombre: string;
}

interface Distrito {
    id: string;
    nombre: string;
}

export default function NuevaCanchaPage() {
    const router = useRouter();
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [distritos, setDistritos] = useState<Distrito[]>([]);
    const [fotosFiles, setFotosFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        ciudadId: '',
        distritoId: '',
        direccion: '',
        latitud: '',
        longitud: '',
        googleMapsUrl: '',
        techada: false,
        aceptaEventos: false,
        aceptaFutbol: true,
        aceptaVoley: false,
        tipoCancha: '6v6',
        descripcion: '',
        telefono1: '',
        telefono2: '',
        telefono3: '',
        horarioInicio: '08:00',
        horarioFin: '22:00',
        diasAtencion: 'Lunes a Domingo'
    });

    useEffect(() => {
        fetchCiudades();
    }, []);

    useEffect(() => {
        if (formData.ciudadId) {
            fetchDistritos(formData.ciudadId);
        }
    }, [formData.ciudadId]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const payload = {
                ...formData,
                latitud: formData.latitud ? parseFloat(formData.latitud) : null,
                longitud: formData.longitud ? parseFloat(formData.longitud) : null,
            };

            const res = await fetch('/api/canchas', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const cancha = await res.json();

                // Subir fotos a Supabase si hay
                if (fotosFiles.length > 0) {
                    const uploadedUrls = await Promise.all(
                        fotosFiles.map(async (file) => {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('canchaId', cancha.id);

                            const uploadRes = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData
                            });

                            if (uploadRes.ok) {
                                const {url} = await uploadRes.json();
                                return url;
                            }
                            return null;
                        })
                    );

                    // Guardar URLs en la base de datos
                    const validUrls = uploadedUrls.filter(url => url !== null);
                    await Promise.all(
                        validUrls.map((url, index) =>
                            fetch('/api/fotos', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    canchaId: cancha.id,
                                    url: url,
                                    principal: index === 0
                                })
                            })
                        )
                    );
                }

                router.push('/admin/canchas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear la cancha');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setFotosFiles(prev => [...prev, ...filesArray]);
        }
    };

    const removeFoto = (index: number) => {
        setFotosFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Nueva Cancha Deportiva</h1>

            <form onSubmit={handleSubmit} className="card space-y-6">

                {/* Información Básica */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4">Información Básica</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nombre de la Cancha</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Ciudad</label>
                            <select
                                name="ciudadId"
                                value={formData.ciudadId}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="">Seleccione ciudad</option>
                                {ciudades.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Distrito</label>
                            <select
                                name="distritoId"
                                value={formData.distritoId}
                                onChange={handleChange}
                                className="input-field"
                                required
                                disabled={!formData.ciudadId}
                            >
                                <option value="">Seleccione distrito</option>
                                {distritos.map(d => (
                                    <option key={d.id} value={d.id}>{d.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            className="input-field"
                            rows={3}
                            placeholder="Información adicional sobre la cancha..."
                        />
                    </div>
                </div>

                {/* Ubicación */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4">Ubicación</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Enlace de Google Maps</label>
                        <input
                            type="url"
                            name="googleMapsUrl"
                            value={formData.googleMapsUrl}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="https://maps.google.com/..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Pega el enlace completo de Google Maps</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Latitud (opcional)</label>
                            <input
                                type="number"
                                step="any"
                                name="latitud"
                                value={formData.latitud}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="-12.0464"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Longitud (opcional)</label>
                            <input
                                type="number"
                                step="any"
                                name="longitud"
                                value={formData.longitud}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="-77.0428"
                            />
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4">Información de Contacto</h2>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Teléfono 1</label>
                            <input
                                type="tel"
                                name="telefono1"
                                value={formData.telefono1}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="999 999 999"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Teléfono 2</label>
                            <input
                                type="tel"
                                name="telefono2"
                                value={formData.telefono2}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="999 999 999"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Teléfono 3</label>
                            <input
                                type="tel"
                                name="telefono3"
                                value={formData.telefono3}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="999 999 999"
                            />
                        </div>
                    </div>
                </div>

                {/* Horario */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4">Horario de Atención</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Días de Atención</label>
                        <select
                            name="diasAtencion"
                            value={formData.diasAtencion}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="Lunes a Domingo">Lunes a Domingo</option>
                            <option value="Lunes a Viernes">Lunes a Viernes</option>
                            <option value="Lunes a Sábado">Lunes a Sábado</option>
                            <option value="Sábado y Domingo">Sábado y Domingo</option>
                        </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Hora de Apertura</label>
                            <input
                                type="time"
                                name="horarioInicio"
                                value={formData.horarioInicio}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Hora de Cierre</label>
                            <input
                                type="time"
                                name="horarioFin"
                                value={formData.horarioFin}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Características */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-bold mb-4">Características</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Tipo de Cancha</label>
                        <select
                            name="tipoCancha"
                            value={formData.tipoCancha}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="6v6">6 vs 6</option>
                            <option value="8v8">8 vs 8</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="techada"
                                checked={formData.techada}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Cancha techada</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="aceptaFutbol"
                                checked={formData.aceptaFutbol}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Acepta fútbol</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="aceptaVoley"
                                checked={formData.aceptaVoley}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Acepta vóley</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="aceptaEventos"
                                checked={formData.aceptaEventos}
                                onChange={handleChange}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-medium">Acepta eventos</span>
                        </label>
                    </div>
                </div>

                {/* Fotos */}
                <div className="pb-6">
                    <h2 className="text-xl font-bold mb-4">Fotos</h2>
                    <p className="text-sm text-gray-600 mb-4">Sube imágenes de la cancha (máx 10MB por imagen)</p>

                    <div className="mb-4">
                        <label className="block">
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 cursor-pointer transition-colors">
                                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                                <span className="text-sm text-gray-600">Click para seleccionar imágenes</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </label>
                    </div>

                    {/* Preview de fotos seleccionadas */}
                    {fotosFiles.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                            {fotosFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFoto(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                    {index === 0 && (
                                        <span
                                            className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                    <button type="submit" className="btn-primary flex-1" disabled={uploading}>
                        {uploading ? 'Subiendo imágenes...' : 'Crear Cancha'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-secondary"
                        disabled={uploading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
