import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Process each file
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Convert buffer to base64
      const base64String = buffer.toString('base64');
      const dataURI = `data:${file.type};base64,${base64String}`;
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          dataURI,
          {
            folder: 'amex',
            resource_type: 'auto',
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
      
      return result;
    });

    const uploadResults = await Promise.all(uploadPromises);
    const secureUrls = uploadResults.map((result: any) => result.secure_url);

    return NextResponse.json({ 
      success: true, 
      urls: secureUrls 
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}