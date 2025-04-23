"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import useMobile from "@/hooks/use-mobile"

interface BoostButtonProps {
  onClick: () => void
  pending: boolean
}

export default function BoostButton({ onClick, pending }: BoostButtonProps) {
  const isMobile = useMobile()

  return (
    <Button
      onClick={onClick}
      disabled={pending}
      className={`
        font-pixel text-lg px-8 py-6 h-auto
        bg-neon-orange hover:bg-neon-orange/90
        text-white border-2 border-neon-orange/50
        rounded-full shadow-glow-orange
        transition-all duration-300
        ${isMobile ? "w-full" : "min-w-[240px]"}
        pixel-button
      `}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Boosting...
        </>
      ) : (
        <>Boost Rocket 🚀</>
      )}
    </Button>
  )
}
