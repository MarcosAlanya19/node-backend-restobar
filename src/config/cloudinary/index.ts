import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dltl0daa4',
  api_key: '597151455151464',
  api_secret: 'qCHkjF1j-mFNUdRqSAljYzu78CM',
  secure: true,
});

export async function uploadImg(filePath: string): Promise<any> {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'replit',
  });
}

export async function deleteImg(publicId: string): Promise<any> {
  return await cloudinary.upload.destroy(publicId)
}
