'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Headphones,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import StripeCheckout from '@/components/stripe-checkout'

type Step = 'discover' | 'product' | 'checkout'

const steps: { id: Step; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'product', label: 'Product' },
  { id: 'checkout', label: 'Checkout' },
]

const features = [
  { label: 'Adaptive ANC', value: 'Silence, on demand' },
  { label: 'Spatial audio', value: 'Sound all around' },
  { label: '40-hour battery', value: 'Go further' },
]

export default function Storefront() {
  const [step, setStep] = useState<Step>('discover')
  const [finish, setFinish] = useState<'Midnight' | 'Chalk'>('Midnight')
  const [complete, setComplete] = useState(false)
  const product = PRODUCTS[0]

  function goTo(nextStep: Step) {
    setComplete(false)
    setStep(nextStep)
  }

  return (
    <main className="store-shell">
      <header className="store-header">
        <button className="wordmark" onClick={() => goTo('discover')} aria-label="Monoform home">
          <span className="brand-mark"><span /></span>
          <span>MONOFORM</span>
        </button>

        <nav className="step-nav" aria-label="Purchase steps">
          {steps.map((item, index) => (
            <button
              key={item.id}
              className={`step-link ${step === item.id ? 'is-current' : ''} ${steps.findIndex((current) => current.id === step) > index ? 'is-complete' : ''}`}
              onClick={() => goTo(item.id)}
              aria-current={step === item.id ? 'step' : undefined}
            >
              <span className="step-number">{steps.findIndex((current) => current.id === item.id) < steps.findIndex((current) => current.id === step) ? <Check aria-hidden="true" /> : `0${index + 1}`}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="header-bag" onClick={() => goTo('checkout')} aria-label="Go to checkout">
          <span className="bag-count">01</span>
          <ArrowUpRight aria-hidden="true" />
        </button>
      </header>

      <div className="thin-rule" />

      <section className="stage-wrap" aria-live="polite">
        {step === 'discover' && (
          <div className="stage discover-stage" key="discover">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" /> SOUND, REFINED — EST. 2026</p>
              <h1>A quieter kind<br />of <span>powerful.</span></h1>
              <p className="hero-description">Meet Aura One. Immersive sound, considered down to the last detail. Made to move with you.</p>
              <div className="hero-actions">
                <button className="button-primary" onClick={() => goTo('product')}>
                  Explore Aura One <ArrowRight aria-hidden="true" />
                </button>
                <span className="price-note">From ${((product.priceInCents) / 100).toFixed(0)}</span>
              </div>
              <div className="hero-proof">
                <span><ShieldCheck aria-hidden="true" /> 2-year warranty</span>
                <span><PackageCheck aria-hidden="true" /> Free express shipping</span>
              </div>
              <span className="side-index">01 / 03 <span>—</span> THE LISTENING ERA</span>
            </div>

            <div className="hero-visual">
              <div className="visual-topline"><span>OBJECT Nº 001</span><span>WIRELESS / OVER-EAR</span></div>
              <div className="product-stage-image">
                <div className="image-orbit orbit-one" />
                <div className="image-orbit orbit-two" />
                <Image src="/aura-headphones.png" alt="Aura One matte-black over-ear headphones" fill priority sizes="(max-width: 900px) 100vw, 55vw" className="headphone-image" />
              </div>
              <div className="visual-caption">
                <span className="caption-marker">A1</span>
                <div><strong>Aura One</strong><span>Precision in every frequency.</span></div>
                <button onClick={() => goTo('product')} aria-label="See Aura One product details"><ArrowDownRight aria-hidden="true" /></button>
              </div>
              <span className="image-coordinate">40° 43′ 55.3″ N</span>
            </div>
          </div>
        )}

        {step === 'product' && (
          <div className="stage product-stage" key="product">
            <div className="product-gallery">
              <div className="gallery-label"><span>01 — THE OBJECT</span><span>01 / 04</span></div>
              <div className="gallery-image-wrap">
                <Image src="/aura-headphones.png" alt="Aura One wireless headphones in a studio setting" fill priority sizes="(max-width: 900px) 100vw, 48vw" className="headphone-image" />
                <span className="gallery-stamp">MONOFORM<br />STUDIO SERIES</span>
              </div>
              <div className="gallery-thumbnails" aria-label="Product views">
                <button className="thumb-active" aria-label="View headphones from the front"><Image src="/aura-headphones.png" alt="" fill sizes="64px" /></button>
                <button onClick={() => setFinish('Chalk')} aria-label="Select Chalk finish"><span className="thumb-surface chalk-surface" /></button>
                <button onClick={() => setFinish('Midnight')} aria-label="Select Midnight finish"><span className="thumb-surface midnight-surface" /></button>
                <span className="thumbnail-note">A closer look at every detail <ArrowRight aria-hidden="true" /></span>
              </div>
            </div>

            <div className="product-information">
              <button className="back-link" onClick={() => goTo('discover')}><ArrowLeft aria-hidden="true" /> Back to collection</button>
              <p className="eyebrow product-eyebrow"><span className="eyebrow-dot" /> THE LISTENING ERA</p>
              <h1>Aura One</h1>
              <p className="product-subtitle">Over-ear wireless headphones</p>
              <div className="rating-line"><span aria-label="5 out of 5 stars">★★★★★</span><span>4.9 <i>·</i> 128 reviews</span><span className="availability"><span /> In stock</span></div>
              <p className="product-price">${(product.priceInCents / 100).toFixed(2)} <span>USD</span></p>
              <p className="product-description">Hear what you&apos;ve been missing. Adaptive noise cancellation meets remarkably natural, high-resolution sound in a silhouette designed for all-day comfort.</p>
              <div className="finish-selector">
                <div><span className="selector-label">FINISH</span><span className="selected-finish">{finish}</span></div>
                <div className="finish-options" role="group" aria-label="Choose a finish">
                  <button className={`finish-swatch swatch-midnight ${finish === 'Midnight' ? 'selected' : ''}`} onClick={() => setFinish('Midnight')} aria-label="Midnight finish" aria-pressed={finish === 'Midnight'}><span /></button>
                  <button className={`finish-swatch swatch-chalk ${finish === 'Chalk' ? 'selected' : ''}`} onClick={() => setFinish('Chalk')} aria-label="Chalk finish" aria-pressed={finish === 'Chalk'}><span /></button>
                </div>
              </div>
              <div className="feature-list">
                {features.map((feature) => <div className="feature-row" key={feature.label}><span>{feature.label}</span><span>{feature.value}</span><Check aria-hidden="true" /></div>)}
              </div>
              <button className="button-primary buy-button" onClick={() => goTo('checkout')}>
                Buy now <span>${(product.priceInCents / 100).toFixed(2)}</span><ArrowRight aria-hidden="true" />
              </button>
              <p className="secure-note"><LockKeyhole aria-hidden="true" /> Secure checkout · Free shipping · 30-day returns</p>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="stage checkout-stage" key="checkout">
            <div className="checkout-main">
              <button className="back-link checkout-back" onClick={() => goTo('product')}><ArrowLeft aria-hidden="true" /> Back to product</button>
              {complete ? (
                <div className="complete-state">
                  <div className="complete-icon"><Check aria-hidden="true" /></div>
                  <p className="eyebrow"><span className="eyebrow-dot" /> ORDER CONFIRMED</p>
                  <h1>Good sound<br />is on its way.</h1>
                  <p>Thanks for choosing Monoform. Your Aura One order is confirmed.</p>
                  <button className="button-primary" onClick={() => goTo('discover')}>Back to home <ArrowRight aria-hidden="true" /></button>
                </div>
              ) : (
                <>
                  <p className="eyebrow"><span className="eyebrow-dot" /> ALMOST YOURS</p>
                  <h1 className="checkout-title">A few details.<br /><span>Then, just listen.</span></h1>
                  <div className="checkout-security"><LockKeyhole aria-hidden="true" /><span>Encrypted and secure checkout</span><span className="security-divider" /><ShieldCheck aria-hidden="true" /><span>Powered by Stripe</span></div>
                  <div className="payment-surface">
                    <StripeCheckout productId={product.id} onComplete={() => setComplete(true)} />
                  </div>
                </>
              )}
            </div>
            <aside className="order-summary">
              <div className="summary-heading"><span>YOUR ORDER</span><span>01 ITEM</span></div>
              <div className="summary-product">
                <div className="summary-image"><Image src="/aura-headphones.png" alt="Aura One headphones" fill sizes="120px" /></div>
                <div className="summary-product-copy"><span className="summary-name">Aura One</span><span>Wireless headphones</span><span className="summary-finish">{finish} · Qty 1</span></div>
                <span className="summary-price">${(product.priceInCents / 100).toFixed(2)}</span>
              </div>
              <div className="summary-lines"><div><span>Subtotal</span><span>${(product.priceInCents / 100).toFixed(2)}</span></div><div><span>Shipping</span><span className="free-shipping">Complimentary</span></div></div>
              <div className="summary-total"><span>Total</span><strong>${(product.priceInCents / 100).toFixed(2)} <small>USD</small></strong></div>
              <div className="summary-perks"><span><PackageCheck aria-hidden="true" /> Complimentary express shipping</span><span><ShieldCheck aria-hidden="true" /> 30-day listening guarantee</span></div>
              <div className="summary-footnote"><Sparkles aria-hidden="true" /><span>Thoughtfully made. Built to stay with you.</span></div>
            </aside>
          </div>
        )}
      </section>

      <footer className="store-footer">
        <div className="footer-left"><span>© MONOFORM 2026</span><span>DESIGNED FOR YOUR EVERYDAY</span></div>
        <div className="footer-center"><span className="sound-wave"><i /><i /><i /><i /><i /><i /><i /></span> MADE TO BE HEARD</div>
        <div className="footer-right"><span>FOLLOW THE FREQUENCY</span><Volume2 aria-hidden="true" /></div>
      </footer>
    </main>
  )
}
