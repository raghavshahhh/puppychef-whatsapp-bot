import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Puppychef | Premium Pet Bakery & Cafe - Delhi",
  description: "Handcrafted cakes, treats & meals for your pets. Custom dog birthday cakes, healthy treats, pet food. Safdarjung Enclave, Delhi. Order on WhatsApp!",
  keywords: "pet bakery delhi, dog cakes, dog birthday cake, pet treats, puppychef, safdarjung",
  openGraph: {
    title: "Puppychef - Delhi's Premium Pet Bakery",
    description: "Custom cakes & treats for your furry friends 🐕🎂",
    url: "https://landing-page-ragsproai.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
