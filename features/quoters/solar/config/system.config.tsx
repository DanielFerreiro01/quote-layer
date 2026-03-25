import { Zap, Battery, RefreshCw } from "lucide-react";
import type { SystemType } from "@/lib/solar/solar-types";

export interface FAQ {
  question: string;
  answer: string;
}

export interface SystemTypeOption {
  id: SystemType;
  name: string;
  icon: React.ElementType;
  description: string;
  details: string[];
  faqs: FAQ[];
}

export const SYSTEM_TYPE_OPTIONS: SystemTypeOption[] = [
  {
    id: "on-grid",
    name: "On-Grid",
    icon: Zap,
    description: "Conectado a la red eléctrica",
    details: [
      "Inyecta excedentes a la red",
      "Sin almacenamiento de baterías",
      "Menor costo inicial",
      "Requiere conexión a red pública",
    ],
    faqs: [
      {
        question: "¿Qué pasa si genero más energía de la que consumo?",
        answer:
          "Los excedentes se inyectan a la red eléctrica. Dependiendo de la regulación local, puedes recibir créditos o compensación económica por la energía aportada.",
      },
      {
        question: "¿Funciona durante un corte de luz?",
        answer:
          "No. Por seguridad, los sistemas On-Grid se desconectan automáticamente durante cortes de energía para proteger a los trabajadores de la red.",
      },
      {
        question: "¿Cuál es la vida útil del sistema?",
        answer:
          "Los paneles solares tienen una vida útil de 25-30 años, mientras que los inversores duran entre 10-15 años. El mantenimiento es mínimo.",
      },
    ],
  },
  {
    id: "off-grid",
    name: "Off-Grid",
    icon: Battery,
    description: "Totalmente independiente",
    details: [
      "Autonomía completa",
      "Incluye banco de baterías",
      "Sin dependencia de la red",
      "Mayor inversión inicial",
    ],
    faqs: [
      {
        question: "¿Cuánta autonomía tienen las baterías?",
        answer:
          "Dependiendo del dimensionamiento, las baterías pueden proporcionar desde 1 hasta 5 días de autonomía. Se diseña según tu consumo y condiciones climáticas locales.",
      },
      {
        question: "¿Cada cuánto debo reemplazar las baterías?",
        answer:
          "Las baterías de litio duran entre 10-15 años, mientras que las de plomo-ácido entre 5-8 años. La vida útil depende del uso y mantenimiento.",
      },
      {
        question: "¿Es adecuado para zonas con poca radiación solar?",
        answer:
          "Sí, pero requiere un dimensionamiento mayor de paneles y baterías. También se puede complementar con generadores de respaldo para épocas de baja radiación.",
      },
    ],
  },
  {
    id: "hybrid",
    name: "Híbrido",
    icon: RefreshCw,
    description: "Lo mejor de ambos mundos",
    details: [
      "Conectado a red + baterías",
      "Respaldo ante cortes de luz",
      "Máxima flexibilidad",
      "Optimiza autoconsumo",
    ],
    faqs: [
      {
        question: "¿Cómo funciona durante un corte de luz?",
        answer:
          "El sistema cambia automáticamente a modo isla, utilizando la energía almacenada en las baterías para mantener funcionando tus equipos esenciales.",
      },
      {
        question: "¿Puedo elegir cuándo usar las baterías?",
        answer:
          "Sí. Los inversores híbridos permiten programar el uso de baterías, por ejemplo, para consumir energía almacenada durante horas pico cuando la electricidad es más cara.",
      },
      {
        question: "¿Es más caro que un sistema On-Grid?",
        answer:
          "Sí, debido al costo de las baterías. Sin embargo, ofrece mayor independencia energética y protección contra cortes, lo que puede justificar la inversión adicional.",
      },
    ],
  },
];