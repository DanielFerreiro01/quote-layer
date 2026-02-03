import type {
  FormData,
  SolarCalculation,
  ClientType,
  MountingType,
} from './solar-types'

const CLIENT_TYPE_MULTIPLIER: Record<ClientType, number> = {
  residential: 1,
  industrial: 0.85,
  agro: 0.9,
}

const MOUNTING_TYPE_COST_MULTIPLIER: Record<MountingType, number> = {
  'roof-sheet': 1,
  'roof-tile': 1.15,
  ground: 1.25,
  carport: 1.4,
}

const BASE_COST_PER_KW = 1200
const ELECTRICITY_COST_PER_KWH = 0.15
const ANNUAL_ELECTRICITY_INCREASE = 0.04
const PANEL_WATT_CAPACITY = 550
const SUN_HOURS_PER_DAY = 5
const SYSTEM_EFFICIENCY = 0.85

export function calculateSolarSystem(data: FormData): SolarCalculation {
  const { consumption, installation, contact } = data

  const annualConsumption = consumption.monthlyKwh * 12

  const dailyProduction =
    (annualConsumption / 365) * (1 / SYSTEM_EFFICIENCY)

  const systemSizeKw = dailyProduction / SUN_HOURS_PER_DAY

  const panelCount = Math.ceil((systemSizeKw * 1000) / PANEL_WATT_CAPACITY)

  const actualSystemSize = (panelCount * PANEL_WATT_CAPACITY) / 1000

  const mountingMultiplier =
    MOUNTING_TYPE_COST_MULTIPLIER[installation.mountingType]
  const clientMultiplier = CLIENT_TYPE_MULTIPLIER[contact.clientType]

  const costUSD =
    actualSystemSize * BASE_COST_PER_KW * mountingMultiplier * clientMultiplier

  const monthlySavings = consumption.monthlyKwh * ELECTRICITY_COST_PER_KWH
  const annualSavings = monthlySavings * 12

  const roiYears = costUSD / annualSavings

  const gridCostProjection: number[] = []
  const solarCostProjection: number[] = []

  let cumulativeGridCost = 0
  let cumulativeSolarCost = costUSD

  for (let year = 0; year <= 20; year++) {
    const electricityCostThisYear =
      annualConsumption *
      ELECTRICITY_COST_PER_KWH *
      (1 + ANNUAL_ELECTRICITY_INCREASE) ** year

    cumulativeGridCost += electricityCostThisYear
    gridCostProjection.push(Math.round(cumulativeGridCost))

    if (year > 0) {
      cumulativeSolarCost += annualSavings * 0.05
    }
    solarCostProjection.push(Math.round(cumulativeSolarCost))
  }

  return {
    systemSizeKw: Math.round(actualSystemSize * 100) / 100,
    panelCount,
    costUSD: Math.round(costUSD),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    roiYears: Math.round(roiYears * 10) / 10,
    gridCostProjection,
    solarCostProjection,
  }
}

export function generateWhatsAppMessage(
  data: FormData,
  calculation: SolarCalculation,
): string {
  const clientTypeLabels: Record<ClientType, string> = {
    residential: 'Residencial',
    industrial: 'Industrial',
    agro: 'Agroindustrial',
  }

  const mountingTypeLabels: Record<MountingType, string> = {
    'roof-sheet': 'Techo (Chapa)',
    'roof-tile': 'Techo (Teja)',
    ground: 'Suelo',
    carport: 'Carport',
  }

  const timeProfileLabels = {
    day: 'Diurno',
    night: 'Nocturno',
    mixed: 'Mixto',
  }

  const message = `*Cotización Solar - SolarQuote Pro*

*Datos de Contacto*
Nombre: ${data.contact.name}
Email: ${data.contact.email}
Teléfono: ${data.contact.phone}
Tipo de Cliente: ${clientTypeLabels[data.contact.clientType]}

*Consumo Energético*
Consumo Mensual: ${data.consumption.monthlyKwh} kWh
Perfil Horario: ${timeProfileLabels[data.consumption.timeProfile]}

*Instalación*
Tipo de Montaje: ${mountingTypeLabels[data.installation.mountingType]}

*Resultado de Cotización*
Tamaño del Sistema: ${calculation.systemSizeKw} kW
Cantidad de Paneles: ${calculation.panelCount}
Costo Estimado: $${calculation.costUSD.toLocaleString()} USD
Ahorro Mensual: $${calculation.monthlySavings} USD
ROI Estimado: ${calculation.roiYears} años

Me interesa recibir más información sobre esta cotización.`

  return encodeURIComponent(message)
}
