"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import useMobile from "@/hooks/use-mobile"

interface FlightPathProps {
  count: number
}

export default function FlightPath({ count }: FlightPathProps) {
  const isMobile = useMobile()
  const [rocketPosition, setRocketPosition] = useState(0)
  const pathHeight = isMobile ? 280 : 400
  const maxCount = 50 // Count at which rocket reaches the moon

  // Calculate rocket position based on count
  useEffect(() => {
    const newPosition = Math.min((count / maxCount) * (pathHeight - 96), pathHeight - 96)
    setRocketPosition(newPosition)
  }, [count, pathHeight])

  return (
    <div
      className="relative mx-auto pixel-border"
      style={{
        height: `${pathHeight}px`,
        width: "120px",
      }}
    >
      {/* Moon at the top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative w-24 h-24">
          <Image src="/images/moon.png" alt="Moon" width={96} height={96} className="pixel-image" />
        </div>
      </div>

      {/* Flight path */}
      <div className="absolute inset-0 bg-space-path rounded-lg opacity-20"></div>

      {/* Rocket that moves up */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out"
        style={{
          bottom: `${rocketPosition}px`,
        }}
      >
        <div className="relative w-24 h-24">
          <Image src="/images/rocket.png" alt="Rocket" width={96} height={96} className="pixel-image" />

          {/* Rocket flame animation */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-12 overflow-hidden">
            <div className="rocket-flame"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
