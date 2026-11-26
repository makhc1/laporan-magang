// Controller smooth scrolling inersial ringan (frame-rate independent, gaya Lenis)
// - Menghaluskan input mouse wheel & trackpad tanpa mengganggu touch mobile, modal, atau zoom.
// - Mendukung scroll terarah ke section (#home, #stage, #logbook) dengan easing halus.
// - Otomatis nonaktif jika pengguna mengaktifkan prefers-reduced-motion: reduce.

const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
])

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getMaxScroll() {
  const doc = document.documentElement
  const body = document.body
  const scrollHeight = Math.max(doc.scrollHeight, body ? body.scrollHeight : 0)
  return Math.max(0, scrollHeight - window.innerHeight)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function normalizeWheelDelta(event) {
  let dy = event.deltaY
  if (event.deltaMode === 1) {
    dy *= 24
  } else if (event.deltaMode === 2) {
    dy *= window.innerHeight * 0.85
  }
  return dy
}

function hasScrollableParent(node, deltaY) {
  let el = node instanceof Element ? node : node?.parentElement
  while (el && el !== document.body && el !== document.documentElement) {
    if (el.hasAttribute('data-smooth-scroll-prevent')) return true
    const style = window.getComputedStyle(el)
    const overflowY = style.overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
      const canScrollDown = deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1
      const canScrollUp = deltaY < 0 && el.scrollTop > 1
      if (canScrollDown || canScrollUp) return true
    }
    el = el.parentElement
  }
  return false
}

function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function createSmoothScroller({ damping = 9.5, wheelMultiplier = 1 } = {}) {
  let currentY = window.scrollY
  let targetY = window.scrollY
  let lastWrittenY = window.scrollY
  let rafId = 0
  let lastTime = 0
  let paused = false
  let destroyed = false
  let tween = null

  const stopLoop = () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId)
      rafId = 0
    }
    lastTime = 0
  }

  const syncFromWindow = () => {
    currentY = window.scrollY
    targetY = window.scrollY
    lastWrittenY = window.scrollY
    tween = null
    stopLoop()
  }

  const writeScroll = (y) => {
    const clamped = clamp(y, 0, getMaxScroll())
    lastWrittenY = clamped
    window.scrollTo({ top: clamped, behavior: 'instant' })
  }

  const tick = (now) => {
    if (destroyed || paused) {
      stopLoop()
      return
    }

    if (!lastTime) lastTime = now
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000))
    lastTime = now

    if (tween) {
      const progress = clamp((now - tween.startTime) / tween.duration, 0, 1)
      const eased = easeOutExpo(progress)
      currentY = tween.from + (tween.to - tween.from) * eased
      targetY = currentY
      writeScroll(currentY)

      if (progress >= 1) {
        currentY = tween.to
        targetY = tween.to
        writeScroll(currentY)
        tween = null
        stopLoop()
        return
      }

      rafId = window.requestAnimationFrame(tick)
      return
    }

    targetY = clamp(targetY, 0, getMaxScroll())
    const diff = targetY - currentY
    if (Math.abs(diff) < 0.35) {
      currentY = targetY
      writeScroll(currentY)
      stopLoop()
      return
    }

    const alpha = 1 - Math.exp(-damping * dt)
    currentY += diff * alpha
    writeScroll(currentY)
    rafId = window.requestAnimationFrame(tick)
  }

  const ensureLoop = () => {
    if (!rafId && !paused && !destroyed) {
      lastTime = 0
      rafId = window.requestAnimationFrame(tick)
    }
  }

  const onWheel = (event) => {
    if (paused || destroyed || prefersReducedMotion()) return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaY) < 1) return

    const dy = normalizeWheelDelta(event)
    if (!dy) return
    if (hasScrollableParent(event.target, dy)) return

    event.preventDefault()

    // Ambil alih mulus jika sebelumnya sedang tween ke section
    if (tween) {
      tween = null
      currentY = window.scrollY
      targetY = window.scrollY
    } else if (!rafId) {
      currentY = window.scrollY
      targetY = window.scrollY
    }

    targetY = clamp(targetY + dy * wheelMultiplier, 0, getMaxScroll())
    ensureLoop()
  }

  const onScroll = () => {
    if (paused || destroyed) return
    // Jika posisi scroll berubah dari luar (drag scrollbar, Ctrl+F, tombol keyboard),
    // sinkronkan state agar kontrol native tidak bentrok.
    if (Math.abs(window.scrollY - lastWrittenY) > 2) {
      syncFromWindow()
    }
  }

  const onKeyDown = (event) => {
    if (paused || destroyed) return
    if (SCROLL_KEYS.has(event.key)) {
      tween = null
      stopLoop()
    }
  }

  const onResize = () => {
    if (destroyed) return
    const maxY = getMaxScroll()
    targetY = clamp(targetY, 0, maxY)
    currentY = clamp(window.scrollY, 0, maxY)
    lastWrittenY = currentY
  }

  document.documentElement.classList.add('smooth-scroll-active')
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeyDown, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })

  return {
    pause() {
      paused = true
      tween = null
      stopLoop()
    },
    resume() {
      paused = false
      syncFromWindow()
    },
    scrollToTarget(selector) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector
      if (!el) return

      const style = window.getComputedStyle(el)
      const marginTop = parseFloat(style.scrollMarginTop) || 0
      const rect = el.getBoundingClientRect()
      const destY = clamp(window.scrollY + rect.top - marginTop, 0, getMaxScroll())

      if (prefersReducedMotion()) {
        window.scrollTo({ top: destY, behavior: 'auto' })
        syncFromWindow()
        return
      }

      const startY = window.scrollY
      const dist = Math.abs(destY - startY)
      if (dist < 2) return

      const duration = clamp(520 + dist * 0.22, 580, 1050)
      currentY = startY
      targetY = destY
      lastWrittenY = startY
      tween = {
        from: startY,
        to: destY,
        startTime: performance.now(),
        duration,
      }
      ensureLoop()
    },
    destroy() {
      destroyed = true
      stopLoop()
      document.documentElement.classList.remove('smooth-scroll-active')
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    },
  }
}
