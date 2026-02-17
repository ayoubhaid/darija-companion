import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Fetch the URL to get metadata
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DarijaCompanion/1.0)',
      },
    });

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract image
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    let image = ogImageMatch ? ogImageMatch[1].trim() : '';

    // Make image absolute if relative
    if (image && !image.startsWith('http')) {
      image = new URL(image, parsedUrl.origin).href;
    }

    return NextResponse.json({
      success: 1,
      meta: {
        title,
        description,
        image,
        url,
      },
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { success: 0, error: 'Failed to fetch URL' },
      { status: 500 }
    );
  }
}
