import Storefront from '@/components/storefront'

export default async function Home({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const params = await searchParams
  return <Storefront initialPaymentComplete={params.payment === 'complete'} />
}
