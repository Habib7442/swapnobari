import type { ReactNode } from "react"

type SectionHeaderProps = {
  id: string
  eyebrow: string
  title: string
  subtitle?: string
  /** Right-side link, such as "View All →". */
  action?: ReactNode
}

export function SectionHeader({ id, eyebrow, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="max-w-2xl min-w-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-orange-500 uppercase">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl leading-tight font-bold text-navy-700 md:text-[32px]">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-gray-500 md:text-base">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
