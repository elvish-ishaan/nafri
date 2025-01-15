import { deleteFileFromS3, uploadFileToS3 } from "@/app/core/fileOperations"
import prisma from "@/prisma/prismaClient";
import { NextResponse, NextRequest } from "next/server"


export async function POST(req: NextRequest) {
  try {
    // Check API key authentication
    const formData = await req.formData();
    const apikey = formData.get("apiKey") as string;

    if (!apikey) {
      return NextResponse.json(
        { success: false, message: "no data found" },
        { status: 401 }
      );
    }

    // Validate the API key
    const user = await prisma.apiKeys.findFirst({
      where: {
        key: apikey,
      },
      include: {
        user: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid API key" },
        { status: 403 }
      );
    }

    // Check content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    // Upload file to S3
    const res = await uploadFileToS3(formData, user.userEmail);
    return NextResponse.json(
      {
        message: res.message,
        success: res.success,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { fileId, apiKey } = await req.json();

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API key is required" },
        { status: 401 }
      );
    }

    const user = await prisma.apiKeys.findFirst({
      where: { key: apiKey },
      include: { user: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid API key" },
        { status: 403 }
      );
    }

    // Move file to bin
    try {
      const updatedUpload = await prisma.uploads.update({
        where: { id: fileId },
        data: {
          deleted: true,
          deleteDate: new Date(),
        },
      });
      console.log("File moved to bin:", updatedUpload);
    } catch (error) {
      console.error("Error moving file to bin:", error);
      return NextResponse.json(
        { success: false, message: "Unable to move file to bin" },
        { status: 500 }
      );
    }

    //move to bin
    const res = await  deleteFileFromS3(fileId)

      return NextResponse.json(
        { success: res.success, message: res.message },
        { status: 500 }
      );
    }
   catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get query parameters from URLSearchParams
  const url = req.nextUrl;  // Access the full URL
  const apiKey = url.searchParams.get('apiKey');

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API key is required" },
        { status: 401 }
      );
    }

    const data = await prisma.apiKeys.findFirst({
      where: { key: apiKey },
      include: { user: {
        include: {
          uploads: true
        }
      } },
    });
    console.log(data)

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Invalid API key" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: true, message: "uploads fetched successfully", files: data?.user.uploads },
      { status: 200 }
    );
    }
   catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
