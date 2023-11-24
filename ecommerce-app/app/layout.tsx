import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/navbar'

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
        <Navbar/>
      </div>
        <main className="p-4 max-w-8xl m-auto min-w-[300px]">{children}</main>
      </body>
    </html>
  );
}
