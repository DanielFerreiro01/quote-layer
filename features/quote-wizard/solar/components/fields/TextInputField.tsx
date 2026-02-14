import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextInputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  placeholder: string;
  value: string;
  error?: string;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}

export function TextInputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  icon,
  onChange,
}: TextInputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            icon && "pl-10",
            "h-12 bg-background border-input transition-colors",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}