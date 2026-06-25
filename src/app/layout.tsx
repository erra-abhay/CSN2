import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DeploymentProvider } from "@/lib/deployment-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "csn2.me — Zero-Downtime Deployment Pipeline",
  description: "A live infrastructure experiment showcasing Azure VM Scale Set blue-green rollouts and Traefik load balancers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DeploymentProvider>
          {children}
        </DeploymentProvider>
      </body>
    </html>
  );
}
