
'use client';

import { collection, doc } from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


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
  const firestore = useFirestore();

  const benefitsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'benefits') : null),
    [firestore]
  );

  const {
    data: benefits,
    isLoading: isBenefitsLoading,
    error: benefitsError,
  } = useCollection<Benefit>(benefitsCollection);

  const addBenefit = (benefit: Omit<Benefit, 'id'>) => {
    if (!benefitsCollection) return;
    addDocumentNonBlocking(benefitsCollection, benefit);
  };

  const removeBenefit = (benefitId: string) => {
    if (!firestore) return;
    const benefitDoc = doc(firestore, 'benefits', benefitId);
    deleteDocumentNonBlocking(benefitDoc);
  };
  
  const updateBenefit = (benefitId: string, benefit: Omit<Benefit, 'id'>) => {
    if (!firestore) return;
    const benefitDoc = doc(firestore, 'benefits', benefitId);
    updateDocumentNonBlocking(benefitDoc, benefit);
  };


  return {
    benefits: benefits || [],
    isBenefitsLoading,
    benefitsError,
    addBenefit,
    removeBenefit,
    updateBenefit,
    isInitialized: !!firestore,
  };
}

    