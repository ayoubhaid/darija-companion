import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'image';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    // Use a single upload preset for all file types
    const config = {
      image: {
        folder: 'darija-companion/images',
        preset: 'darija-companion',
        resource: 'image',
      },
      audio: {
        folder: 'darija-companion/audio',
        preset: 'darija-companion',
        resource: 'raw',
      },
      file: {
        folder: 'darija-companion/files',
        preset: 'darija-companion',
        resource: 'raw',
      },
    };

    const cfg = config[type as keyof typeof config] || config.image;
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${cfg.resource}/upload`;

    const uploadFormData = new FormData();
    uploadFormData.append('file', new Blob([buffer], { type: file.type }));
    uploadFormData.append('upload_preset', cfg.preset);
    uploadFormData.append('folder', cfg.folder);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudinary error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
