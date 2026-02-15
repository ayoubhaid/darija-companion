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
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, `audio/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
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
