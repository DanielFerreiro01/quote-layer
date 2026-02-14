import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface OptionCardProps<T> {
  value: T;
  label: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (value: T) => void;
  features?: string[];
}

export function OptionCard<T>({
  value,
  label,
  description,
  icon,
  isSelected,
  onSelect,
  features,
}: OptionCardProps<T>) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-lg",
        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {icon}
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {features && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {features.map((f, i) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      )}
    </motion.button>
  );
}