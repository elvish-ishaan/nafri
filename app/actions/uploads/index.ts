"use server"
import { Bucket, s3 } from "@/app/configs/awsConfig";
import prisma from "@/prisma/prismaClient";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { contentType } from "@/lib/contentTypes";


export const uploadFileAws = async (formData: FormData) => {
    //check auth
    const session = await getServerSession()

    if(!session){
      return {
        success: false,
        message: 'user unauthenticated'
    }
    }
    //do upload operations
    const file = formData.get("file") as File;
    if (!file) return;
    const fileName = file.name

    //check storage operation like is user able to upload according to his assingned storage
      const user = await prisma.user.findUnique({
        where: {
          email: session.user?.email || "",
        }
      });

      //compare storage
      const expectedStorage = Number(user?.currentSpace) + file.size;
      if( expectedStorage > Number( user?.totalSpace) ) {
        return {
          success: false,
          message: 'Not enough storage'
      }
      }
    try {
      let fileExtension:(string | undefined)
      try {
        //get the extension of the uploaded file
         fileExtension = fileName.split('.').pop()?.toLowerCase() ?? 'unknown';
        //conver file to buffer before uploading
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const uploadToS3 = new PutObjectCommand({
            Bucket,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType[fileExtension] || 'application/octet-stream' // Default to binary data
          });
          await s3.send(uploadToS3);
      } catch (error) {
        console.log(error,'error in uploading to aws')
        return {
          success: false,
          message: 'unable to upload file'
      }
      }
      //save metadata to database
      try {
        await prisma.$transaction([
          // Create file upload entry
          prisma.uploads.create({
            data: {
              fileKey: fileName,
              uploadDate: new Date().toISOString(),
              fileType: fileExtension,
              userEmail: session.user?.email || '',
            },
          }),
        
          // Update user storage
          prisma.user.update({
            where: {
              email: session.user?.email || "",
            },
            data: {
              //increase (add to existing) storage
              currentSpace: {
                increment: file.size, 
              },
              //update recents
              recents: {
                create: {
                  uploadType: fileExtension,
                }
              }
            },
          }),
        ]);
        return {
            success: true,
            message: "uploaded successfully"
        }
      } catch (error) {
        console.log(error,'error in saving metadata to db')
        return {
          success: false,
          message: 'some problem occur'
      }
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'internal server error'
    }
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
    const updatedUpload = await prisma.uploads.update({
      where: {
        id: fileId, // Identify the record by its ID
      },
      data: {
        deleted: true, // Set the `deleted` field to `true`
        deleteDate: new Date(), // Optionally set the `deleteDate`
      },
    });
    console.log(updatedUpload,'this si updload after del')
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
  //     Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
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
export const fetchSignedUrl = async (fileKey: string, downloadable?: boolean) => {
  //authentication check
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
  }
  }
  if(!fileKey){
    return {
      success: false,
      message: 'file key missing'
  }
  }
  try {
      // Create a command for getting the object
      const command = new GetObjectCommand({
        Bucket,
        Key: fileKey || '',
        ResponseContentDisposition: downloadable ? 'attachment' : 'inline'
      });
 
      // Get the pre-signed URL
      const signedUrl = await getSignedUrl(s3, command);
      return {
        success: false,
        signedUrl
      }; // Return null if signedUrl is undefined    
  } catch (error) {
    console.log(error, 'can\'t get signed urls');
    return {
      success: false,
      message: 'cant fetch file url'
  }
  }
}


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
    await prisma.uploads.update({
      where: {
        id: fileId
      },
      data:{
        starred: true
      }
    })
    //return res
    return({
      success: true,
      message: 'added to starred successfully'
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