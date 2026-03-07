import './globals.css'

export const metadata = {
  title: 'OMNIS V20 | GLOBAL COMMAND',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black antialiased overflow-hidden">{children}</body>
    </html>
  )
}
