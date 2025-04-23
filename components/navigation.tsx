"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function Navigation() {
  const { publicKey } = useWallet()
  
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between relative z-10 border-b border-purple-900/30">
      <div className="font-pixel text-xl md:text-2xl text-neon-purple glow-text">Click-to-Moon</div>

      <div className="flex items-center gap-4">
        {publicKey && (
          <div className="font-mono text-xs bg-purple-900/40 px-3 py-1 rounded-full border border-purple-800/50">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
        )}
        <WalletMultiButton className="font-pixel text-sm px-4 py-2 h-auto bg-purple-900/30 text-neon-purple border-neon-purple hover:bg-purple-900/50" />
      </div>
    </header>
  )
}
