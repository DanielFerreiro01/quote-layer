import { useMutation } from '@tanstack/react-query';
import { calculateSolarQuote } from '@/app/actions/solar/calculate-solar-quote';
import type { FormData, SolarCalculation } from '@/lib/solar/solar-types';

export function useSolarCalculation(tenant: string) {
  return useMutation({
    mutationKey: ['solar-calculation', tenant],
    mutationFn: async (data: FormData): Promise<SolarCalculation> => {
      return calculateSolarQuote(tenant, data);
    },
    retry: 1,
  });
}