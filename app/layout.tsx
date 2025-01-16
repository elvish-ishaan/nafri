import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import AuthProvider from "./AuthProvider";
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: "Nafri",
  description: "upload to secure",
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
            defaultTheme="system"
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
