// imports
import prisma from "@/prisma/prismaClient";
import NextAuth from "next-auth"

// importing providers
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SEC as string,
          })
    ],
    callbacks: {
        async signIn({ user }) {
          // Extract user information from the Google profile
          const { email, name } = user;
    
          // Check if the user exists in your database
          const existingUser = await prisma.user.findUnique({
            where: { 
                email: email || '',
             },
          });
    
          // If the user doesn't exist, create a new record
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: email || '',
                name
              },
            });
          }
    
          // Return true to allow sign-in
          return true;
        },
        async redirect({ url, baseUrl }) {
          // Redirect to the dashboard after successful sign-in
          return url.startsWith(baseUrl) ? `${baseUrl}/dashboard` : baseUrl;
        },
      },
      
})

export { handler as GET, handler as POST }