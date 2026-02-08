// app/(widget)/solar-quote-pro/layout.tsx
import { WidgetFooter } from "@/features/quote-wizard/components/WidgetFooter";
import { WidgetHeader } from "@/features/quote-wizard/components/WidgetHeader";
import { Sun } from "lucide-react";


export default function SolarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WidgetHeader
        title="SolarQuote Pro"
        accent="bg-primary text-primary-foreground"
        icon={<Sun className="h-5 w-5" />}
      />

      {children}

      <WidgetFooter text="© 2026 SolarQuote Pro" />
    </>
  );
}
