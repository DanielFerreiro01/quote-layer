import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardNavigationProps {
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export default function NavigationSteps({
  isFirst,
  isLast,
  onNext,
  onBack,
  disabled = false,
}: WizardNavigationProps) {
  
  const nextLabel = isLast ? "Ver cotización" : "Siguiente"
  
  return (
    <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={isFirst}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Anterior
      </Button>

      {!isLast && (
        <Button onClick={onNext} className="gap-2" disabled={disabled}>
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

