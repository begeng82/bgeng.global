import './globals.css'

export const metadata = {
  title: 'BGENG OMNIS | GLOBAL THREAT MONITOR',
  description: 'Military-Grade OSINT Command Center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black antialiased overflow-hidden">{children}</body>
    </html>
  )
}