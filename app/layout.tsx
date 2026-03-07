import './globals.css'

export const metadata = {
  title: 'OMNIS V20 | TACTICAL COMMAND',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">{children}</body>
    </html>
  )
}
