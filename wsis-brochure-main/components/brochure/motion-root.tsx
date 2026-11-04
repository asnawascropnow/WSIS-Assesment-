'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

/**
 * One place that owns smooth scrolling and all declarative scroll animations.
 * Components opt in with data attributes; section-specific timelines (the pinned
 * horizontal story) live in their own components and are created before this runs.
 */
export function MotionRoot() {
  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      root.classList.remove('js-motion')
      return
    }

    let lenis: Lenis | null = null
    let ctx: gsap.Context | null = null
    const tick = (time: number) => lenis?.raf(time * 1000)

    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = link?.getAttribute('href')
      if (!link || !hash || hash.length < 2) return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      event.preventDefault()
      lenis?.scrollTo(target, { offset: hash === '#top' ? 0 : -8, duration: 1.4 })
      history.replaceState(null, '', hash)
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }

    try {
      gsap.registerPlugin(ScrollTrigger)
      lenis = new Lenis({ duration: 1.15, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      document.addEventListener('click', onAnchorClick)

      ctx = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
        intro
          .to('[data-hero-media]', { clipPath: 'inset(0% 0% 0% 0% round 44px)', duration: 1.6, ease: 'expo.inOut' }, 0)
          .to('[data-hero-line] > span', { y: 0, duration: 1.3, stagger: 0.12 }, 0.35)
          .to('[data-hero-pill]', { '--pill': 1, duration: 1.1 }, 0.75)
          .to('[data-hero-blur]', { opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.08, ease: 'power3.out' }, 0.7)

        gsap.to('[data-hero-parallax]', {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        })

        gsap.utils.toArray<HTMLElement>('[data-lines]').forEach((el) => {
          gsap.from(el.querySelectorAll('.line > span'), {
            yPercent: 110,
            duration: 1.0,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          if (el.tagName === 'P') return
          gsap.from(el, {
            y: 28,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: Number(el.dataset.reveal) || 0,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        // Split paragraph text nodes into word spans (.w) for typing animation
        function splitTextIntoWords(el: HTMLElement) {
          if (el.querySelector('.w, .lc')) return

          const walk = (parent: Node) => {
            const children = Array.from(parent.childNodes)
            children.forEach((child) => {
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent || ''
                if (!text) return
                const tokens = text.split(/(\s+)/)
                const frag = document.createDocumentFragment()
                tokens.forEach((token) => {
                  if (!token) return
                  if (/^\s+$/.test(token)) {
                    frag.appendChild(document.createTextNode(' '))
                  } else {
                    const span = document.createElement('span')
                    span.className = 'w'
                    span.textContent = token
                    frag.appendChild(span)
                  }
                })
                child.replaceWith(frag)
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                if ((child as HTMLElement).classList?.contains('w')) return
                walk(child)
              }
            })
          }

          walk(el)
        }

        // Typing text reveal effect across each and every content paragraph when scrolled into section
        const typingParagraphs = gsap.utils.toArray<HTMLElement>(
          'p:not([data-letters]):not(.sr-only):not(.problem__stat):not(.target__num), .scrub'
        ).filter((el) => {
          if (el.closest('[data-hero-media], .sr-only')) {
            return false
          }
          return true
        })

        typingParagraphs.forEach((p) => {
          splitTextIntoWords(p)
          const words = p.querySelectorAll('.w')
          if (!words.length) return

          const parentReveal = p.closest<HTMLElement>('[data-reveal]')
          const revealDelay = parentReveal && parentReveal !== p 
            ? (Number(parentReveal.dataset.reveal) || 0) + 0.15 
            : 0

          gsap.fromTo(
            words,
            { opacity: 0, y: 4 },
            {
              opacity: 1,
              y: 0,
              duration: 0.3,
              delay: revealDelay,
              stagger: {
                each: 0.032, // Typing in left to right
                from: 'start',
              },
              ease: 'power2.out',
              scrollTrigger: {
                trigger: parentReveal ?? p,
                start: 'top 85%',
                once: true,
              },
            }
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-letters]').forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll('.lc'),
            { yPercent: 115 },
            {
              yPercent: 0,
              duration: 0.8,
              ease: 'expo.out',
              stagger: { amount: 0.6, from: 'start' },
              scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
          const amount = Number(el.dataset.drift) || 12
          gsap.fromTo(
            el,
            { xPercent: amount },
            {
              xPercent: -amount,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax) || 10
          gsap.fromTo(
            el,
            { yPercent: -amount },
            {
              yPercent: amount,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
          gsap.from(el, {
            clipPath: 'inset(100% 0% 0% 0% round 44px)',
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-rotate]').forEach((el) => {
          gsap.fromTo(
            el,
            { rotate: -24, scale: 1.08 },
            {
              rotate: 24,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((el) => {
          gsap.fromTo(
            el,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: 'power2.out',
              scrollTrigger: { trigger: el.closest('svg')?.parentElement ?? el, start: 'top 90%', once: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-grow]').forEach((el) => {
          gsap.from(el, {
            scaleX: 0,
            duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-fill]').forEach((el) => {
          const scope = el.closest('section') ?? el
          gsap.fromTo(
            el,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: { trigger: scope, start: 'top 60%', end: 'bottom 70%', scrub: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('[data-curtain]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(0% 4% 0% 4% round 44px 44px 0px 0px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 44px 44px 0px 0px)',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: true },
            },
          )
        })
      })

      ScrollTrigger.refresh()
    } catch {
      root.classList.remove('js-motion')
    }

    return () => {
      ctx?.revert()
      gsap.ticker.remove(tick)
      lenis?.destroy()
      document.removeEventListener('click', onAnchorClick)
    }
  }, [])

  return null
}

/** Splits a sentence into word spans for the scroll-scrubbed reading effect. */
export function ScrubWords({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="w">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}

/** Oversized outlined section title that drifts sideways with scroll. Decorative; the real heading lives below it. */
export function SectionBand({
  title,
  reverse,
  className,
}: {
  title: string
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={`band ${className ?? ''}`} aria-hidden="true">
      <span data-drift={reverse ? '-10' : '10'}>
        {title} <em>·</em> {title} <em>·</em> {title}
      </span>
    </div>
  )
}

/** A paragraph whose words brighten one by one as it scrolls through the viewport. */
export function ScrubText({ text, className }: { text: string; className?: string }) {
  return (
    <p className={`scrub ${className ?? ''}`} data-scrub-words>
      <ScrubWords text={text} />
    </p>
  )
}

type LetterPart = string | { strong: string }

/** Letter-by-letter slide-up reveal; each word is a clipping window so letters rise from below. */
export function SplitLetters({ parts, className }: { parts: LetterPart[]; className?: string }) {
  const plain = parts.map((p) => (typeof p === 'string' ? p : p.strong)).join('')

  const renderWords = (text: string, keyBase: string) =>
    text.split(/(\s+)/).map((token, i) => {
      if (!token) return null
      if (/^\s+$/.test(token)) return ' '
      return (
        <span key={`${keyBase}-${i}`} className="lw">
          {Array.from(token).map((ch, j) => (
            <span key={j} className="lc">
              {ch}
            </span>
          ))}
        </span>
      )
    })

  return (
    <p className={className} data-letters>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {parts.map((p, i) =>
          typeof p === 'string' ? (
            renderWords(p, `p${i}`)
          ) : (
            <strong key={i}>{renderWords(p.strong, `s${i}`)}</strong>
          ),
        )}
      </span>
    </p>
  )
}
