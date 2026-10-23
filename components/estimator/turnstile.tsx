"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** Turnstile's "flexible" size is never narrower than this; below it the widget would overflow. */
const FLEXIBLE_MIN_WIDTH = 300

/**
 * Cloudflare Turnstile, always shown so visitors see the check. Adds a hidden
 * `cf-turnstile-response` input to the enclosing form. Renders nothing if no site key is set.
 * `resetKey` changes after each submission, because tokens are single-use.
 */
export function Turnstile({ resetKey }: { resetKey?: unknown }) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const [ready, setReady] = useState(false)
  // Narrow cards (360–375 px phones) leave < 300 px, so switch to the 150×140 "compact" widget.
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    if (container.current) setCompact(container.current.clientWidth < FLEXIBLE_MIN_WIDTH)
  }, [])

  useEffect(() => {
    if (!SITE_KEY || !ready || !container.current || !window.turnstile) return
    const id = window.turnstile.render(container.current, {
      sitekey: SITE_KEY,
      size: container.current.clientWidth < FLEXIBLE_MIN_WIDTH ? "compact" : "flexible",
      appearance: "always",
      theme: "light",
      action: "lead_form",
    })
    widgetId.current = id
    return () => {
      window.turnstile?.remove(id)
      widgetId.current = null
    }
  }, [ready])

  useEffect(() => {
    if (resetKey !== undefined && widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [resetKey])

  if (!SITE_KEY) return null
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      {/* Reserves the widget's height (65px, or 140px compact) so the form doesn't jump when it loads. */}
      <div ref={container} className={compact ? "flex min-h-[140px] justify-center" : "min-h-[65px]"} />
    </>
  )
}
