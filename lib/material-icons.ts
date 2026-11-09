import {
  Boxes,
  BrickWall,
  Columns3,
  Droplets,
  Grid3x3,
  Hammer,
  Mountain,
  PaintRoller,
  Plug,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react"
import { MATERIAL_ICON_KEYS, type MaterialIconKey } from "@/lib/constants"

/**
 * Lucide line icon for each material category icon key (DESIGN.md §6.1).
 * Twin of swapnobari-admin/lib/material-icons.ts: keep in sync.
 */
export const MATERIAL_ICONS: Record<MaterialIconKey, LucideIcon> = {
  bag: ShoppingBag,
  bars: Columns3,
  bricks: BrickWall,
  stone: Mountain,
  tiles: Grid3x3,
  electrical: Plug,
  plumbing: Droplets,
  paint: PaintRoller,
  tools: Hammer,
  boxes: Boxes,
}

/** Unknown keys (e.g. a row written before a key was removed) fall back to "boxes". */
export function materialIcon(key: string): LucideIcon {
  return (MATERIAL_ICON_KEYS as readonly string[]).includes(key) ? MATERIAL_ICONS[key as MaterialIconKey] : Boxes
}
