/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import cloudinary from 'cloudinary';

// import Env from '@ioc:Adonis/Core/Env';

import env from '#start/env'

import type { MultipartFile } from '@adonisjs/core/bodyparser'

type CloudinaryResourceType = 'image' | 'video' | 'raw' | 'auto';

// Define a type for the parameters to make the function signature clear
interface SignatureParams {
  folder: string;
  resource_type?: string;
  public_id?: string;
  timestamp?: number;
  'X-Unique-Upload-Id'?: string; 
}


export default class UploadService {
  

  // Initialize Cloudinary with your credentials from the environment variables
  constructor() {
    cloudinary.v2.config({
      cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
      api_key: env.get('CLOUDINARY_API_KEY'),
      api_secret: env.get('CLOUDINARY_SECRET'),
      secure: true,
    });
  }

  /**
   * Generates a Cloudinary signature for direct and chunked uploads.
   *
   * @param params - The parameters required for the signature.
   * @returns An object containing the signature and timestamp.
   */
  public generateUploadSignature(params: SignatureParams) {
    const { 
      folder, 
      // resource_type, 
      public_id, 
      timestamp, 
      // 'X-Unique-Upload-Id': XUniqueUploadId 
    } = params;

    // This object contains all the parameters that need to be signed.
    // It's crucial that this object matches the parameters sent in the upload request.
    const params_to_sign: { [key: string]: any } = {
      timestamp: timestamp,
      folder: folder,
      public_id: public_id,
      // resource_type: resource_type,
    };
    console.log(params_to_sign);
    

    // Conditionally add the unique upload ID.
    // This parameter is required for chunked uploads and must be signed.
    // if (XUniqueUploadId) {
    //   params_to_sign['X-Unique-Upload-Id'] = XUniqueUploadId;
    // }

    // Use Cloudinary's utility to generate the signature
    const signature = cloudinary.v2.utils.api_sign_request(
      params_to_sign,
      env.get('CLOUDINARY_SECRET') ?? ''
    );

    // Return the required data to the client
    return {
      signature: signature,
      timestamp: timestamp,
      apiKey: env.get('CLOUDINARY_API_KEY'),
      cloudName: env.get('CLOUDINARY_CLOUD_NAME'),
      folder:folder,
      public_id:public_id,
      // 'X-Unique-Upload-Id':XUniqueUploadId
    };
  }

    /**
     * Uploads a file to Cloudinary (for non-chunked uploads like images or smaller videos).
     * @param file The file object from AdonisJS request.
     * @param folder The folder name in Cloudinary.
     * @param resourceType The type of resource.
     * @returns The secure URL of the uploaded file, or null.
    */
    // public async uploadFile(
    //   file: MultipartFile,
    //   folder: string,
    //   resourceType: CloudinaryResourceType = 'auto'
    // ): Promise<string | null> {
    //   if (!file || !file.tmpPath) {
    //     console.error('No file or temporary path provided for upload.')
    //     return null
    //   }
  
    //   try {
    //     const result = await cloudinary.v2.uploader.upload(file.tmpPath, {
    //       folder: folder,
    //       resource_type: resourceType,
    //     })
    //     return result.secure_url
    //   } catch (error) {
    //     console.error('Error uploading file to Cloudinary:', error)
    //     return null
    //   }
    // }

    public async uploadFile(
      file: MultipartFile,
      folder: string,
      resourceType: CloudinaryResourceType = 'auto'
    ): Promise<string | null> {
      if (!file || !file.tmpPath) {
        console.error('No file or temporary path provided for upload.')
        return null
      }
  
      try {
        const result = await cloudinary.v2.uploader.upload(file.tmpPath, {
        folder,
        resource_type: resourceType,

        transformation: resourceType === 'image'
          ? [{
              width: 1600,          // prevent huge uploads
              height: 1600,
              crop: 'limit',
              quality: 'auto:good', // controlled compression (not too aggressive)
              fetch_format: 'auto'
            }]
          : undefined,

        // Optional but useful
        chunk_size: resourceType === 'video' ? 6000000 : undefined,
      })
        return result.secure_url
      } catch (error) {
        console.error('Error uploading file to Cloudinary:', error)
        return null
      }
    }


  /**
   * Extracts the public ID from a Cloudinary URL.
   * @param url The Cloudinary URL.
   * @returns The public ID or null.
  */
  public extractPublicIdFromUrl(url: string): string | null {
    try {
      const parts = url.split('/')
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
        return null;
      }
      const publicIdWithFolder = parts.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithFolder.split('.')[0];
      return publicId;
    } catch (error) {
      console.error('Error extracting public ID from URL:', error);
      return null;
    }
  }


  /**
   * Deletes a file from Cloudinary using its public ID.
   * @param publicId The public ID of the file on Cloudinary.
   * @param resourceType The type of resource being deleted.
   * @returns True if deletion was successful, false otherwise.
   */
  public async deleteFile(publicId: string, resourceType: CloudinaryResourceType ): Promise<boolean> {
    try {
      const result = await cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType })
      return result.result === 'ok'
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error)
      return false
    }
  }
}

