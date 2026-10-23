"use client"

import { useActionState, useState } from "react"
import { ArrowRight, ChevronDown, Layers, LoaderCircle, Lock, Ruler, Smartphone, User } from "lucide-react"
import { submitEstimate, type FormState } from "@/app/(site)/construction-budget/actions"
import { ConsentCheckbox, Field } from "@/components/estimator/field"
import { LocationFields, type LocationOptions } from "@/components/estimator/location-fields"
import { TrackingFields } from "@/components/estimator/tracking-fields"
import { Turnstile } from "@/components/estimator/turnstile"
import { ESTIMATOR } from "@/lib/constants"
import { cn } from "@/lib/utils"

const initialState: FormState = { status: "idle" }

/**
 * The cost-estimator form. Saves a lead and redirects to the result page on success.
 * Inputs are controlled so values survive a failed submission (React resets uncontrolled forms).
 */
export function EstimatorCard({
  locations,
  sourceButton,
  title = "Know your construction budget",
  className,
}: {
  locations: LocationOptions
  sourceButton: string
  title?: string
  className?: string
}) {
  const [state, formAction, pending] = useActionState(submitEstimate, initialState)
  const [area, setArea] = useState("")
  const [floors, setFloors] = useState("")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const errors = state.fieldErrors ?? {}

  return (
    <div
      id="budget"
      className={cn(
        "scroll-mt-24 rounded-[22px] border border-white/70 bg-white/94 p-6 shadow-[0_30px_70px_rgba(15,31,58,0.20)] backdrop-blur-[16px] sm:p-7",
        className
      )}
    >
      <form action={formAction} noValidate aria-labelledby="budget-title" aria-busy={pending}>
        <p className="text-[11px] font-semibold tracking-[0.14em] text-orange-600">FREE ESTIMATE</p>
        <h2
          id="budget-title"
          className="mt-2 font-display text-2xl leading-[1.2] font-medium tracking-[-0.01em] text-navy-700"
        >
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">See your cost range instantly. Free, no obligation.</p>

        <div className="mt-5 flex flex-col gap-2.5">
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-2.5">
            <Field label="Built-up area per floor in square feet" icon={Ruler} error={errors.areaPerFloor}>
              {(props) => (
                <input
                  {...props}
                  name="areaPerFloor"
                  inputMode="numeric"
                  placeholder="Area (sq ft)"
                  value={area}
                  onChange={(e) => setArea(e.target.value.replace(/\D/g, "").slice(0, 5))}
                />
              )}
            </Field>
            <Field
              label="Number of floors"
              icon={Layers}
              error={errors.floors}
              trailing={<ChevronDown aria-hidden="true" className="mr-2 size-4 text-slate-400" />}
            >
              {(props) => (
                <select
                  {...props}
                  name="floors"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  className={cn(props.className, "appearance-none pr-9", !floors && "text-slate-500")}
                >
                  <option value="" disabled>
                    Floors
                  </option>
                  {ESTIMATOR.floorOptions.map((o) => (
                    <option key={o.value} value={o.value} className="text-gray-800">
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>

          <LocationFields options={locations} errors={errors} className="flex flex-col gap-2.5" />

          <Field label="Your name" icon={User} error={errors.name}>
            {(props) => (
              <input
                {...props}
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
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
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            )}
          </Field>

          <ConsentCheckbox error={errors.consent} />
        </div>

        <input type="hidden" name="packageSlug" value={ESTIMATOR.defaultPackage} />
        <TrackingFields sourceButton={sourceButton} />
        <div className="mt-3">
          <Turnstile resetKey={state} />
        </div>

        {state.message && (
          <p role="alert" className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-[13px] text-error">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="group mt-3 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-orange-500 text-base font-semibold text-white transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-[0_12px_28px_rgba(242,107,29,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-80"
        >
          {pending ? (
            <>
              <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
              Calculating…
            </>
          ) : (
            <>
              See My Estimate
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform duration-200 ease-brand group-hover:translate-x-[3px]"
              />
            </>
          )}
        </button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <Lock aria-hidden="true" className="size-3.5" />
          Free · instant · no spam
        </p>
      </form>
    </div>
  )
}
