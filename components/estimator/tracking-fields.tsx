"use client"

import { useEffect, useState } from "react"

const UTM_KEYS = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_term", "utmTerm"],
  ["utm_content", "utmContent"],
] as const

/**
 * Hidden source/UTM inputs (PRD §6.3). Filled from window.location after mount: this avoids
 * hydration mismatches and keeps dynamic routes prerenderable (no usePathname at build time).
 * Values are controlled: React resets a form's uncontrolled fields after every submit, which
 * would blank them for a retry (e.g. after a failed bot check).
 */
export function TrackingFields({ sourceButton }: { sourceButton: string }) {
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const next: Record<string, string> = { sourcePage: window.location.pathname }
    for (const [param, field] of UTM_KEYS) next[field] = params.get(param) ?? ""
    for (const key of Object.keys(next)) next[key] = next[key].slice(0, 200)
    // Read from window after mount (see above), so setting state in the effect is intended.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(next)
  }, [])

  return (
    <span hidden>
      <input type="hidden" name="sourcePage" value={values.sourcePage ?? ""} readOnly />
      <input type="hidden" name="sourceButton" value={sourceButton} readOnly />
      {UTM_KEYS.map(([, field]) => (
        <input key={field} type="hidden" name={field} value={values[field] ?? ""} readOnly />
      ))}
    </span>
  )
}
