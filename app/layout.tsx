import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import AuthProvider from "./AuthProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Nafri - Next Gen Cloud Storage",
  description: "An all-in-one secure cloud storage solution",
  openGraph: {
    title: "Nafri - Next Gen Cloud Storage",
    description: "An all-in-one secure cloud storage solution",
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    locale: "en_US",
    siteName: "Nafri"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </AuthProvider>
        </body>
    </html>
  );
}
