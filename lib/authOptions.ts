import { NextAuthOptions, Session, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/prisma/prismaClient';

const SALT_ROUNDS = 10;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SEC || !process.env.NEXTAUTH_SECRET) {
    throw new Error('Missing required environment variables.');
}

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
            async authorize(credentials): Promise<User | null> {
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
        async signIn({ user, profile }): Promise<boolean> {
            if (user?.email) {
                try {
                    const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                email: user.email,
                                name: user.name || profile?.name || 'Guest',
                            },
                        });
                    }
                    return true;
                } catch (error) {
                    console.error('Error in Google signIn callback:', error);
                    return false;
                }
            }
            return true;
        },
        async session({ session, token }): Promise<Session> {
            if (session?.user && token.email) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }): Promise<string> {
            return url.startsWith(baseUrl) ? url : `${baseUrl}/dashboard`;
        },
    },
};
