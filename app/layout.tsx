import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jb = JetBrains_Mono({ subsets: ["latin"] });

export const metadata = { title: "BGENG GLOBAL | OMNISCIENCE" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jb.className} bg-[#000205] text-white overflow-hidden`}>
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        {children}
      </body>
    </html>
  );
}
