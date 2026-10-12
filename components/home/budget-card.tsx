"use client"

import { useId, useState, type FormEvent, type ReactNode } from "react"
import {
  ArrowRight,
  ChevronDown,
  CircleCheck,
  Layers,
  Lock,
  MapPin,
  Ruler,
  Smartphone,
  User,
  type LucideIcon,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import { cn } from "@/lib/utils"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

type Values = {
  location: string
  size: string
  floors: string
  name: string
  mobile: string
}

type Errors = Partial<Record<keyof Values, string>>

const FLOOR_OPTIONS = ["Ground only", "G+1", "G+2", "G+3"]
const EMPTY: Values = { location: "", size: "", floors: "", name: "", mobile: "" }

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (!values.location.trim()) errors.location = "Enter your city or area."
  const size = Number(values.size)
  if (!values.size) errors.size = "Enter the size in sq ft."
  else if (size < 100 || size > 100000) errors.size = "Enter a size between 100 and 1,00,000 sq ft."
  if (!values.floors) errors.floors = "Choose the number of floors."
  if (values.name.trim().length < 2) errors.name = "Enter your name."
  if (!/^[6-9]\d{9}$/.test(values.mobile)) errors.mobile = "Enter a valid 10-digit mobile number."
  return errors
}

export function BudgetCard({ className, whatsappNumber }: { className?: string; whatsappNumber: string }) {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [locating, setLocating] = useState(false)
  const [done, setDone] = useState(false)

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      setErrors((current) => ({ ...current, location: "Location isn't available. Please type your city or area." }))
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      () => {
        // Coordinates will be captured with the lead once the backend exists; the visitor sees a plain label.
        update("location", "My current location")
        setLocating(false)
      },
      () => {
        setErrors((current) => ({ ...current, location: "Couldn't get your location. Please type your city or area." }))
        setLocating(false)
      },
      { timeout: 10000, maximumAge: 600000 }
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors)[0]
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    // TODO(backend): submit the lead via a Server Action. Nothing is stored or sent yet.
    setDone(true)
  }

  return (
    <div
      id="budget"
      className={cn(
        "scroll-mt-24 rounded-[22px] border border-white/70 bg-white/94 p-6 shadow-[0_30px_70px_rgba(15,31,58,0.20)] backdrop-blur-[16px] sm:p-7",
        className
      )}
    >
      {done ? (
        <div role="status" className="flex flex-col items-center py-10 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-success/10">
            <CircleCheck aria-hidden="true" className="size-8 text-success" strokeWidth={1.75} />
          </span>
          <p className="mt-5 font-display text-[26px] leading-[1.2] font-medium text-navy-700">
            Thanks, {values.name.trim().split(" ")[0]}!
          </p>
          <p className="mt-2 max-w-[18rem] text-[15px] leading-relaxed text-slate-600">
            We&apos;ll share your estimate on WhatsApp shortly.
          </p>
          <a
            href={whatsappUrl(
              whatsappNumber,
              whatsappMessage("estimateRequested", {
                name: values.name,
                location: values.location,
                size: values.size,
                floors: values.floors,
              })
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-12 w-full max-w-[18rem] items-center justify-center gap-2 rounded-[10px] bg-green-500 text-[15px] font-semibold text-white transition-colors hover:bg-green-600"
          >
            <WhatsAppIcon className="size-[18px]" />
            Chat on WhatsApp now
          </a>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-3 min-h-11 text-sm font-semibold text-navy-700 underline decoration-[1.5px] underline-offset-[6px] hover:decoration-orange-500"
          >
            Edit details
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={handleSubmit} aria-labelledby="budget-title">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-orange-600">FREE ESTIMATE</p>
          <h2
            id="budget-title"
            className="mt-2 font-display text-2xl leading-[1.2] font-medium tracking-[-0.01em] text-navy-700"
          >
            Know your construction budget
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">Get an approximate cost in minutes.</p>

          <div className="mt-5 flex flex-col gap-2.5">
            <Field
              label="Location (city / area)"
              icon={MapPin}
              error={errors.location}
              trailing={
                <button
                  type="button"
                  onClick={locate}
                  disabled={locating}
                  className="pointer-events-auto min-h-11 px-2 text-[13px] font-semibold whitespace-nowrap text-orange-600 hover:text-orange-500 disabled:opacity-60"
                >
                  {locating ? "Locating…" : "Use my location"}
                </button>
              }
            >
              {(props) => (
                <input
                  {...props}
                  name="location"
                  autoComplete="address-level2"
                  placeholder="City or area"
                  value={values.location}
                  onChange={(e) => update("location", e.target.value)}
                  className={cn(props.className, "pr-32")}
                />
              )}
            </Field>

            <Field label="Plot / house size (sq ft)" icon={Ruler} error={errors.size}>
              {(props) => (
                <input
                  {...props}
                  name="size"
                  inputMode="numeric"
                  placeholder="Plot / house size (sq ft)"
                  value={values.size}
                  onChange={(e) => update("size", e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              )}
            </Field>

            <Field
              label="Number of floors"
              icon={Layers}
              error={errors.floors}
              trailing={<ChevronDown aria-hidden="true" className="pointer-events-none mr-2 size-4 text-slate-400" />}
            >
              {(props) => (
                <select
                  {...props}
                  name="floors"
                  value={values.floors}
                  onChange={(e) => update("floors", e.target.value)}
                  className={cn(props.className, "appearance-none pr-10", !values.floors && "text-slate-500")}
                >
                  <option value="" disabled>
                    Number of floors
                  </option>
                  {FLOOR_OPTIONS.map((option) => (
                    <option key={option} value={option} className="text-gray-800">
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </Field>

            <Field label="Your name" icon={User} error={errors.name}>
              {(props) => (
                <input
                  {...props}
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              )}
            </Field>

            <Field label="Mobile / WhatsApp number" icon={Smartphone} error={errors.mobile} prefix="+91">
              {(props) => (
                <input
                  {...props}
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="Mobile / WhatsApp"
                  value={values.mobile}
                  onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              )}
            </Field>
          </div>

          <button
            type="submit"
            className="group mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-base font-semibold text-white transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_12px_28px_rgba(242,107,29,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
          >
            Get Estimate Now
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-200 ease-brand group-hover:translate-x-[3px]"
            />
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Lock aria-hidden="true" className="size-3.5" />
            Free · takes less than a minute · no spam
          </p>
        </form>
      )}
    </div>
  )
}

type ControlProps = {
  id: string
  className: string
  "aria-invalid": boolean
  "aria-describedby": string | undefined
}

function Field({
  label,
  icon: Icon,
  error,
  prefix,
  trailing,
  children,
}: {
  label: string
  icon: LucideIcon
  error?: string
  prefix?: string
  trailing?: ReactNode
  children: (props: ControlProps) => ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div>
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
          "aria-describedby": error ? errorId : undefined,
          className: cn(
            "h-12 w-full rounded-[14px] border-[1.5px] border-transparent bg-field pr-4 text-[15px] text-gray-800 transition outline-none placeholder:text-slate-500",
            "focus:border-navy-700 focus:bg-white focus:shadow-[0_0_0_4px_rgba(19,41,75,0.08)]",
            "aria-invalid:border-error/60 aria-invalid:bg-white",
            prefix ? "pl-[5.5rem]" : "pl-11"
          ),
        })}
        {trailing && <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
      </div>
      <p id={errorId} aria-live="polite" className="mt-1.5 text-[13px] text-error empty:hidden">
        {error}
      </p>
    </div>
  )
}
