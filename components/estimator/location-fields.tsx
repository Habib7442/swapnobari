"use client"

import { useState } from "react"
import { Building2, ChevronDown, MapPin } from "lucide-react"
import { Field } from "@/components/estimator/field"
import type { FieldErrors } from "@/lib/validation/estimator"

export type LocationOptions = {
  cities: { id: string; name: string }[]
  areas: { id: string; cityId: string; name: string }[]
}

const OTHER = "__other__"
const chevron = <ChevronDown aria-hidden="true" className="mr-2 size-4 text-slate-400" />

/**
 * City + area. One active city → the city is a hidden input. Areas from the DB → a select with
 * "Other"; no areas yet → a free-text locality field.
 */
export function LocationFields({
  options,
  errors,
  className,
}: {
  options: LocationOptions
  errors?: FieldErrors
  className?: string
}) {
  const { cities, areas } = options
  const [cityId, setCityId] = useState(cities[0]?.id ?? "")
  const [areaChoice, setAreaChoice] = useState("")
  const [areaOther, setAreaOther] = useState("")

  const cityAreas = areas.filter((a) => a.cityId === cityId)
  const cityName = cities.find((c) => c.id === cityId)?.name ?? ""
  const showOther = cityAreas.length === 0 || areaChoice === OTHER

  return (
    <div className={className}>
      {cities.length <= 1 ? (
        <input type="hidden" name="cityId" value={cityId} />
      ) : (
        <Field label="City" icon={Building2} error={errors?.cityId} trailing={chevron}>
          {(props) => (
            <select
              {...props}
              name="cityId"
              value={cityId}
              onChange={(e) => {
                setCityId(e.target.value)
                setAreaChoice("")
              }}
              className={`${props.className} appearance-none pr-10`}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}

      {cityAreas.length > 0 && (
        <Field label="Area" icon={MapPin} error={showOther ? undefined : errors?.areaOther} trailing={chevron}>
          {(props) => (
            <select
              {...props}
              name="areaId"
              value={areaChoice === OTHER ? "" : areaChoice}
              onChange={(e) => setAreaChoice(e.target.value)}
              className={`${props.className} appearance-none pr-10 ${areaChoice ? "" : "text-slate-500"}`}
            >
              <option value="" disabled>
                Area in {cityName}
              </option>
              {cityAreas.map((a) => (
                <option key={a.id} value={a.id} className="text-gray-800">
                  {a.name}
                </option>
              ))}
              <option value={OTHER} className="text-gray-800">
                Other / not listed
              </option>
            </select>
          )}
        </Field>
      )}

      {showOther && (
        <Field label={`Area or locality${cityName ? ` in ${cityName}` : ""}`} icon={MapPin} error={errors?.areaOther}>
          {(props) => (
            <input
              {...props}
              name="areaOther"
              autoComplete="address-level3"
              placeholder={cityName ? `Area / locality in ${cityName}` : "Area / locality"}
              value={areaOther}
              onChange={(e) => setAreaOther(e.target.value)}
              maxLength={120}
            />
          )}
        </Field>
      )}
    </div>
  )
}
