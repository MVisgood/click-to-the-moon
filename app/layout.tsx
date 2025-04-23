import type { Metadata } from 'next'
import './globals.css'
import SolanaWalletProvider from '@/providers/WalletProvider'

export const metadata: Metadata = {
  title: 'Click-to-Moon',
  description: 'Send your rocket to the moon with on-chain transactions',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider>
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
