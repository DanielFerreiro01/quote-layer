/* =========================
 * ENUMS (runtime + type)
 * ========================= */

export const ClientType = {
  residential: 'residential',
  industrial: 'industrial',
  agro: 'agro',
} as const

export type ClientType =
  (typeof ClientType)[keyof typeof ClientType]

export const TimeProfile = {
  day: 'day',
  night: 'night',
  mixed: 'mixed',
} as const

export type TimeProfile =
  (typeof TimeProfile)[keyof typeof TimeProfile]

export const MountingType = {
  'roof-sheet': 'roof-sheet',
  'roof-tile': 'roof-tile',
  ground: 'ground',
  carport: 'carport',
} as const

export type MountingType =
  (typeof MountingType)[keyof typeof MountingType]

/* =========================
 * DOMAIN INTERFACES
 * ========================= */

export interface ContactData {
  name: string
  email: string
  phone: string
  clientType: ClientType
}

export interface ConsumptionData {
  monthlyKwh: number
  timeProfile: TimeProfile
}

export interface InstallationData {
  mountingType: MountingType
}

export interface FormData {
  contact: ContactData
  consumption: ConsumptionData
  installation: InstallationData
}

export interface SolarCalculation {
  systemSizeKw: number
  panelCount: number
  costUSD: number
  monthlySavings: number
  annualSavings: number
  roiYears: number
  gridCostProjection: number[]
  solarCostProjection: number[]
}
