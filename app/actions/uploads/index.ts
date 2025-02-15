"use server"
import { Bucket, s3 } from "@/app/configs/awsConfig";
import prisma from "@/prisma/prismaClient";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { contentType } from "@/lib/contentTypes";
import fs from 'fs';
import path from 'path';


const TEMP_STORAGE = '/tmp/uploads'; // Temporary storage for chunks

export const uploadFileAws = async (formData: FormData) => {
    const session = await getServerSession();
    if (!session) return { success: false, message: 'User unauthenticated' };

    // Extracting form data
    const chunk = formData.get('chunk') as Blob;
    const chunkNumber = Number(formData.get('chunkNumber'));
    const totalChunks = Number(formData.get('totalChunks'));
    const fileName = formData.get('fileName') as string;
    const fileSize = Number(formData.get('fileSize'));

    if (!chunk || !fileName) return { success: false, message: 'Invalid file data' };

    // Check user storage quota
    const user = await prisma.user.findUnique({
        where: { email: session.user?.email || '' },
    });

    if (!user) return { success: false, message: 'User not found' };

    const expectedStorage = Number(user.currentSpace) + fileSize;
    if (expectedStorage > Number(user.totalSpace)) {
        return { success: false, message: 'Not enough storage' };
    }

    try {
        const fileBuffer = Buffer.from(await chunk.arrayBuffer());
        const fileExtension = fileName.split('.').pop()?.toLowerCase() ?? 'unknown';

        // Ensure temp directory exists
        if (!fs.existsSync(TEMP_STORAGE)) {
            fs.mkdirSync(TEMP_STORAGE, { recursive: true });
        }

        // Save chunk locally
        const chunkPath = path.join(TEMP_STORAGE, `${fileName}.part${chunkNumber}`);
        fs.writeFileSync(chunkPath, fileBuffer);

        // If it's the last chunk, merge and upload
        if (chunkNumber + 1 === totalChunks) {
            try {
                await mergeChunks(fileName, totalChunks, fileExtension);

                // Transaction: Update database only if S3 upload succeeds
                try {
                  await prisma.$transaction([
                    prisma.uploads.create({
                        data: {
                            fileKey: fileName,
                            uploadDate: new Date().toISOString(),
                            fileType: fileExtension,
                            userEmail: session.user?.email || '',
                        },
                    }),
                    prisma.user.update({
                        where: { email: session.user?.email || '' },
                        data: {
                            currentSpace: { increment: BigInt(fileSize) },
                            recents: { create: { uploadType: fileExtension } },
                        },
                    }),
                ]);
                } catch (error) {
                  console.log(error,'error in doing trasaction.....db........')
                }

                return { success: true, isCompleted: true, message: 'Uploaded successfully' };
            } catch (error) {
                console.error('Error in merging/uploading:', error);
                return { success: false, message: 'Upload failed' };
            }
        }

        return { success: true, isCompleted: false , message: `Chunk ${chunkNumber + 1}/${totalChunks} received` };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Internal server error' };
    }
};

// Merge chunks and upload to S3
async function mergeChunks(fileKey: string, totalChunks: number, fileExt: string) {
    try {
        const chunkBuffers: Buffer[] = [];

        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(TEMP_STORAGE, `${fileKey}.part${i}`);
            if (!fs.existsSync(chunkPath)) {
                throw new Error(`Missing chunk: ${chunkPath}`);
            }
            chunkBuffers.push(fs.readFileSync(chunkPath));
        }

        const mergedBuffer = Buffer.concat(chunkBuffers);

        await s3.send(new PutObjectCommand({
            Bucket: Bucket,
            Key: fileKey,
            Body: mergedBuffer,
            ContentType: contentType[fileExt] || 'application/octet-stream',
        }));

        // Cleanup temporary files
        for (let i = 0; i < totalChunks; i++) {
            fs.unlinkSync(path.join(TEMP_STORAGE, `${fileKey}.part${i}`));
        }

    } catch (error) {
        console.error('Error merging/uploading:', error);
        throw error; // Ensure failure is propagated
    }
}



//delete file from storage
export const deleteFileAws = async (toDelfileKey: string, fileId: string) => {
  //check auth
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
  }
  }
  //move files to bin
  try {
     await prisma.uploads.update({
      where: {
        id: fileId, // Identify the record by its ID
      },
      data: {
        deleted: true, // Set the `deleted` field to `true`
        deleteDate: new Date(), // Optionally set the `deleteDate`
      },
    });
    console.log('file deleted...........')
  } catch (error) {
    console.log(error,'error in moving files to bin')
    return {
      success: false,
      message: 'cant move file to bin'
    }
  }
  //deleting file from aws 
  // try {
  //   //first delete file from aws
  //    await s3.send(new DeleteObjectCommand({ 
  //     Bucket: process.env.AWS_BUCKET_NAME,
  //      Key: toDelfileKey }));
  // } catch (error) {
  //   console.log(error,'error in del obj aws')
  //   return {
  //     success: false,
  //     message: 'unable to delete file'
  // }
  // }

  //return res
  return{
    success: true,
    message: 'file deleted success'
  }
}

//get all uploads by email
export const fetchAllUploads = async () => {
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
  }
  }
  try {
    //fetch only those uploads which are not deleted
    //or whose status are not deleted
    const uploadsMetaData = await prisma.uploads.findMany({
      where:{
        userEmail: session.user?.email || '',
        deleted: false
      },
    })
    if(!uploadsMetaData || uploadsMetaData.length == 0){
      return {
        success: false,
        message: 'no uploads found'
    }
    }
    //return res
    return {
      success: true,
      message: 'Fetched all uploads with signed URL',
      uploads: {
        uploadsMetaData,          //optimise this in simple reutrn uploadmetadata directly
      }
    };
  } catch (error) {
    console.log(error,'error in fetching uplods')
    return {
      success: false,
      message: 'cant fetch uploads'
  }
  }
}

//get signed urls
const S3_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN; 

export const fetchSignedUrl = async (fileKey: string, downloadable: boolean = false) => {
  const session = await getServerSession();
  if (!session) {
    return { success: false, message: 'User unauthenticated' };
  }

  if (!fileKey) {
    return { success: false, message: 'File key missing' };
  }

  try {
    if (!downloadable) {
      if (!CLOUDFRONT_DOMAIN) {
        throw new Error('CloudFront domain not set in environment variables');
      }

      // Construct the CloudFront URL
      const cloudfrontUrl = `${CLOUDFRONT_DOMAIN}/${encodeURIComponent(fileKey)}`;

      return {
        success: true,
        signedUrl: cloudfrontUrl,
      };
    }

    // Generate signed S3 URL for downloading
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: fileKey,
      ResponseContentDisposition: 'attachment', // Force download
    });

    const signedUrl = await getSignedUrl(s3, command);

    return { success: true, signedUrl };
  } catch (error) {
    console.error("Can't get signed URL:", error);
    return { success: false, message: 'Error fetching file URL' };
  }
};




//add to starred 
export const addToStarred = async (fileId: string) => {
  //check auth
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
  }
  }
  try {
    //find first then update 
    const uploadFile = await prisma.uploads.findFirst({
      where: {
        id: fileId
      }
    })
     await prisma.uploads.update({
      where: {
        id: fileId
      },
      data:{
        starred: !uploadFile?.starred
      }
    })
    //return res
    return({
      success: true,
      message: 'updated starred successfully'
    })
  } catch (error) {
    console.log(error,'error in updating starred file')
    return {
      success: false,
      message: 'internal server error'
  }
  }
}

//adding shared file to non-owner space
export const addFileToSpace = async (fileId: string, acceptingUser: string) => {
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'unauhtenticated user'
    }
  }
  try {

    const updatedUserUploads = await prisma.user.update({
      where: {
        email: acceptingUser || ''
      },
      data: {
        uploads: {
          //fix user which adds file to there own space gets owner
          // email as their own eamil instaed of owners email
          connect: {id: fileId}         
        }
      },
      include: {
        uploads: true
      }
    })
    if(!updatedUserUploads){
      return {
        success: false,
        message: 'cant update the uploads'
      }
    }
    //return res
    return {
      success: true,
      message: 'file added succesfully'
    }
  } catch (error) {
    console.log(error,'error in adding share file to non-owner space')
    return {
      success: false,
      message: 'internal server error'
    }
  }
}

//get bin files of user
export const getBinFiles = async () => {
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
    }
  }
  try {
    const deletedUploads = await prisma.user.findUnique({
      where: { 
        email: session.user?.email || ''
       },
      select: {
        uploads: {
          where: { deleted: true },
        },
      },
    });
    //return responce with files
    return {
      success: true,
      binFiles: deletedUploads?.uploads
      
    }
  } catch (error) {
    console.log(error,'error in getting bin files')
  }
}

//hanlding file restoration
export const restoreFile = async (fileId: string) => {
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
    }
  }

  try {
    // Update the upload's delete status
    const restoredFile = await prisma.uploads.updateMany({
      where: {
        id: fileId,
        userEmail: session.user?.email || '',
      },
      data: {
        deleted: false,
        deleteDate: new Date(), // Sets the delete date
      },
    });

    if (restoredFile.count === 0) {
      return {
        success: false,
        message: `Upload with ID ${fileId} not found or does not belong to the user.`
      }
    }
    //return res
    return {
      success: true,
      message: 'restored successfull'
    }
  } catch (error) {
    console.log(error,'error in restoring file to db')
  }
}

//get shared file
export const getShareFile = async (fileId: string) => {
  try {
    const session = await getServerSession()
    if(!session){
        return {
            success: false,
            message: "user unauthenticated"
        }
    }
    let file;
    let signedUrl;
    try {
        file = await prisma.uploads.findUnique({
            where: {
                id: fileId
            }
        })
        if(!file){
            console.log('file not found')
            return{
              success: false,
              message: 'file not found'
            }
        }
        signedUrl = await fetchSignedUrl(file?.fileKey || '')
        if(!signedUrl){
          return {
            success: false,
            message: 'cant get signed url of file'
          }
        }
        //return res
        return {
          success: true,
          message: 'file signed url fetch',
          signedUrl,
          fileDetails: file
        }
    } catch (error) {
        console.log(error,'error in fetching file shared')
    }
  } catch (error) {
    console.log(error,'error in getting shared file')
    return {
      success: false,
      message: 'internal server error'
    }
  }
}