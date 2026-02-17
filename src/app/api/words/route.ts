import { NextResponse } from 'next/server';
import { getAllVocabulary } from '@/lib/firestore';

export async function GET() {
  try {
    const vocabulary = await getAllVocabulary();
    const words = vocabulary.map((item: any) => ({
      id: item.id,
      darija: item.word,
      english: item.translation,
    }));
    return NextResponse.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
  }
}
