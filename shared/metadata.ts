import { sources } from "./sources"
import { typeSafeObjectEntries, typeSafeObjectFromEntries } from "./type.util"
import type { ColumnID, HiddenColumnID, Metadata, SourceID } from "./types"

export const columns = {
  china: {
    en: "Domestic",
  },
  world: {
    en: "International",
  },
  tech: {
    en: "Technology",
  },
  finance: {
    en: "Finance",
  },
  crypto: {
    en: "Cryptocurrency",
  },
  focus: {
    en: "Focus",
  },
  realtime: {
    en: "Real-time",
  },
  hottest: {
    en: "Hottest",
  },
} as const

export const fixedColumnIds = ["focus", "hottest", "realtime"] as const satisfies Partial<ColumnID>[]
export const hiddenColumns = Object.keys(columns).filter(id => !fixedColumnIds.includes(id as any)) as HiddenColumnID[]

export const metadata: Metadata = typeSafeObjectFromEntries(typeSafeObjectEntries(columns).map(([k, v]) => {
  switch (k) {
    case "focus":
      return [k, {
        name: v.en,
        sources: [] as SourceID[],
      }]
    case "hottest":
      return [k, {
        name: v.en,
        sources: typeSafeObjectEntries(sources).filter(([, v]) => v.type === "hottest" && !v.redirect).map(([k]) => k),
      }]
    case "realtime":
      return [k, {
        name: v.en,
        sources: typeSafeObjectEntries(sources).filter(([, v]) => v.type === "realtime" && !v.redirect).map(([k]) => k),
      }]
    default:
      return [k, {
        name: v.en,
        sources: typeSafeObjectEntries(sources).filter(([, v]) => v.column === k && !v.redirect).map(([k]) => k),
      }]
  }
}))
