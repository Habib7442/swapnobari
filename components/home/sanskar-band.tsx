import type { CSSProperties, ReactElement } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { SANSKAR_BAND_IMAGE, SANSKAR_STAGES } from "@/lib/content/home";
import { getWhatsAppNumber } from "@/lib/env";
import { cn } from "@/lib/utils";
import { whatsappMessage, whatsappUrl } from "@/lib/whatsapp";
import { Section } from "@/components/site/section";

/** Width of the decorative image on lg+. The content padding is derived from it, so the two can't drift. */
const IMAGE_WIDTH = "18vw";
const imageVar = { "--sanskar-img": IMAGE_WIDTH } as CSSProperties;

/**
 * lg+ with an image: pad the content so it starts 32px right of the image (24px gap + room for the
 * scrollbar, since vw includes it). The image is anchored to the band's edge but the content sits in the
 * centred 1440px container, so the container's own left offset, (100vw - 1440px) / 2 plus its gutter
 * (32px lg, 48px xl), is subtracted. Never negative.
 */
const CONTENT_OFFSET =
  "lg:[--gutter:32px] xl:[--gutter:48px] lg:pl-[max(0px,calc(var(--sanskar-img)_+_32px_-_max(0px,(100vw_-_1440px)_/_2)_-_var(--gutter)))]";

export function SanskarBand(): ReactElement {
  const image = SANSKAR_BAND_IMAGE;

  return (
    <Section
      labelledBy="sanskar-title"
      background="sanskar-cream"
      decoration={
        image ? (
          <div
            aria-hidden="true"
            style={imageVar}
            className="absolute inset-y-0 left-0 hidden w-[var(--sanskar-img)] [mask-image:linear-gradient(to_right,black_55%,transparent)] lg:block"
          >
            <Image
              src={image}
              alt=""
              fill
              sizes={IMAGE_WIDTH}
              className="object-cover object-[28%_center]"
            />
          </div>
        ) : undefined
      }
    >
      {/* lg+: the whole block (header, stages, CTA) starts right of the image, so no text ever sits over it. */}
      <div
        style={image ? imageVar : undefined}
        className={cn(image && CONTENT_OFFSET)}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="min-w-0 lg:flex-1">
            <h2
              id="sanskar-title"
              className="font-sanskar text-[28px] leading-[1.2] font-bold text-sanskar-maroon lg:text-[40px]"
            >
              Shubh Nirman Sanskar™
            </h2>
            <p className="mt-2 text-base text-sanskar-brown sm:text-lg">
              Auspicious Beginnings at Every Important Stage of Your Home
            </p>
          </div>
          <blockquote className="max-w-md border-l border-sanskar-brown/30 lg:max-w-[420px] pl-5 font-sanskar text-[17px] leading-relaxed text-sanskar-brown italic sm:text-lg">
            A home is not built in one day. Its auspicious journey
            shouldn&apos;t be limited to one ritual.
          </blockquote>
        </div>

        {/* Mobile: dashed timeline. md: 3 + 3 grid. lg: six columns with connectors. */}
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-6 lg:gap-4">
          {SANSKAR_STAGES.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <li
                key={stage.name}
                className="relative flex items-start gap-4 md:flex-col md:items-center md:gap-3 md:text-center"
              >
                {index < SANSKAR_STAGES.length - 1 && (
                  <>
                    {/* Mobile: from the bottom of this circle to the top of the next, across the 32px gap. */}
                    <span
                      aria-hidden="true"
                      className="absolute top-16 bottom-[-32px] left-[31px] border-l-2 border-dashed border-sanskar-marigold/60 md:hidden"
                    />
                    {/* lg: 6px off this circle's edge to 6px before the next (column + 16px gap - 76px). */}
                    <span
                      aria-hidden="true"
                      className="absolute top-6 left-[calc(50%+38px)] hidden w-[calc(100%-60px)] items-center lg:flex"
                    >
                      <span className="flex-1 border-t-2 border-dashed border-sanskar-marigold/60" />
                      <ChevronRight className="-ml-1 size-4 shrink-0 text-sanskar-marigold" />
                    </span>
                  </>
                )}
                <span className="relative inline-flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-sanskar-marigold bg-sanskar-marigold/15">
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.75}
                    className="size-7 text-sanskar-maroon"
                  />
                </span>
                <div className="min-w-0 pt-3 md:pt-0">
                  <span className="line-clamp-2 block text-[15px] leading-snug font-semibold text-sanskar-brown md:min-h-[2lh]">
                    {stage.name}
                  </span>
                  {stage.description && (
                    <p className="mt-1 text-sm text-sanskar-brown/80 lg:line-clamp-1">
                      {stage.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-5 text-center">
          <p className="max-w-2xl text-base leading-relaxed text-sanskar-brown">
            From the first prayer on your land to the day you enter your
            completed home, we can coordinate traditional rituals at important
            construction milestones.
          </p>
          <a
            href={whatsappUrl(getWhatsAppNumber(), whatsappMessage("sanskar"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-fit max-w-full items-center justify-center gap-2 self-center rounded-[10px] bg-orange-500 px-6 font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-700"
          >
            Ask About Shubh Nirman Sanskar
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </Section>
  );
}
