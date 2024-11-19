"use server"
import bcrypt from 'bcrypt'
import prisma from "@/prisma/prismaClient"
import { getServerSession } from "next-auth"

export const fetchUserData = async () => {
    //check auth
    const session = await getServerSession()
    if(!session){
        return {
            success: false,
            message: 'user unauthenticated'
        }
    }

    //check for details
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: session.user?.email || ''
            }
        })
        if(!user) {
            return {
                success: false,
                message: 'user not found'
            }
        }
        //return responce
        return{
            success: true,
            user
        }
    } catch (error) {
        console.log(error,'error in fetching user data from db')
        return {
            success: false,
            message: 'internal server error'
        }
    }
}

//update profile 

export async function updateProfile(profileData: {
    name?: string | null,
    email?: string | null,
    oldPassword?: string | null,
    newPassword?: string | null
}) {
    try {
        //check auth
    const session = await getServerSession()
    if(!session){
        return {
            success: false,
            message: 'user unauthenticated'
        }
    }

        // Fetch the user record from the database
        const user = await prisma.user.findUnique({
            where: { email: session.user?.email || '' },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // If oldPassword is provided, verify it matches the hashed password
        if (profileData.oldPassword) {
            const isPasswordMatch = await bcrypt.compare(profileData.oldPassword, user?.password || '');

            if (!isPasswordMatch) {
                return { status: 403, error: "Incorrect old password" };
            }
        }

        // Hash the new password if provided
        const hashedPassword = profileData.newPassword
            ? await bcrypt.hash(profileData.newPassword, 10)
            : undefined;

        // Update the user profile
        const updatedProfile = await prisma.user.update({
            where: {
                email: session.user?.email || '',
            },
            data: {
                ...(profileData.name && { name: profileData.name }),
                ...(profileData.email && { email: profileData.email }),
                ...(hashedPassword && { password: hashedPassword }),
            },
        });
       //fix tigger email to notify user about an update
        return {
            success: true,
            message: "Profile updated successfully",
            data: updatedProfile,
        };
    } catch (error) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            error: "Failed to update profile. Please try again later.",
        };
    }
}
