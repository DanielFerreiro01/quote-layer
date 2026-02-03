import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface WizardNavigationProps {
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  disabled?: boolean;
}

export default function WizardNavigation({
  isFirst,
  isLast,
  onNext,
  onBack,
  nextLabel = "Siguiente",
  disabled = false,
}: WizardNavigationProps) {
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

