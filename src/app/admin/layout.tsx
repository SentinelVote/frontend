import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SentinelVote | Admin",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="text-white h-[10vh]">
          <div className="flex justify-center md:justify-normal items-center h-full px-10 md:px-24">
            <h1 className="text-2xl pr-2 md:pr-5 font-bold border-r-[3px] md:border-r-[5px] border-white">
              SentinelVote
            </h1>
            <h1 className="text-2xl pl-2 md:pl-5">Admin</h1>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
