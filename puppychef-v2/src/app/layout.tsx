import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Varela_Round } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-nunito",
});

const varelaRound = Varela_Round({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-varela",
});

export const metadata: Metadata = {
  title: "Puppychef | Premium Pet Bakery Delhi",
  description: "Custom dog cakes, healthy treats & nutritious meals. Fresh daily, free delivery in Safdarjung. Order on WhatsApp!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${varelaRound.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
