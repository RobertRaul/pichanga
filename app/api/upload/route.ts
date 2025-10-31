import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const canchaId = formData.get('canchaId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!canchaId) {
      return NextResponse.json({ error: 'No canchaId provided' }, { status: 400 });
    }

    // Subir imagen a Supabase
    const publicUrl = await uploadImage(file, canchaId);

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
