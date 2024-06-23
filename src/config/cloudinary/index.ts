import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dltl0daa4',
  api_key: '597151455151464',
  api_secret: 'qCHkjF1j-mFNUdRqSAljYzu78CM',
  secure: true,
});

export async function uploadImg(filePath: string): Promise<any> {
  try {
    return await cloudinary.uploader.upload(filePath, {
      folder: 'replit',
      quality: "auto"
    });
  } catch (error) {
    console.log({error})
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function deleteImg(publicId: string): Promise<any> {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export async function updateImg(publicId: string, filePath: string): Promise<any> {
  try {
    await deleteImg(publicId);
    return await uploadImg(filePath);
  } catch (error) {
    console.error('Error updating image on Cloudinary:', error);
    throw new Error('Failed to update image on Cloudinary');
  }
}
