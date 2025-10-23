
'use client';

import { initialBenefits } from '../lib/data';
import { useState } from 'react';

export interface Benefit {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: string;
  imageUrl: string;
  redirectUrl?: string;
}

export function useBenefits() {
    const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);

    const addBenefit = (benefit: Omit<Benefit, 'id'>) => {
        setBenefits(prev => [...prev, { ...benefit, id: `benefit-${Date.now()}` }]);
    };
    
    const removeBenefit = (benefitId: string) => {
        setBenefits(prev => prev.filter(b => b.id !== benefitId));
    };

    const updateBenefit = (benefitId: string, updatedBenefit: Omit<Benefit, 'id'>) => {
        setBenefits(prev => prev.map(b => b.id === benefitId ? { ...updatedBenefit, id: benefitId } : b));
    };

    return {
        benefits,
        isBenefitsLoading: false,
        benefitsError: null,
        addBenefit,
        removeBenefit,
        updateBenefit,
        isInitialized: true,
    };
}
