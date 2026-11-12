import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BACKGROUNDS = {
  white: "bg-white",
  "gray-50": "bg-gray-50",
  "sanskar-cream": "bg-sanskar-cream",
  "navy-900": "bg-navy-900",
} as const;

type SectionProps = {
  background: keyof typeof BACKGROUNDS;
  /** Anchor target; the scroll margin keeps it clear of the fixed header. */
  id?: string;
  /** Id of the heading that names this section. */
  labelledBy?: string;
  /** Absolutely positioned content outside the container, such as an edge image. */
  decoration?: ReactNode;
  children: ReactNode;
};

/** Every home section: the site container and one vertical rhythm (48 / 64 / 80 px). */
export function Section({
  background,
  id,
  labelledBy,
  decoration,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "scroll-mt-20 py-12 md:py-16 lg:py-20",
        decoration ? "relative overflow-hidden" : undefined,
        BACKGROUNDS[background],
      )}
    >
      {decoration}
      <div
        className={cn(
          "mx-auto max-w-[1440px] px-5 md:px-8 xl:px-12",
          decoration ? "relative" : undefined,
        )}
      >
        {children}
      </div>
    </section>
  );
}
