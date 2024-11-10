"use server"

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