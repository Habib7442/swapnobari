"use client"

import { useId, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ControlProps = {
  id: string
  className: string
  "aria-invalid": boolean
  "aria-describedby": string | undefined
}

/** Labelled input shell: left icon, optional +91 prefix, optional trailing element, inline error. */
export function Field({
  label,
  icon: Icon,
  error,
  prefix,
  trailing,
  hint,
  children,
}: {
  label: string
  icon: LucideIcon
  error?: string
  prefix?: string
  trailing?: ReactNode
  hint?: string
  children: (props: ControlProps) => ReactNode
}) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-slate-400"
          strokeWidth={1.75}
        />
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-11 -translate-y-1/2 border-r border-slate-300 pr-2.5 text-[15px] text-gray-800"
          >
            {prefix}
          </span>
        )}
        {children({
          id,
          "aria-invalid": Boolean(error),
          "aria-describedby": describedBy,
          className: cn(
            "h-12 w-full min-w-0 rounded-[14px] border-[1.5px] border-transparent bg-field pr-4 text-[15px] text-gray-800 transition outline-none placeholder:text-slate-500",
            "focus:border-navy-700 focus:bg-white focus:shadow-[0_0_0_4px_rgba(19,41,75,0.08)]",
            "aria-invalid:border-error/60 aria-invalid:bg-white",
            prefix ? "pl-[5.5rem]" : "pl-11"
          ),
        })}
        {trailing && (
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">{trailing}</span>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} aria-live="polite" className="mt-1.5 text-[13px] text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function ConsentCheckbox({ error }: { error?: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-slate-600">
        <input
          id={id}
          name="consent"
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded accent-navy-700"
        />
        <span>
          I agree to be contacted by Swapnobari about my enquiry. See our{" "}
          <a href="/privacy" className="font-medium text-navy-700 underline underline-offset-2">
            privacy policy
          </a>
          .
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} aria-live="polite" className="mt-1.5 text-[13px] text-error">
          {error}
        </p>
      )}
    </div>
  )
}
