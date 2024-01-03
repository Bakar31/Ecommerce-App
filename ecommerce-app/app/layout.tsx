import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SazimStore",
  description:
    "SazimStore is your ultimate destination for a seamless and personalized shopping experience. ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Navbar />
        </div>
        <main className="p-4 m-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
