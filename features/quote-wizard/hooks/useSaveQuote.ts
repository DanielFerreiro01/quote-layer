import { useMutation } from "@tanstack/react-query";
import { saveQuote } from "@/app/actions/quotes/save-quote";
import type { SaveQuoteInput, SaveQuoteResult } from "@/app/actions/quotes/save-quote";

/**
 * Wraps the saveQuote server action in a React Query mutation.
 *
 * Usage inside SolarPlugin (step-results or GenericQuoteWizard):
 *
 *   const { mutate, isPending, data } = useSaveQuote();
 *   mutate({ tenant, formData, calculation });
 */
export function useSaveQuote() {
  return useMutation<SaveQuoteResult, Error, SaveQuoteInput>({
    mutationFn: (input) => saveQuote(input),
    retry: 1,
  });
}