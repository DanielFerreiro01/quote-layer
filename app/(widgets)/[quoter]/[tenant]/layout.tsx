import { notFound } from "next/navigation";
import { getQuoterPlugin } from "@/features/quoters/registry";
import { WidgetHeader } from "@/features/quote-wizard/components/WidgetHeader";
import { WidgetFooter } from "@/features/quote-wizard/components/WidgetFooter";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    quoter: string;
    tenant: string;
  }>;
}

export default async function QuoterLayout({ children, params }: LayoutProps) {
  const { quoter } = await params;
  const plugin = getQuoterPlugin(quoter);

  if (!plugin) {
    notFound();
  }

  return (
    <>
      <WidgetHeader
        title={plugin.label}
        accent="bg-primary text-primary-foreground"
        icon={plugin.icon}
      />
      {children}
      <WidgetFooter text={`© ${new Date().getFullYear()} ${plugin.label}`} />
    </>
  );
}