import { deleteFileFromS3, uploadFileToS3 } from "@/app/core/fileOperations";
import prisma from "@/prisma/prismaClient";
import { NextResponse, NextRequest } from "next/server";

// Helper to extract API key from headers
function getApiKeyFromHeaders(headers: Headers): string | null {
  const authorization = headers.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.split(" ")[1];
  }
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract API key from headers
    const apiKey = getApiKeyFromHeaders(req.headers);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API key is required" },
        { status: 401 }
      );
    }

    // Validate the API key
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

    // Check content type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { success: false, message: "Invalid content type" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await req.formData();

    // Upload file to S3
    const res = await uploadFileToS3(formData, user.user.email);
    return NextResponse.json(
      { message: res.message, success: res.success },
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

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const apiKey = getApiKeyFromHeaders(req.headers);
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

    const { fileId }: { fileId: string } = await req.json();
    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    // Move file to bin in database
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

    // Delete file from S3
    const res = await deleteFileFromS3(fileId);
    return NextResponse.json(
      { success: res.success, message: res.message },
      { status: res.success ? 200 : 500 }
    );
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract API key from headers
    const apiKey = getApiKeyFromHeaders(req.headers);
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "API key is required" },
        { status: 401 }
      );
    }

    const user = await prisma.apiKeys.findFirst({
      where: { key: apiKey },
      include: {
        user: {
          include: {
            uploads: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid API key" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Uploads fetched successfully",
        files: user.user.uploads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
