"use client"

import { useState, useEffect, useCallback, ReactNode } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"

// Get program ID from environment variable
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!)
const COUNTER_SEED = "rocket_state"

// Define the return type for the hook
interface CounterState {
  count: number;
  increment: () => Promise<void>;
  pending: boolean;
  error: Error | null;
}

export default function useCounter(): CounterState {
  const [count, setCount] = useState(0)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { connection } = useConnection()
  const { publicKey, signTransaction, connected } = useWallet()
  const { toast } = useToast()

  // Find PDA for counter state
  const getStatePDA = useCallback(async () => {
    if (!publicKey) return null
    
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from(COUNTER_SEED), publicKey.toBuffer()],
      PROGRAM_ID
    )
    
    return pda
  }, [publicKey])

  // Fetch the counter value from chain when wallet connects
  useEffect(() => {
    const fetchCounter = async () => {
      if (!publicKey || !connected) {
        setCount(0)
        return
      }

      try {
        const pda = await getStatePDA()
        if (!pda) return

        // Try to fetch the account info
        const accountInfo = await connection.getAccountInfo(pda)
        
        // If account exists, parse the count from it
        if (accountInfo) {
          // Assuming the first 8 bytes are the counter value (adjust based on your program)
          // This is a simplified example - actual data parsing depends on your program's data structure
          const counterData = accountInfo.data
          if (counterData.length >= 8) {
            setCount(Number(counterData.readBigUInt64LE(0)))
          }
        }
      } catch (err) {
        console.error("Error fetching counter:", err)
      }
    }

    fetchCounter()
  }, [publicKey, connected, connection, getStatePDA])

  const increment = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      setError(new Error("Wallet not connected"))
      return
    }

    setPending(true)
    setError(null)

    try {
      const pda = await getStatePDA()
      if (!pda) throw new Error("Could not find state PDA")

      // Create instruction for incrementing the counter
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: pda, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        programId: PROGRAM_ID,
        data: Buffer.from([0]), // 0 = increment instruction (adjust based on your program)
      })

      const transaction = new Transaction().add(instruction)
      transaction.feePayer = publicKey
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false
      })
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")
      
      console.log("Transaction signature:", signature)
      
      // Show transaction success toast with explorer link
      toast({
        title: "Boost sent successfully!",
        description: (
          <a 
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank" 
            rel="noopener noreferrer"
            className="underline text-neon-green"
          >
            View on Solana Explorer
          </a>
        ),
      })

      // Increment the local counter
      setCount(prev => prev + 1)
    } catch (err) {
      console.error("Transaction error:", err)
      setError(err as Error)
    } finally {
      setPending(false)
    }
  }, [publicKey, signTransaction, connection, getStatePDA, toast])

  return { count, increment, pending, error }
}
