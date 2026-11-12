"use client"

import { useState, type ReactElement } from "react"
import { ChevronDown, Search } from "lucide-react"
import type { SearchOption, SearchOptions } from "@/lib/data/dealers"
import type { DealerFilter } from "@/lib/domain/dealers"

type SelectFieldProps = {
  label: string
  name: string
  allLabel: string
  options: SearchOption[]
  value: string
  onChange: (value: string) => void
}

function SelectField({ label, name, allLabel, options, value, onChange }: SelectFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-medium text-navy-700">{label}</span>
      <span className="relative block">
        <select
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-[10px] border border-gray-200 bg-white pr-10 pl-3.5 text-[15px] text-gray-800 outline-none focus:border-navy-500 focus:ring-3 focus:ring-navy-50"
        >
          <option value="">{allLabel}</option>
          {options.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.name}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500"
        />
      </span>
    </label>
  )
}

/** A plain GET form to /building-materials, so results are shareable and it works without JS. */
export function DealerSearchForm({ options, initial = {} }: { options: SearchOptions; initial?: DealerFilter }): ReactElement {
  const [material, setMaterial] = useState(initial.material ?? "")
  const [city, setCity] = useState(initial.city ?? "")
  const [brand, setBrand] = useState(initial.brand ?? "")
  const brands = options.brands.filter((option) => !material || option.materialSlug === material)

  function changeMaterial(next: string): void {
    setMaterial(next)
    if (!options.brands.some((option) => option.slug === brand && (!next || option.materialSlug === next))) setBrand("")
  }

  return (
    <form
      action="/building-materials"
      method="get"
      className="grid items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-brand-sm sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_auto]"
    >
      <SelectField label="Material" name="material" allLabel="All materials" options={options.materials} value={material} onChange={changeMaterial} />
      <SelectField label="City" name="city" allLabel="All cities" options={options.cities} value={city} onChange={setCity} />
      <SelectField label="Brand (optional)" name="brand" allLabel="Any brand" options={brands} value={brand} onChange={setBrand} />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-orange-500 px-6 font-semibold whitespace-nowrap text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700 sm:col-span-3 lg:col-span-1"
      >
        <Search aria-hidden="true" className="size-4" />
        Search Sellers
      </button>
    </form>
  )
}
