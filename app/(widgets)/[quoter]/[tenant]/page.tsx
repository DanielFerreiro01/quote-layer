import { notFound } from "next/navigation";
import { getQuoterPlugin } from "@/features/quoters/registry";
import { GenericQuoteWizard } from "@/features/quote-wizard/GenericQuoteWizard";

interface PageProps {
  params: Promise<{
    quoter: string;
    tenant: string;
  }>;
}

export default async function QuoterPage({ params }: PageProps) {
  const { quoter, tenant } = await params;

  // Solo validamos que el plugin existe — no lo pasamos al Client Component
  const plugin = getQuoterPlugin(quoter);
  if (!plugin) notFound();

  // Pasamos solo strings serializables. El Client Component carga el plugin por su id.
  return <GenericQuoteWizard quoterId={quoter} tenant={tenant} />;
}

export async function generateStaticParams() {
  const { getRegisteredQuoterIds } = await import("@/features/quoters/registry");
  return getRegisteredQuoterIds().map((quoter) => ({ quoter }));
}