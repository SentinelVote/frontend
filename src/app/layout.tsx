import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuantumSecure Voter Platform",
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
          <div className="flex  items-center h-full px-24">
            <h1
              className="text-2xl pr-5 font-bold"
              style={{
                borderRight: "5px solid white",
              }}
            >
              QuantumSecure
            </h1>
            <h1 className="text-2xl pl-5">Voter </h1>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
