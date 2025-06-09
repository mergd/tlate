import { type Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TLate",
    default: "TLate",
  },
  description:
    "AI-powered document translation with version control and collaborative features",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geist.variable} ${sourceSerif.variable} antialiased isolate `}
        >
          <ThemeProvider defaultTheme="system">
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
