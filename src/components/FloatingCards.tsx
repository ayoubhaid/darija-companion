'use client'

import { useEffect, useRef } from 'react'

interface Word {
  id: string
  darija: string
  english: string
}

const SPACING = 180
const SPEED = 1.2
const WAVE_AMPLITUDE = 40
const WAVE_FREQUENCY = 0.0025
const WAVE_SPEED = 80
const CENTER_Y = 110

export default function FloatingCards({ label = "Words you'll learn" }: { label?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<{ el: HTMLDivElement; x: number }[]>([])
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    fetch('/api/words')
      .then(res => res.json())
      .then((words: Word[]) => {
        initCards(container, [...words, ...words, ...words])
      })
      .catch(() => {
        initCards(container, [...fallback, ...fallback, ...fallback])
      })

    return () => {
      cancelAnimationFrame(rafRef.current)
      cardsRef.current.forEach(c => c.el.remove())
    }
  }, [])

  function initCards(container: HTMLDivElement, words: Word[]) {
    cardsRef.current.forEach(c => c.el.remove())
    cardsRef.current = []

    words.forEach((word, index) => {
      const el = document.createElement('div')
      el.style.position = 'absolute'
      el.style.width = '140px'
      el.style.height = '90px'
      el.style.borderRadius = '16px'
      el.style.background = 'white'
      el.style.display = 'flex'
      el.style.flexDirection = 'column'
      el.style.alignItems = 'center'
      el.style.justifyContent = 'center'
      el.style.gap = '6px'
      el.style.padding = '12px'
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)'
      el.style.willChange = 'transform'
      el.style.cursor = 'default'
      el.style.userSelect = 'none'

      el.innerHTML = `
        <span style="font-size:17px;font-weight:700;color:#1a1a2e;text-align:center;line-height:1.2;">${word.darija}</span>
        <span style="font-size:12px;font-weight:400;color:#9ca3af;text-align:center;">${word.english}</span>
      `

      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.08)'
      })

      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)'
      })

      container.appendChild(el)
      cardsRef.current.push({ el, x: window.innerWidth + 100 + index * SPACING })
    })

    startTimeRef.current = Date.now()
    cancelAnimationFrame(rafRef.current)
    animate()
  }

  function animate() {
    const time = (Date.now() - startTimeRef.current) / 1000

    const all = cardsRef.current

    all.forEach(card => {
      card.x -= SPEED

      if (card.x < -200) {
        let maxX = -Infinity
        all.forEach(c => {
          if (c !== card && c.x > maxX) maxX = c.x
        })
        card.x = maxX + SPACING
      }

      const wavePhase = (card.x + time * WAVE_SPEED) * WAVE_FREQUENCY
      const waveY = Math.sin(wavePhase) * WAVE_AMPLITUDE
      const rotation = Math.sin(wavePhase) * 5
      const scale = 1 + Math.sin(wavePhase * 2) * 0.03

      card.el.style.left = `${card.x}px`
      card.el.style.top = `${CENTER_Y + waveY}px`
      card.el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`
    })

    rafRef.current = requestAnimationFrame(animate)
  }

  return (
    <div style={{ width: '100%', padding: '40px 0 0' }}>
      <p style={{
        fontSize: '13px',
        color: '#9ca3af',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        marginBottom: '16px',
        paddingLeft: '24px',
      }}>
        {label}
      </p>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '220px',
          overflow: 'hidden',
        }}
      />
    </div>
  )
}

const fallback: Word[] = [
  { id: '1', darija: 'Sbah lkhir', english: 'Good morning' },
  { id: '2', darija: 'Bslama', english: 'Goodbye' },
  { id: '3', darija: 'Shukran', english: 'Thank you' },
  { id: '4', darija: 'Mrhba', english: 'Welcome' },
  { id: '5', darija: 'Wash labas', english: 'How are you' },
  { id: '6', darija: 'Bghit', english: 'I want' },
  { id: '7', darija: 'Smhli', english: 'Excuse me' },
  { id: '8', darija: 'Wakha', english: 'Okay' },
  { id: '9', darija: 'Zwin', english: 'Beautiful' },
  { id: '10', darija: '3afak', english: 'Please' },
  { id: '11', darija: 'Daba', english: 'Now' },
  { id: '12', darija: 'Kbaida', english: 'Tough' },
]
