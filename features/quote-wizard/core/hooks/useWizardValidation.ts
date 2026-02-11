// ✅ features/quote-wizard/core/hooks/useWizardValidation.ts
import { useCallback, useState } from "react";
import { z } from "zod";

interface ValidationConfig<T extends z.ZodRawShape> {
  schemas: Record<number, z.ZodObject<T>>;
}

export function useWizardValidation<T extends z.ZodRawShape>(
  config: ValidationConfig<T>,
) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = useCallback(
    (step: number, data: unknown) => {
      const schema = config.schemas[step];
      if (!schema) return true;

      const result = schema.safeParse(data);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const errorMap: Record<string, string> = {};

        Object.entries(fieldErrors).forEach(([key, messages]) => {
          if (messages && Array.isArray(messages) && messages.length > 0) {
            errorMap[key] = messages[0];
          }
        });

        setErrors(errorMap);
        return false;
      }

      setErrors({});
      return true;
    },
    [config.schemas],
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  return { errors, validateStep, clearErrors };
}
