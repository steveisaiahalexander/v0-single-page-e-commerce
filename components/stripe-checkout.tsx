'use client'

import { FormEvent, useState } from 'react'
import {
  CheckoutElementsProvider,
  PaymentElement,
  ShippingAddressElement,
  useCheckoutElements,
} from '@stripe/react-stripe-js/checkout'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowRight, LockKeyhole } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

function PaymentForm({ onComplete, priceInCents }: { onComplete: () => void; priceInCents: number }) {
  const checkoutState = useCheckoutElements()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (checkoutState.type !== 'success' || submitting) return

    setSubmitting(true)
    setError('')

    const result = await checkoutState.checkout.confirm({
      email,
      returnUrl: `${window.location.origin}/?payment=complete`,
      redirect: 'if_required',
    })

    if (result.type === 'error') {
      setError(result.error.message || 'Your payment could not be completed. Please try again.')
      setSubmitting(false)
      return
    }

    onComplete()
  }

  if (checkoutState.type === 'loading') {
    return <p className="checkout-loading" role="status">Loading your secure payment form…</p>
  }

  if (checkoutState.type === 'error') {
    return <p className="payment-error" role="alert">{checkoutState.error.message}</p>
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <label className="payment-field email-field">
        <span>Email for your receipt</span>
        <input autoComplete="email" name="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required type="email" value={email} />
      </label>
      <div className="payment-method-heading"><span>SHIPPING ADDRESS</span><span>FREE EXPRESS DELIVERY</span></div>
      <ShippingAddressElement options={{ fields: { phone: 'never' } }} />
      <div className="payment-method-heading"><span>PAYMENT METHOD</span><span>SECURED BY STRIPE</span></div>
      <PaymentElement
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['card'],
          fields: { billingDetails: { name: 'never', email: 'never', address: 'never' } },
          wallets: { link: 'never', applePay: 'never', googlePay: 'never' },
          terms: { card: 'never' },
        }}
      />
      {error && <p className="payment-error" role="alert">{error}</p>}
      <button className="button-primary payment-submit" disabled={submitting} type="submit">
        {submitting ? 'Processing…' : `Pay $${(priceInCents / 100).toFixed(2)}`}
        {submitting ? <span className="payment-spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
      </button>
      <p className="secure-note"><LockKeyhole aria-hidden="true" /> Your payment details are encrypted and never stored here.</p>
    </form>
  )
}

export default function StripeCheckout({ clientSecret, onComplete, priceInCents }: { clientSecret: string; onComplete: () => void; priceInCents: number }) {
  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        elementsOptions: {
          appearance: {
            theme: 'flat',
            variables: {
              colorPrimary: '#111111',
              colorBackground: '#ffffff',
              colorText: '#171717',
              colorDanger: '#b42318',
              fontFamily: 'Arial, sans-serif',
              borderRadius: '2px',
            },
          },
        },
      }}
    >
      <PaymentForm onComplete={onComplete} priceInCents={priceInCents} />
    </CheckoutElementsProvider>
  )
}
