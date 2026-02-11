// ✅ features/quote-wizard/solar/hooks/useSolarQuoteForm.ts
import { useReducer, useCallback } from 'react';
import type { FormData, ContactData, ConsumptionData, InstallationData } from '@/lib/solar/solar-types';

const initialState: FormData = {
  contact: {
    name: '',
    email: '',
    phone: '',
    clientType: 'residential',
  },
  consumption: {
    monthlyKwh: 500,
    timeProfile: 'mixed',
  },
  installation: {
    mountingType: 'roof-sheet',
  },
};

type Action =
  | { type: 'UPDATE_CONTACT'; payload: ContactData }
  | { type: 'UPDATE_CONSUMPTION'; payload: ConsumptionData }
  | { type: 'UPDATE_INSTALLATION'; payload: InstallationData }
  | { type: 'RESET' };

function formReducer(state: FormData, action: Action): FormData {
  switch (action.type) {
    case 'UPDATE_CONTACT':
      return { ...state, contact: action.payload };
    case 'UPDATE_CONSUMPTION':
      return { ...state, consumption: action.payload };
    case 'UPDATE_INSTALLATION':
      return { ...state, installation: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useSolarQuoteForm() {
  const [formData, dispatch] = useReducer(formReducer, initialState);

  const updateContact = useCallback((data: ContactData) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: data });
  }, []);

  const updateConsumption = useCallback((data: ConsumptionData) => {
    dispatch({ type: 'UPDATE_CONSUMPTION', payload: data });
  }, []);

  const updateInstallation = useCallback((data: InstallationData) => {
    dispatch({ type: 'UPDATE_INSTALLATION', payload: data });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    formData,
    updateContact,
    updateConsumption,
    updateInstallation,
    reset,
  };
}