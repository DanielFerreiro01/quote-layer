import { useCallback } from 'react';

export function useFieldHandlers<T extends Record<string, any>>(
  data: T,
  onChange: (data: T) => void
) {
  const handleFieldChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  const handleMultipleFields = useCallback(
    (updates: Partial<T>) => {
      onChange({ ...data, ...updates });
    },
    [data, onChange]
  );

  return {
    handleFieldChange,
    handleMultipleFields,
  };
}