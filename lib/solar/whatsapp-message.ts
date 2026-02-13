import type { FormData, SolarCalculation, ClientType, MountingType } from './solar-types';

const clientTypeLabels: Record<ClientType, string> = {
  residential: 'Residencial',
  industrial: 'Industrial',
  agro: 'Agroindustrial',
};

const mountingTypeLabels: Record<MountingType, string> = {
  'roof-sheet': 'Techo (Chapa)',
  'roof-tile': 'Techo (Teja)',
  ground: 'Suelo',
  carport: 'Carport',
};

const timeProfileLabels = {
  day: 'Diurno',
  night: 'Nocturno',
  mixed: 'Mixto',
};

export function generateWhatsAppMessage(
  data: FormData,
  calculation: SolarCalculation,
): string {
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
Tamaño del Sistema: ${calculation.system.power} kW
Cantidad de Paneles: ${calculation.system.panels}
Costo Total: $${calculation.costs.total.toLocaleString()} USD
Ahorro Mensual: $${calculation.economics.monthlySavings.toLocaleString()} USD
Retorno de Inversión: ${calculation.economics.paybackYears} años
Cobertura: ${calculation.system.coveragePercentage}%

Me interesa recibir más información sobre esta cotización.`;

  return encodeURIComponent(message);
}