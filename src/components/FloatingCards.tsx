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
  const cardsRef = useRef<{ el: HTMLDivElement; x: number; y: number; targetX: number; targetY: number; vx: number; vy: number }[]>([])
  const wordsRef = useRef<Word[]>([])
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const fetchWords = async () => {
      try {
        const res = await fetch('/api/words')
        const data = await res.json()
        wordsRef.current = data.slice(0, 30)
        initCards()
      } catch (err) {
        console.error('Failed to fetch words:', err)
      }
    }

    const initCards = () => {
      const container = containerRef.current
      if (!container || wordsRef.current.length === 0) return

      container.innerHTML = ''
      cardsRef.current = []

      wordsRef.current.forEach((word, i) => {
        const card = document.createElement('div')
        card.className = 'absolute left-0 top-0 w-[160px] p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 cursor-pointer hover:scale-105 transition-transform'
        card.innerHTML = `
          <p class="font-semibold text-zinc-900 text-base">${word.darija}</p>
          <p class="text-sm text-zinc-500">${word.english}</p>
        `
        card.style.opacity = '0'
        container.appendChild(card)

        cardsRef.current.push({
          el: card,
          x: 0,
          y: 0,
          targetX: 0,
          targetY: 0,
          vx: 0,
          vy: 0
        })
      })

      positionCards()
      animate()
    }

    const positionCards = () => {
      const containerWidth = container.offsetWidth
      const containerHeight = 220

      cardsRef.current.forEach((card, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        
        card.targetX = col * SPACING + (220 - 160) / 2
        card.targetY = row * 80 + 20

        if (card.targetX > containerWidth - 180) {
          card.targetX = -1000
          card.targetY = -1000
        }

        card.x = card.targetX + (Math.random() - 0.5) * 30
        card.y = card.targetY + (Math.random() - 0.5) * 20
      })
    }

    const animate = () => {
      const time = performance.now()
      
      cardsRef.current.forEach((card, i) => {
        if (card.targetX < 0) {
          card.el.style.opacity = '0'
          return
        }

        card.el.style.opacity = '1'

        card.x += (card.targetX - card.x) * 0.05
        card.y += (card.targetY - card.y) * 0.05

        const waveOffset = Math.sin(time * WAVE_FREQUENCY + i * 0.5) * WAVE_AMPLITUDE
        const y = card.y + waveOffset

        card.el.style.transform = `translate(${card.x}px, ${y}px)`
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    fetchWords()

    const handleResize = () => {
      positionCards()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-center mt-8">
      <p className="text-sm text-zinc-500 mb-4">{label}</p>
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
