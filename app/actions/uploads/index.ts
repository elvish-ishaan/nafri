"use server"
import { Bucket, s3 } from "@/app/configs/awsConfig";
import prisma from "@/prisma/prismaClient";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const uploadFileAws = async (formData: FormData) => {
    //check auth
    const session = await getServerSession()
    console.log(session?.user,'this is server session user data....')
    if(!session){
        throw new Error('Unauthorised user')
    }
    //do upload operations
    const file = formData.get("file") as File;
    if (!file) return;
    const ext = file?.name.split(".").at(-1);
    const uid = uuidv4().split('-')
    const fileName = `${uid[0]}${ext ? "." + ext : ""}`;
     
    try {
      try {
        //conver file to buffer before uploading
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const uploadToS3 = new PutObjectCommand({
            Bucket,
            Key: fileName,
            Body: fileBuffer,
            ContentType:"image/jpeg"
          });
          await s3.send(uploadToS3);
      } catch (error) {
        console.log(error,'error in uploading to aws')
        throw new Error('Error in uploading file')
      }
      //save metadata to database
      try {
           await prisma.uploads.create({
            data: {
                fileKey: fileName,
                uploadDate: new Date().toISOString(),
                userEmail: 'user1@example.com'
            }
        })
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

//get all uploads by email
export const fetchAllUploads = async () => {
  const session = await getServerSession()
  if(!session){
    throw new Error('unauthenticated user')
  }
  try {
    const uploadsMetaData = await prisma.uploads.findMany({
      where:{
        userEmail: "user1@example.com"
        // userEmail: session.user?.email
      }
    })
    console.log(uploadsMetaData,'this are all uploads')
    if(!uploadsMetaData || uploadsMetaData.length == 0){
      throw new Error("No uploads found")
    }
    try {
      // Use Promise.all to handle the async operations
      const allSignedUrls = await Promise.all(uploadsMetaData.map(async (upload) => {
        // Create a command for getting the object
        const command = new GetObjectCommand({
          Bucket,
          Key: upload.fileKey || ''
        });
   
        // Get the pre-signed URL
        const signedUrl = await getSignedUrl(s3, command);
        console.log(signedUrl, 'this is signed url mapping....');
        return signedUrl || null; // Return null if signedUrl is undefined
      }));

      console.log(allSignedUrls, 'these are all signed urls');
      return {
        success: true,
        message: 'Fetched all uploads with signed URL',
        uploads: {
          uploadsMetaData,
          allSignedUrls
        }
      };
    } catch (error) {
      console.log(error, 'can\'t get signed urls');
      throw new Error('Can\'t fetch upload URLs');
    }
  } catch (error) {
    console.log(error,'error in fetching uplods')
    throw new Error('cant fetch uploads')
  }
}