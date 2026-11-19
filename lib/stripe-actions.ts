'use server'

import 'server-only'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

export async function createCheckoutSession(productId: string, finish: string, idempotencyKey: string) {
  const product = PRODUCTS.find((item) => item.id === productId)

  if (!product) {
    throw new Error('This product is not available for checkout.')
  }

  if (finish !== 'Midnight' && finish !== 'Chalk') {
    throw new Error('This product finish is not available.')
  }

  if (!/^[0-9a-f-]{36}$/i.test(idempotencyKey)) {
    throw new Error('Please refresh and try checkout again.')
  }

  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin')
  if (!origin) {
    throw new Error('Secure checkout could not be started. Please try again.')
  }

  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: 'elements',
      return_url: `${origin}/?payment=complete`,
      mode: 'payment',
      metadata: { productId: product.id, finish },
      payment_intent_data: { metadata: { productId: product.id, finish } },
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Complimentary express shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
      ],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${product.name} — ${finish}`,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
    },
    { idempotencyKey },
  )

  if (!session.client_secret) {
    throw new Error('Secure checkout could not be started. Please try again.')
  }

  return session.client_secret
}
