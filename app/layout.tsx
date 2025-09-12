import type { Metadata } from "next";
import { Poppins, Merriweather } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { OfferPopup } from "@/components/global/OfferPopup";
import LayoutWrapper from "@/components/global/LayoutWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Quran Academy",
  description: "THE ONLINE QURAN COURSES FOR EVERYONE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${merriweather.variable} antialiased bg-[#EFF2FA]`}
        >
        <LayoutWrapper>
           {children}
            <Toaster />
        <OfferPopup/>
        </LayoutWrapper>
      </body>
    </html>
  );
}
