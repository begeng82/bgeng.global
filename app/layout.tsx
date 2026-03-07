import './globals.css'

export const metadata = {
  title: 'OMNIS V20 | GOD TIER',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased crt">{children}</body>
    </html>
  )
}
