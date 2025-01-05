import prisma from '@/prisma/prismaClient';
import { getServerSession } from "next-auth"; // Import your session helper if needed

export async function saveContactMessage(formData: FormData) {
  try {
    // (Optional) Authenticate the user if necessary
    const session = await getServerSession();

    if (!session) {
      return {
        success: false,
        message: "User unauthenticated.",
      };
    }

    // Extract form data
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const message = formData.get("message")?.toString();

    if (!name || !email || !message) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    // Save to database using Prisma
    const savedMessage = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    console.log("Message saved:", savedMessage);

    return {
      success: true,
      message: "Message sent successfully!",
    };
  } catch (error) {
    console.error("Error saving contact message:", error);
    return {
      success: false,
      message: "Failed to save the message.",
    };
  }
}
