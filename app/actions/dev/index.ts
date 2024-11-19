"use server"

import prisma from '@/prisma/prismaClient';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';

/**
 * Generates a secure API key.
 * @param {number} length - Length of the API key.
 * @returns {string} - The generated API key.
 */
const genKey = () => {
    // Generate a random buffer and encode it as a URL-safe string
  const buffer = crypto.randomBytes(32);
  return buffer.toString('base64url');
  }

export const generateApiKey = async () => {
  const session = await getServerSession()
  if(!session){
    return {
        success: false,
        message: 'user unauthenticated'
    }
  }

  try {
    //generate a apiKey
    const apiKey = genKey()
    //update the user info
    try {
        const user = await prisma.user.update({
            where: {
                email: session.user?.email || ''
            },
            data: {
                role: 'DEV',
                apiKeys: {
                    create: {
                        genDate: new Date(),
                        key: apiKey,
                    }
                }
            },
            include:{apiKeys: true}
        })
        console.log(user,'this is user with api key')
        if(!user){
            return {
                success: false,
                message: 'cant gen keys'
            }
        }
        //return res
        return {
            success: true,
            message: 'api key generated',
            genKey: user
        }
    } catch (error) {
        console.log(error,'error in updating user api key to db')
    }

  } catch (error) {
    console.log(error,'error in gen api key')
    return {
        success: false,
        message: 'internal server error'
    }
  }
}

//get all api keys
export async function getDevApiKeys() {
  try {
    // Get the authenticated session
    const session = await getServerSession();

    // Ensure the user is authenticated
    if (!session?.user?.email) {
        return {
            success: true,
            message: 'user unauthenticated',
          };    }

    // Fetch all API keys for the user
    const apiKeys = await prisma.apiKeys.findMany({
      where: {
        userEmail: session.user.email,
      }
    });
    console.log(apiKeys,'get api keys')
    return {
      success: true,
      data: apiKeys,
    };
  } catch (error) {
    console.error("Error fetching user API keys:", error);
    return {
      success: false,
      error: "Failed to fetch API keys.",
    };
  }
}

//delete api key of user/dev
export async function deleteApiKeyById(apiKeyId: string) {
  try {
    // Validate input
    if (!apiKeyId) {
      throw new Error('API key ID is required.');
    }

    // Delete API key by ID
     await prisma.apiKeys.delete({
      where: {
        id: apiKeyId,
      },
    });
    return {
      success: true,
      message: 'API key deleted successfully.',
    };
  } catch (error: any) {
    console.error('Error deleting API key:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete API key.',
    };
  }
}
