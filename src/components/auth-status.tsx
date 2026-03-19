"use client"

import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AuthStatus() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  if (!isLoaded) {
    return <div className="p-4">Loading...</div>
  }

  if (!user) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
        <h3 className="font-semibold text-rose-900 mb-2">Not Signed In</h3>
        <p className="text-rose-800 mb-4">You are not currently signed in.</p>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
          <Button variant="outline" onClick={() => router.push('/sign-up')}>
            Sign Up
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-2">Signed In</h3>
      <p className="text-green-700 mb-2">
        Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!
      </p>
      <p className="text-green-600 text-sm mb-4">
        User ID: {user.id}
      </p>
      <Button onClick={() => router.push('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  )
}
