import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

    const uploadFormData = new FormData();
    uploadFormData.append('file', new Blob([buffer], { type: file.type }));
    uploadFormData.append('upload_preset', 'darija-companion-audio');
    uploadFormData.append('folder', 'darija-companion/audio');

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
