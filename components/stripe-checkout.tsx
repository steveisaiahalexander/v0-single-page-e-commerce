'use client'

import { useCallback } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession } from '@/lib/stripe-actions'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

export default function StripeCheckout({ productId, onComplete }: { productId: string; onComplete: () => void }) {
  const fetchClientSecret = useCallback(() => createCheckoutSession(productId), [productId])

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret,
        onComplete,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
