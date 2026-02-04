import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './TestimonialCarousel.css'

type Testimonial = {
  name: string
  role: string
  quote: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Mohit Gupta',
    role: 'Data Analyst',
    quote:
      'Thank you, Classbot, for providing an affordable application with excellent student Data management and fee management features perfect for our coaching institute!',
    avatar: 'https://i.pravatar.cc/160?img=12'
  },
  {
    name: 'Hannah Cole',
    role: 'Operations Lead',
    quote:
      'Classbot gives our teams total clarity. The dashboards, alerts, and role-based access make onboarding new staff painless and fast.',
    avatar: 'https://i.pravatar.cc/160?img=24'
  },
  {
    name: 'Luis Fernández',
    role: 'School Owner',
    quote:
      'We switched to Classbot last year and never looked back. Parents love the mobile check-ins and we love the automatic fee tracking.',
    avatar: 'https://i.pravatar.cc/160?img=33'
  },
  {
    name: 'Sahana Iyer',
    role: 'Academic Coordinator',
    quote:
      'Scheduling, reminders, assessments—everything lives in one beautiful place now. Classbot feels like it was designed just for us.',
    avatar: 'https://i.pravatar.cc/160?img=47'
  },
  {
    name: 'Trevor Miles',
    role: 'Founder, Miles Academy',
    quote:
      'Our coaching centers run on Classbot. The automation saves our mentors hours each week and the analytics keep us sharp.',
    avatar: 'https://i.pravatar.cc/160?img=58'
  }
]

const QuoteIcon = () => (
  <svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    <path d="M26.2 24.9c0 6-1.4 10.5-4.2 13.6-2.8 3.1-6.6 4.7-11.3 4.7v-7c3.1 0 5.3-.9 6.7-2.7 1.4-1.8 2.1-4.1 2.1-7h-6.6V17h13.3v7.9Zm27.3 0c0 6-1.4 10.5-4.2 13.6-2.8 3.1-6.6 4.7-11.3 4.7v-7c3.1 0 5.3-.9 6.7-2.7 1.4-1.8 2.1-4.1 2.1-7h-6.6V17h13.3v7.9Z" />
  </svg>
)

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragCurrentX = useRef(0)
  const intervalRef = useRef<number | undefined>(undefined)
  const total = testimonials.length

  const visibleCards = useMemo(() => {
    const getIndex = (offset: number) => (activeIndex + offset + total) % total
    return [
      { data: testimonials[getIndex(-1)], position: 'left' as const, key: getIndex(-1) },
      { data: testimonials[getIndex(0)], position: 'center' as const, key: getIndex(0) },
      { data: testimonials[getIndex(1)], position: 'right' as const, key: getIndex(1) }
    ]
  }, [activeIndex, total])

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (isPaused || isDragging) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = window.setInterval(nextSlide, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, isDragging, nextSlide])

  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true)
    dragStartX.current = clientX
    dragCurrentX.current = clientX
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    dragCurrentX.current = clientX
  }, [isDragging])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    const diff = dragCurrentX.current - dragStartX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
  }, [isDragging, nextSlide, prevSlide])

  return (
    <section
      className="testimonial-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-header">
        <h1 className="section-title">Why People Choose Us</h1>
      </div>

      <div
        className="carousel-container"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="cards-wrapper">
          {visibleCards.map(({ data, position, key }) => (
            <article
              key={key}
              className={`testimonial-card ${position}`}
              data-position={position}
            >
              <div className="quote-icon">
                <QuoteIcon />
              </div>

              <blockquote className="testimonial-text">{data.quote}</blockquote>

              <footer className="testimonial-footer">
                <div className="avatar-wrapper">
                  <img
                    src={data.avatar}
                    alt={`${data.name} headshot`}
                    className="avatar-image"
                    loading="lazy"
                  />
                </div>
                <div className="author-info">
                  <div className="author-name">{data.name}</div>
                  <div className="author-role">{data.role}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>

      <nav className="carousel-navigation" aria-label="Testimonial navigation">
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            className={`nav-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`View testimonial from ${item.name}`}
            aria-current={index === activeIndex ? 'true' : 'false'}
            type="button"
          />
        ))}
      </nav>
    </section>
  )
}
