import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import Image from "next/image";
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
          <div className="flex justify-center md:justify-normal items-center h-full px-10 md:px-24 bg-navbar-bg">
            <Image
              src="/SentinelVote.ico"
              width={36}
              height={36}
              alt="SentinelVote Logo"
            />
            <h1 className="text-2xl p-2 md:pl-2 md:pr-5 font-semibold  ">
              sentinelvote
            </h1>
            <h1 className="text-lg pl-2 md:pl-5 border-l-[3px] md:border-l-[3px] border-white">
              admin
            </h1>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
