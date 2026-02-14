// hooks/useStepForm.ts
import { useState, useCallback } from 'react';
import { z } from 'zod';

/**
 * Hook genérico para manejar formularios en steps con validación
 * 
 * @template T - Tipo de los datos del formulario
 * @param initialData - Datos iniciales del formulario
 * @param schema - Schema de validación Zod (opcional)
 */
export function useStepForm<T extends Record<string, any>>(
  initialData: T,
  schema?: z.ZodSchema<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Actualiza un campo específico del formulario
   */
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      
      // Limpiar error del campo al modificarlo
      if (errors[field as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Actualiza múltiples campos a la vez
   */
  const updateMultipleFields = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
    
    // Marcar todos los campos actualizados como touched
    const touchedFields = Object.keys(updates).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched((prev) => ({ ...prev, ...touchedFields }));
  }, []);

  /**
   * Valida el formulario completo
   */
  const validate = useCallback((): boolean => {
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
  }, [data, schema]);

  /**
   * Valida un campo específico
   */
  const validateField = useCallback(
    <K extends keyof T>(field: K): boolean => {
      if (!schema) return true;

      const result = schema.safeParse(data);

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        const fieldKey = field as string;

        if (fieldErrors[fieldKey] && fieldErrors[fieldKey].length > 0) {
          setErrors((prev) => ({
            ...prev,
            [fieldKey]: fieldErrors[fieldKey][0],
          }));
          return false;
        }
      }

      // Limpiar error del campo si es válido
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });

      return true;
    },
    [data, schema]
  );

  /**
   * Resetea el formulario a los valores iniciales
   */
  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  /**
   * Limpia todos los errores
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Limpia el error de un campo específico
   */
  const clearFieldError = useCallback(<K extends keyof T>(field: K) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  /**
   * Marca un campo como touched
   */
  const touchField = useCallback(<K extends keyof T>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  /**
   * Verifica si el formulario es válido
   */
  const isValid = useCallback((): boolean => {
    if (!schema) return true;
    return schema.safeParse(data).success;
  }, [data, schema]);

  /**
   * Verifica si el formulario ha sido modificado
   */
  const isDirty = useCallback((): boolean => {
    return JSON.stringify(data) !== JSON.stringify(initialData);
  }, [data, initialData]);

  return {
    // Estado
    data,
    errors,
    touched,
    
    // Acciones de actualización
    updateField,
    updateMultipleFields,
    setData,
    
    // Validación
    validate,
    validateField,
    isValid,
    
    // Manejo de errores
    clearErrors,
    clearFieldError,
    
    // Utilidades
    reset,
    touchField,
    isDirty,
  };
}