// config/contact.config.ts
import { Home, Building2, Wheat } from "lucide-react";
import type { ClientType } from "@/lib/solar/solar-types";
import type { ReactNode } from "react";

export interface ClientTypeOption {
  value: ClientType;
  label: string;
  icon: ReactNode;
  description: string;
}

export const CLIENT_TYPE_OPTIONS: ClientTypeOption[] = [
  {
    value: "residential",
    label: "Residencial",
    icon: <Home className="h-5 w-5" />,
    description: "Hogares y departamentos",
  },
  {
    value: "industrial",
    label: "Industrial",
    icon: <Building2 className="h-5 w-5" />,
    description: "Fábricas y comercios",
  },
  {
    value: "agro",
    label: "Agro",
    icon: <Wheat className="h-5 w-5" />,
    description: "Campo y agroindustria",
  },
];