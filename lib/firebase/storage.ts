import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
  UploadResult,
  UploadTask,
  UploadMetadata,
} from 'firebase/storage';
import { storage } from './config';

// ==================== Storage Helper Functions ====================

/**
 * Upload a file to Firebase Storage
 * @param path - Storage path (e.g., 'images/profile.jpg')
 * @param file - File or Blob to upload
 * @param metadata - Optional upload metadata
 * @returns Promise with download URL
 */
export const uploadFile = async (
  path: string,
  file: File | Blob,
  metadata?: UploadMetadata
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload a file with progress tracking
 * @param path - Storage path
 * @param file - File or Blob to upload
 * @param onProgress - Progress callback (percentage: 0-100)
 * @param metadata - Optional upload metadata
 * @returns Promise with download URL
 */
export const uploadFileWithProgress = (
  path: string,
  file: File | Blob,
  onProgress?: (progress: number) => void,
  metadata?: UploadMetadata
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Get download URL for a file
 * @param path - Storage path
 * @returns Promise with download URL
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

/**
 * Delete a file from storage
 * @param path - Storage path
 * @returns Promise<void>
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    return await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * List all files in a directory
 * @param path - Directory path
 * @returns Promise with array of storage references
 */
export const listFiles = async (path: string): Promise<StorageReference[]> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result.items;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Upload multiple files
 * @param files - Array of files with their paths
 * @returns Promise with array of download URLs
 */
export const uploadMultipleFiles = async (
  files: Array<{ path: string; file: File | Blob; metadata?: UploadMetadata }>
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(({ path, file, metadata }) =>
      uploadFile(path, file, metadata)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Delete multiple files
 * @param paths - Array of storage paths
 * @returns Promise<void>
 */
export const deleteMultipleFiles = async (paths: string[]): Promise<void> => {
  try {
    const deletePromises = paths.map((path) => deleteFile(path));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple files:', error);
    throw error;
  }
};

// ==================== Exports ====================
export {
  storage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
};

export type {
  StorageReference,
  UploadResult,
  UploadTask,
  UploadMetadata,
};

