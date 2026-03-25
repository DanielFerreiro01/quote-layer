import { notFound } from "next/navigation";
import { getQuoterPlugin } from "@/features/quoters/registry";

interface PageProps {
  params: Promise<{
    quoter: string;
  }>;
}

export default async function QuoterLandingPage({ params }: PageProps) {
  const { quoter } = await params;
  const plugin = getQuoterPlugin(quoter);

  if (!plugin) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        {plugin.icon}
      </div>
      <h1 className="text-3xl font-bold">{plugin.label}</h1>
      <p className="mt-2 text-muted-foreground">{plugin.description}</p>
    </div>
  );
}