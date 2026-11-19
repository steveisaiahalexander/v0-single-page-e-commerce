export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'aura-one',
    name: 'Aura One',
    description: 'Over-ear wireless headphones with adaptive noise cancellation and high-resolution spatial audio.',
    priceInCents: 34900,
  },
]
