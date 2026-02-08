import { ReactNode } from "react";

export interface WizardStep {
  id: string;
  label: string;
  shortLabel: string;
  render: () => ReactNode;
}
