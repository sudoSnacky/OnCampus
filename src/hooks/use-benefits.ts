
'use client';

import { useMemo } from 'react';
import { collection, doc, addDoc, deleteDoc } from 'firebase/firestore';

import { useCollection, useFirestore } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';


export interface Benefit {
  id: string;
  title: string;
  provider: string;
  description: string;
  category: string;
  imageId: string;
  redirectUrl?: string;
}

export function useBenefits() {
  const firestore = useFirestore();

  const benefitsCollection = useMemo(
    () => (firestore ? collection(firestore, 'benefits') : null),
    [firestore]
  );

  const {
    data: benefits,
    isLoading: isBenefitsLoading,
    error: benefitsError,
  } = useCollection(benefitsCollection);

  const addBenefit = async (benefit: Omit<Benefit, 'id'>) => {
    if (!benefitsCollection) return;
    addDocumentNonBlocking(benefitsCollection, benefit);
  };

  const removeBenefit = async (benefitId: string) => {
    if (!firestore) return;
    const benefitDoc = doc(firestore, 'benefits', benefitId);
    deleteDocumentNonBlocking(benefitDoc);
  };

  return {
    benefits: benefits || [],
    isBenefitsLoading,
    benefitsError,
    addBenefit,
    removeBenefit,
    isInitialized: !!firestore,
  };
}
