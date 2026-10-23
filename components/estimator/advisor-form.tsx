"use client"

import { useActionState, useState } from "react"
import { CircleCheck, LoaderCircle, Smartphone, User } from "lucide-react"
import { requestAdvisor, type FormState } from "@/app/(site)/construction-budget/actions"
import { ConsentCheckbox, Field } from "@/components/estimator/field"
import { LocationFields, type LocationOptions } from "@/components/estimator/location-fields"
import { TrackingFields } from "@/components/estimator/tracking-fields"
import { Turnstile } from "@/components/estimator/turnstile"

const initialState: FormState = { status: "idle" }

/** "Talk to an advisor": short consultation lead form. */
export function AdvisorForm({ locations }: { locations: LocationOptions }) {
  const [state, formAction, pending] = useActionState(requestAdvisor, initialState)
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const errors = state.fieldErrors ?? {}

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-center rounded-[22px] bg-white p-8 text-center shadow-brand-md">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-success/10">
          <CircleCheck aria-hidden="true" className="size-8 text-success" strokeWidth={1.75} />
        </span>
        <p className="mt-4 font-display text-2xl font-medium text-navy-700">Thank you{name ? `, ${name.split(" ")[0]}` : ""}!</p>
        <p className="mt-2 text-[15px] text-slate-600">Our advisor will call you soon. Reference: {state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} noValidate aria-busy={pending} className="rounded-[22px] bg-white p-6 shadow-brand-md sm:p-7">
      <h3 className="text-lg font-semibold text-navy-700">Let&apos;s talk about your home</h3>
      <div className="mt-4 flex flex-col gap-2.5">
        <Field label="Your name" icon={User} error={errors.name}>
          {(props) => (
            <input {...props} name="name" autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
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
        <LocationFields options={locations} errors={errors} className="flex flex-col gap-2.5" />
        <ConsentCheckbox error={errors.consent} />
      </div>
      <TrackingFields sourceButton="estimator_advisor" />
      <div className="mt-3">
        <Turnstile resetKey={state} />
      </div>
      {state.message && state.status === "error" && (
        <p role="alert" className="mt-3 rounded-[10px] bg-red-50 px-3 py-2 text-[13px] text-error">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-navy-700 font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-wait disabled:opacity-80"
      >
        {pending && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
        {pending ? "Sending…" : "Request a call back"}
      </button>
    </form>
  )
}
