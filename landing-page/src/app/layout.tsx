import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Puppychef | Pet Bakery Delhi - Dog Cakes & Treats",
  description: "Delhi's premium pet bakery. Custom dog birthday cakes, healthy treats, pet food. Fresh daily, free delivery in Safdarjung. Order on WhatsApp!",
  keywords: "dog cake delhi, pet bakery, dog birthday cake, pupcakes, dog treats delhi, safdarjung",
  openGraph: {
    title: "Puppychef - Premium Pet Bakery Delhi",
    description: "Custom cakes & treats for your pets 🐕🎂",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
