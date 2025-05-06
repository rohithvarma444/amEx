/**
 * Uploads multiple images to the server, which then uploads them to Cloudinary
 * @param files - Array of files to upload
 * @returns Promise with an array of secure URLs from Cloudinary
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  try {
    const formData = new FormData();
    
    // Append each file to the FormData
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Send to our API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload images');
    }
    
    const data = await response.json();
    return data.urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw new Error('Failed to upload images');
  }
}

/**
 * Uploads a single image to the server
 * @param file - The file to upload
 * @param folder - Optional folder name (handled on the server)
 * @returns Promise with the secure URL from Cloudinary
 */
export async function uploadImage(file: File, folder?: string): Promise<string> {
  const urls = await uploadImages([file]);
  return urls[0];
}