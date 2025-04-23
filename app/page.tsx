"use client"

import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/navigation"
import FlightPath from "@/components/flight-path"
import BoostButton from "@/components/boost-button"
import Footer from "@/components/footer"
import useCounter from "@/hooks/use-counter"
import useMobile from "@/hooks/use-mobile"
import { useWallet } from "@solana/wallet-adapter-react"

export default function Home() {
  const { count, increment, pending, error } = useCounter()
  const { toast } = useToast()
  const isMobile = useMobile()
  const { connected } = useWallet()

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: "Your boost didn't make it through. Try again!",
      })
    }
  }, [error, toast])

  return (
    <div className="min-h-screen flex flex-col bg-space-bg text-white relative overflow-hidden">
      {/* Star field background */}
      <div className="absolute inset-0 z-0">
        <div className="stars-small"></div>
        <div className="stars-medium"></div>
        <div className="stars-large"></div>
      </div>

      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className={`w-full max-w-md mx-auto flex flex-col items-center ${isMobile ? "gap-6" : "gap-10"}`}>
          <FlightPath count={count} />

          <div className="text-center">
            <h2 className="text-2xl font-pixel mb-2">ROCKET BOOST</h2>
            <div className="text-5xl font-pixel-bold text-neon-green mb-6 glow-text">{count}</div>

            {!connected ? (
              <div className="bg-purple-900/30 border border-neon-purple px-4 py-3 rounded-lg mb-4 max-w-xs mx-auto">
                <p className="text-sm text-neon-purple">Connect your Phantom wallet to boost the rocket!</p>
              </div>
            ) : (
              <BoostButton onClick={increment} pending={pending} />
            )}
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
