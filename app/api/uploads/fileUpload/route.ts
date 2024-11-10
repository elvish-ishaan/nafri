import { Bucket, s3 } from "@/app/configs/awsConfig";
import prisma from "@/prisma/prismaClient";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from 'uuid';

export const uploadFileAws = async (file: File | null) => {
  const session = await getServerSession()
  if(!session){
    return {
      success: false,
      message: 'user unauthenticated'
  }
  }
    if (!file) return;
    const ext = file?.name.split(".").at(-1);
    const uid = uuidv4().split('-')
    const fileName = `${uid[0]}${ext ? "." + ext : ""}`;
     
    try {
      try {
        const uploadToS3 = new PutObjectCommand({
            Bucket,
            Key: fileName,
            Body: file,
            ContentType:"image/jpeg"
          });
          await s3.send(uploadToS3);
      } catch (error) {
        console.log(error,'error in uploading to aws')
        return {
          success: false,
          message: 'error uploading file'
      }
      }
      //save metadata to database
      try {
           await prisma.uploads.create({
            data: {
                fileKey: fileName,
                uploadDate: new Date().toISOString(),
                userEmail: session?.user?.email || ''
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

export const POST = async () => {
    //fix authentication first

}