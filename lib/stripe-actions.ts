'use server'

import 'server-only'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

export async function createCheckoutSession(productId: string) {
  const product = PRODUCTS.find((item) => item.id === productId)

  if (!product) {
    throw new Error('This product is not available for checkout.')
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  })

  if (!session.client_secret) {
    throw new Error('Secure checkout could not be started. Please try again.')
  }

  return session.client_secret
}
