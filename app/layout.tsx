import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Menggunakan font JetBrains Mono agar terlihat seperti terminal hacker/SpaceX
const mono = JetBrains_Mono({ 
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "OMNISCIENCE v9 | Global Command Center",
  description: "Real-time planetary surveillance and data visualization engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${mono.className} bg-[#000205] text-white antialiased overflow-hidden`}>
        {/* Layer Efek Garis-garis Monitor Tua (Scanlines) */}
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        {/* Konten Utama Aplikasi */}
        {children}
      </body>
    </html>
  );
}
