"use client"

import { useState } from "react"
import Link from "next/link"
import { CircleCheck, Info, MessageCircleQuestion, RotateCcw } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/whatsapp"
import type { BudgetEstimateDetails } from "@/lib/data/leads"
import { floorsLabel, formatLakh, formatRange, formatRupees } from "@/lib/domain/estimate"
import { cn } from "@/lib/utils"
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp"

type Props = {
  refCode: string
  firstName: string
  details: BudgetEstimateDetails
  whatsappNumber: string
  disclaimer: string
}

export function EstimateResult({ refCode, firstName, details, whatsappNumber, disclaimer }: Props) {
  const { estimate } = details
  const [selected, setSelected] = useState(details.packageSlug)
  const pkg = estimate?.packages.find((p) => p.slug === selected) ?? estimate?.packages[0]

  const summary = [
    `${details.areaPerFloorSqft.toLocaleString("en-IN")} sq ft per floor`,
    floorsLabel(details.floors),
    [details.areaLabel, details.cityName].filter(Boolean).join(", "),
  ].join(" · ")

  const whatsappHref = whatsappUrl(
    whatsappNumber,
    whatsappMessage("estimateRequested", {
      name: firstName,
      location: [details.areaLabel, details.cityName].filter(Boolean).join(", "),
      size: details.areaPerFloorSqft.toLocaleString("en-IN"),
      floors: floorsLabel(details.floors),
      leadId: refCode,
    })
  )

  if (!estimate || !pkg) {
    return (
      <div className="mx-auto max-w-[640px] rounded-[22px] bg-white p-7 text-center shadow-brand-lg sm:p-10">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-success/10">
          <CircleCheck aria-hidden="true" className="size-8 text-success" strokeWidth={1.75} />
        </span>
        <h1 className="mt-5 font-display text-[28px] leading-tight font-medium text-navy-700 sm:text-[34px]">
          Thanks{firstName ? `, ${firstName}` : ""}! Your request is in.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          Our team will prepare the estimate for <strong className="text-navy-700">{summary}</strong> and share it
          with you on WhatsApp.
        </p>
        <p className="mt-2 text-sm text-slate-500">Reference: {refCode}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-green-500 px-6 font-semibold text-white transition-colors hover:bg-green-600"
          >
            <WhatsAppIcon className="size-[18px]" />
            Chat on WhatsApp
          </a>
          <Link
            href="/construction-budget"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] border border-navy-700/15 bg-white px-6 font-semibold text-navy-700 hover:bg-navy-50"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            New estimate
          </Link>
        </div>
      </div>
    )
  }

  const maxStage = Math.max(...pkg.stages.map((s) => s.amount), 1)

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-6">
      {/* Summary + packages */}
      <div className="rounded-[22px] bg-navy-900 p-6 text-white shadow-brand-lg sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-orange-50/80">
          {firstName ? `${firstName.toUpperCase()}, YOUR ESTIMATE` : "YOUR ESTIMATE"}
        </p>
        <h1 className="mt-2 font-display text-[clamp(34px,7vw,52px)] leading-[1.05] font-medium tracking-[-0.02em]">
          {formatRange(pkg.total)}
        </h1>
        <p className="mt-2 text-[15px] text-white/75">
          {pkg.name} package · {summary}
        </p>
        <p className="mt-1 text-sm text-white/60">
          {estimate.totalAreaSqft.toLocaleString("en-IN")} sq ft total built-up area · {formatRupees(pkg.ratePerSqft)}/sq ft
        </p>

        <div role="radiogroup" aria-label="Package" className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {estimate.packages.map((p) => {
            const active = p.slug === pkg.slug
            return (
              <button
                key={p.slug}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(p.slug)}
                className={cn(
                  "rounded-[14px] border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500",
                  active ? "border-orange-500 bg-white text-navy-900" : "border-white/15 bg-white/[0.06] hover:bg-white/10"
                )}
              >
                <span className={cn("block text-xs font-semibold tracking-wide uppercase", active ? "text-orange-600" : "text-white/70")}>
                  {p.name}
                </span>
                <span className="mt-1 block font-display text-[22px] leading-tight font-medium">{formatLakh(p.total.mid)}</span>
                <span className={cn("mt-0.5 block text-xs", active ? "text-slate-500" : "text-white/55")}>
                  {formatRupees(p.ratePerSqft)}/sq ft
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-6 flex gap-2 rounded-[12px] bg-white/[0.06] p-3 text-[13px] leading-relaxed text-white/75">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-orange-50/80" />
          {disclaimer} Range shown is ±{estimate.rangePercent}%. Reference {refCode}.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="#advisor"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-orange-500 px-5 font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <MessageCircleQuestion aria-hidden="true" className="size-[18px]" />
            Get exact quote
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[10px] bg-green-500 px-5 font-semibold text-white transition-colors hover:bg-green-600"
          >
            <WhatsAppIcon className="size-[18px]" />
            Discuss on WhatsApp
          </a>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="flex flex-col gap-5">
        {pkg.stages.length > 0 && (
          <section aria-labelledby="stage-title" className="rounded-[22px] border border-hairline bg-white p-6 shadow-brand-sm">
            <h2 id="stage-title" className="text-lg font-semibold text-navy-700">
              Stage-wise breakdown
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{pkg.name} package, approximate</p>
            <ul className="mt-5 flex flex-col gap-3.5">
              {pkg.stages.map((stage) => (
                <li key={stage.name}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-gray-800">{stage.name}</span>
                    <span className="shrink-0 font-semibold text-navy-700">
                      {formatLakh(stage.amount)} <span className="font-normal text-slate-500">· {stage.percent}%</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-field">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${Math.max(2, (stage.amount / maxStage) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pkg.floors.length > 1 && (
          <section aria-labelledby="floor-title" className="rounded-[22px] border border-hairline bg-white p-6 shadow-brand-sm">
            <h2 id="floor-title" className="text-lg font-semibold text-navy-700">
              Floor-wise breakdown
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">Foundation is counted in the ground floor</p>
            <ul className="mt-4 divide-y divide-hairline">
              {pkg.floors.map((floor) => (
                <li key={floor.label} className="flex items-center justify-between py-3 text-[15px]">
                  <span className="text-gray-800">{floor.label}</span>
                  <span className="font-semibold text-navy-700">{formatLakh(floor.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
