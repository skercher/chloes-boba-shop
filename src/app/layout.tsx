import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "🧋 Chloe's Boba Shop",
  description: 'The cutest boba tea game ever! Made by Chloe 💖',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
