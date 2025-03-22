import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Duolingo Quiz App',
  description: 'An interactive quiz application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 