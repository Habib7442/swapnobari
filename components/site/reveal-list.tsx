"use client"

import { useEffect, useRef, type ReactNode } from "react"

type RevealListProps = { className?: string; children: ReactNode }

/**
 * An <ol> whose items can fade up the first time it scrolls into view.
 * Items stay visible from the server; the list only switches to `data-reveal="pending"` after hydration,
 * when it is still below the viewport and the user has not asked for reduced motion.
 * Items style themselves with `group-data-[reveal=pending]:` and `group-data-[reveal=in]:`.
 */
export function RevealList({ className, children }: RevealListProps) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const node = list.current
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (node.getBoundingClientRect().top < window.innerHeight) return

    node.dataset.reveal = "pending"
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        node.dataset.reveal = "in"
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <ol ref={list} className={className}>
      {children}
    </ol>
  )
}
