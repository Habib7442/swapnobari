import {
  Calculator,
  Compass,
  Construction,
  DoorOpen,
  FileSearch,
  HardHat,
  House,
  Layers,
  MessagesSquare,
  PencilRuler,
  Search,
  Shovel,
  Sprout,
  type LucideIcon,
} from "lucide-react"
import { whatsappMessage, whatsappUrl, type WhatsAppTemplateKey } from "@/lib/whatsapp"

/**
 * INTERIM content. Services and Sanskar stages are admin data (AGENTS.md §4): replace these
 * lists when admin modules 5 (Services) and 14 (Shubh Nirman Sanskar) ship.
 */

export type HomeAction = { kind: "page"; href: string } | { kind: "whatsapp"; template: WhatsAppTemplateKey }

type ActionLinkProps = { href: string; target?: "_blank"; rel?: string }

/** Props for a next/link: internal page, or WhatsApp in a new tab. */
export function actionLinkProps(action: HomeAction, whatsappNumber: string): ActionLinkProps {
  if (action.kind === "page") return { href: action.href }
  return {
    href: whatsappUrl(whatsappNumber, whatsappMessage(action.template)),
    target: "_blank",
    rel: "noopener noreferrer",
  }
}

export type CardTint = { panel: string; icon: string }

/** Card colours: the DESIGN.md §3.3 palette without green, which stays WhatsApp-only, plus orange. */
export const CARD_TINTS: CardTint[] = [
  { panel: "bg-step-blue/15", icon: "text-step-blue" },
  { panel: "bg-step-amber/20", icon: "text-step-amber" },
  { panel: "bg-step-violet/15", icon: "text-step-violet" },
  { panel: "bg-step-coral/15", icon: "text-step-coral" },
  { panel: "bg-orange-50", icon: "text-orange-500" },
]

export type QuickFlowItem = { label: string; icon: LucideIcon; action: HomeAction }

export const QUICK_FLOW: QuickFlowItem[] = [
  { label: "Build a House", icon: Construction, action: { kind: "page", href: "#services" } },
  { label: "Know Construction Cost", icon: Calculator, action: { kind: "page", href: "/construction-budget" } },
  { label: "Plan My House", icon: PencilRuler, action: { kind: "whatsapp", template: "floorPlan" } },
  { label: "Vastu Alignment", icon: Compass, action: { kind: "whatsapp", template: "vastu" } },
  { label: "Find Cement/TMT Seller", icon: Search, action: { kind: "page", href: "#materials" } },
]

export type HomeService = {
  title: string
  text: string
  button: string
  icon: LucideIcon
  action: HomeAction
  /** WebP photo. Without one the card shows its icon panel. */
  image?: { src: string; alt: string }
}

export const HOME_SERVICES: HomeService[] = [
  {
    title: "House Construction Budget Estimate",
    text: "Get an approximate cost for your house before you start.",
    button: "Get Budget Estimate",
    icon: Calculator,
    action: { kind: "page", href: "/construction-budget" },
    image: {
      src: "/images/services/budget-estimate.webp",
      alt: "Model house beside a calculator, stacked coins and rolled house plans",
    },
  },
  {
    title: "Pre-Construction Consultation",
    text: "Talk through your plot, plans and budget with our team.",
    button: "Book Consultation",
    icon: MessagesSquare,
    action: { kind: "whatsapp", template: "consultation" },
    image: {
      src: "/images/services/consultation.webp",
      alt: "Two people going through a house floor plan together, next to a model house",
    },
  },
  {
    title: "Floor Plan & Architectural Planning",
    text: "A house plan made for your plot and your family.",
    button: "Get House Plan",
    icon: PencilRuler,
    action: { kind: "whatsapp", template: "floorPlan" },
    image: {
      src: "/images/services/floor-plan.webp",
      alt: "Furnished two-bedroom house floor plan on a desk with a ruler and pencil",
    },
  },
  {
    title: "Vastu-Aligned Home Planning",
    text: "Plan rooms and entrances in line with Vastu.",
    button: "Know More",
    icon: Compass,
    action: { kind: "whatsapp", template: "vastu" },
    image: {
      src: "/images/services/vastu-planning.webp",
      alt: "Compass placed on a house floor plan to check its directions",
    },
  },
  {
    title: "Complete A–Z House Construction",
    text: "One team from the foundation to handover.",
    button: "Start Your Project",
    icon: HardHat,
    action: { kind: "whatsapp", template: "azConstruction" },
    image: {
      src: "/images/services/az-construction.webp",
      alt: "Model house with a safety helmet, bricks, measuring tape and house plans",
    },
  },
  {
    title: "Plan / Estimate Review",
    text: "Have an existing plan or estimate checked.",
    button: "Upload for Review",
    icon: FileSearch,
    action: { kind: "whatsapp", template: "planReview" },
    image: {
      src: "/images/services/plan-review.webp",
      alt: "Magnifying glass over a house plan, with a red pen for marking changes",
    },
  },
]

export type SanskarStage = { name: string; icon: LucideIcon; description?: string }

/**
 * Decorative image on the Sanskar band's left edge (desktop only). Set to "/images/sanskar/kalash.webp"
 * once that file is added to public/. A constant, not a file check: prerendered pages revalidate on
 * the server, where public/ is not reliably readable.
 */
export const SANSKAR_BAND_IMAGE: string | null = "/images/sanskar/kalash.webp"

export const SANSKAR_STAGES: SanskarStage[] = [
  { name: "Bhumi Shuddhi & Ishan Pujan", icon: Sprout },
  { name: "Griharambha & Neev Sthapan", icon: Shovel },
  { name: "Pratham Dhalai Sanskar", icon: Layers },
  { name: "Mukhya Dwaar Sthapan", icon: DoorOpen },
  { name: "Vastu Shanti & Pujan", icon: Compass },
  { name: "Griha Pravesh", icon: House },
]
