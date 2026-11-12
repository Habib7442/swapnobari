import type { ReactElement } from "react"
import type { PriceRow } from "@/lib/data/prices"

const rupees = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 })
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
})

export function formatPriceDate(iso: string): string {
  return dateFormat.format(new Date(iso))
}

function price(row: PriceRow): string {
  return `₹${rupees.format(row.price)}`
}

/** A table from 768px up; each row becomes a card below that. */
export function PriceList({ rows }: { rows: PriceRow[] }): ReactElement {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-brand-sm md:block">
        <table className="w-full text-left text-[15px]">
          <thead className="bg-navy-50 text-sm text-navy-700">
            <tr>
              {["City", "Material", "Brand", "Price", "Unit", "Updated"].map((heading) => (
                <th key={heading} scope="col" className="px-5 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-5 py-3.5">{row.city}</td>
                <td className="px-5 py-3.5">{row.material}</td>
                <td className="px-5 py-3.5">{row.brand}</td>
                <td className="px-5 py-3.5 font-semibold text-navy-700">{price(row)}</td>
                <td className="px-5 py-3.5 text-gray-600">{row.unit}</td>
                <td className="px-5 py-3.5 text-gray-600">{formatPriceDate(row.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-brand-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-navy-700">{row.brand}</p>
                <p className="mt-0.5 text-sm text-gray-600">
                  {row.material}, {row.city}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-navy-700">{price(row)}</p>
                <p className="text-[13px] text-gray-600">{row.unit}</p>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-gray-500">Updated {formatPriceDate(row.updatedAt)}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
