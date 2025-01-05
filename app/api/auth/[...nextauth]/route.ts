import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import prisma from '@/prisma/prismaClient';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SEC || !process.env.NEXTAUTH_SECRET) {
    throw new Error('Missing required environment variables.');
}

// NextAuth configuration
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SEC,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'Enter your email' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error('Missing email or password');
                }

                const { email, password } = credentials;

                try {
                    const existingUser = await prisma.user.findUnique({ where: { email } });

                    if (existingUser) {
                        const isPasswordValid = await bcrypt.compare(password, existingUser.password || '');
                        if (isPasswordValid) {
                            return { id: existingUser.id, email: existingUser.email, name: existingUser.name };
                        }
                        throw new Error('Invalid credentials');
                    }

                    // Create a new user
                    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                    const newUser = await prisma.user.create({
                        data: { email, password: hashedPassword },
                    });

                    return { id: newUser.id, email: newUser.email, name: newUser.name };
                } catch (error) {
                    console.error('Error in authorize:', error);
                    throw new Error('Unable to log in');
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user && token.email) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
        },
    },
};

// Export handlers for GET and POST requests
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
