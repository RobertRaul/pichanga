import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para subir imagen
export async function uploadImage(file: File, canchaId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${canchaId}-${Date.now()}.${fileExt}`;
  const filePath = `canchas/${fileName}`;

  const { data, error } = await supabase.storage
    .from('cancha-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`);
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('cancha-photos')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Función para eliminar imagen
export async function deleteImage(url: string): Promise<void> {
  // Extraer el path de la URL
  const path = url.split('/cancha-photos/')[1];

  if (!path) return;

  const { error } = await supabase.storage
    .from('cancha-photos')
    .remove([path]);

  if (error) {
    console.error('Error deleting image:', error);
  }
}
