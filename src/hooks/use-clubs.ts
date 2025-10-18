
'use client';

import { useMemo } from 'react';
import { collection, doc, deleteDoc, addDoc } from 'firebase/firestore';

import { useCollection, useFirestore } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  imageId: string;
}

export function useClubs() {
  const firestore = useFirestore();

  const clubsCollection = useMemo(
    () => (firestore ? collection(firestore, 'clubs') : null),
    [firestore]
  );

  const {
    data: clubs,
    isLoading: isClubsLoading,
    error: clubsError,
  } = useCollection(clubsCollection);

  const addClub = async (club: Omit<Club, 'id'>) => {
    if (!clubsCollection) return;
    addDocumentNonBlocking(clubsCollection, club);
  };

  const removeClub = async (clubId: string) => {
    if (!firestore) return;
    const clubDoc = doc(firestore, 'clubs', clubId);
    deleteDocumentNonBlocking(clubDoc);
  };

  return {
    clubs: clubs || [],
    isClubsLoading,
    clubsError,
    addClub,
    removeClub,
    isInitialized: !!firestore,
  };
}
