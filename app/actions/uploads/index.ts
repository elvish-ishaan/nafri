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
        throw new Error('Unauthorised user')
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
        throw new Error("File Size Exceeds Your Current Space")
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
        throw new Error('Error in uploading file')
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
              currentSpace: {
                increment: file.size, 
              },
            },
          }),
        ]);
        return {
            success: true,
            message: "uploaded successfully"
        }
      } catch (error) {
        console.log(error,'error in saving metadata to db')
        throw new Error("error in saving metadata of uploaded files")
      }
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong in uploading to aws")
    }
}

//delete file from storage
export const deleteFileAws = async (toDelfileKey: string, fileId: string) => {
  //check auth
  const session = await getServerSession()
  if(!session){
    throw new Error('user unauthenticated')
  }
  try {
    //first delete file from aws
     await s3.send(new DeleteObjectCommand({ 
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
       Key: toDelfileKey }));
  } catch (error) {
    console.log(error,'error in del obj aws')
    throw new Error('error in deleting file')
  }
  //update metadata in db
  try {
    const updateUser = await prisma.user.update({
      where: {
        email: session.user?.email || ''
      },
      data: {
        uploads: {
          delete: {
            id: fileId
          }
        }
      }
    })
    console.log(updateUser)
    if(!updateUser){
      throw new Error('cant update user')
    }
  } catch (error) {
    console.log(error,'error in updated del data')
  }
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
    throw new Error('unauthenticated user')
  }
  try {
    const uploadsMetaData = await prisma.uploads.findMany({
      where:{
        userEmail: session.user?.email || ''
      }
    })
    console.log(uploadsMetaData,'this are all uploads')
    if(!uploadsMetaData || uploadsMetaData.length == 0){
      throw new Error("No uploads found")
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
    throw new Error('cant fetch uploads')
  }
}

export const fetchSignedUrl = async (fileKey: string) => {
  //authentication check
  const session = await getServerSession()
  if(!session){
    throw new Error("user unauthenticated")
  }
  if(!fileKey){
    throw new Error('filekey is missing')
  }
  try {
      // Create a command for getting the object
      const command = new GetObjectCommand({
        Bucket,
        Key: fileKey || '',
        ResponseContentDisposition: 'attachment'
      });
 
      // Get the pre-signed URL
      const signedUrl = await getSignedUrl(s3, command);
      console.log(signedUrl, 'this is signed url mapping....');
      return signedUrl || null; // Return null if signedUrl is undefined    
  } catch (error) {
    console.log(error, 'can\'t get signed urls');
    throw new Error('Can\'t fetch upload URLs');
  }
}


//add to starred 
export const addToStarred = async (fileId: string) => {
  //check auth
  const session = await getServerSession()
  if(!session){
    throw new Error('user not authenticated')
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
    throw new Error("cant star this file, try again")
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