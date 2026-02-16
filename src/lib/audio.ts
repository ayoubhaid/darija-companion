import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function uploadAudioFile(
  file: File,
  userId: string
): Promise<string> {
  if (USE_MOCK_DATA) {
    console.warn('Audio upload not available in mock data mode');
    return '';
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-audio', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
}

export async function deleteAudioFile(audioUrl: string): Promise<void> {
  if (USE_MOCK_DATA || !audioUrl) return;

  try {
    const { ref: storageRef } = await import('firebase/storage');
    const fileRef = storageRef(storage, audioUrl);
    const { deleteObject } = await import('firebase/storage');
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting audio:', error);
  }
}
