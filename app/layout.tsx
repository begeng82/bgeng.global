import './globals.css'

export const metadata = {
  title: 'BGENG GLOBAL | OMNISCIENCE',
  description: 'Military Grade Global Monitoring',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, background: 'black' }}>{children}</body>
    </html>
  )
}
