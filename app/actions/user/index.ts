"use server"

import prisma from "@/prisma/prismaClient"
import { getServerSession } from "next-auth"

export const fetchUserData = async () => {
    //check auth
    const session = await getServerSession()
    if(!session){
        throw new Error('user not authenticated')
    }

    //check for details
    try {
        const user = await prisma.user.findUnique({
            where: {
                //fix this  session.user?.email || ''
                email: 'user1@example.com'
            }
        })
        if(!user) {
            throw new Error('user data not found')
        }
        //return responce
        return{
            success: true,
            user
        }
    } catch (error) {
        console.log(error,'error in fetching user data from db')
        throw new Error('something went wrong')
    }
}