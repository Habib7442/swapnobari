import "server-only"
import { Resend } from "resend"
import { absoluteUrl } from "@/lib/seo"

export type LeadAlert = {
  refCode: string
  typeLabel: string
  name: string
  /** +91XXXXXXXXXX */
  mobile: string
  location: string
  isDuplicate: boolean
  lines: [label: string, value: string][]
  resultPath?: string | null
}

const escape = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

/** Emails the team about a new lead. Never throws: a failed email must not lose the lead. */
export async function sendLeadAlert(lead: LeadAlert): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_ALERT_EMAIL
  if (!apiKey || !to) {
    console.warn(`[notify] email not configured; lead ${lead.refCode} saved without an alert`)
    return
  }
  const from = process.env.LEAD_ALERT_FROM ?? "Swapnobari Leads <leads@swapnobari.in>"
  const waLink = `https://wa.me/${lead.mobile.replace(/\D/g, "")}`
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Mobile", lead.mobile],
    ["Location", lead.location],
    ...lead.lines,
    ...(lead.resultPath ? ([["Estimate link", absoluteUrl(lead.resultPath)]] as [string, string][]) : []),
  ]

  const subject = `${lead.isDuplicate ? "[Repeat] " : ""}New ${lead.typeLabel} lead ${lead.refCode}: ${lead.name}`
  const text = [`${lead.typeLabel} lead ${lead.refCode}`, ...rows.map(([k, v]) => `${k}: ${v}`), `WhatsApp: ${waLink}`].join("\n")
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:560px">
      <h2 style="color:#13294b;margin:0 0 4px">New ${escape(lead.typeLabel)} lead</h2>
      <p style="margin:0 0 16px;color:#64748b">${escape(lead.refCode)}${lead.isDuplicate ? " · repeat enquiry from this number" : ""}</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;color:#64748b;white-space:nowrap">${escape(k)}</td><td style="padding:6px 0">${escape(v)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin:20px 0 0">
        <a href="tel:${escape(lead.mobile)}" style="background:#13294b;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Call</a>
        &nbsp;
        <a href="${escape(waLink)}" style="background:#25a244;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">WhatsApp</a>
      </p>
    </div>`

  try {
    const { error } = await new Resend(apiKey).emails.send({ from, to: to.split(",").map((s) => s.trim()), subject, text, html })
    if (error) console.error(`[notify] Resend rejected alert for ${lead.refCode}`, error)
  } catch (error) {
    console.error(`[notify] failed to send alert for ${lead.refCode}`, error)
  }
}
