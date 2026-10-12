import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import logo from "@/public/brand/logo.png"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Swapnobari home"
      className={cn("inline-flex shrink-0 items-center rounded-md", className)}
    >
      <Image
        src={logo}
        alt="Swapnobari: Plan · Vastu · Build"
        priority
        className="h-[34px] w-auto"
      />
    </Link>
  )
}
