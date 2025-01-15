import prisma from "@/prisma/prismaClient";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Bucket, s3 } from "@/app/configs/awsConfig";
import { contentType } from "@/lib/contentTypes";


export const uploadFileToS3 = async (formData: FormData, email: string) => {
     
    //do upload operations
    const file = formData.get("file") as File;
    
      if (!file) {
        throw new Error('no file found')
      }
    const fileName = file.name

    //check storage operation like is user able to upload according to his assingned storage
      const user = await prisma.user.findUnique({
        where: {
          email: email || "",
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
            ContentType: contentType[fileExtension] || 'application/octet-stream'
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
              userEmail: email || '',
            },
          }),
        
          // Update user storage
          prisma.user.update({
            where: {
              email: email || "",
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

export const deleteFileFromS3 = async (fileId: string) => {
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
  //return res
  return{
    success: true,
    message: 'file deleted success'
  }
}

