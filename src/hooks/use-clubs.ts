
'use client';

import { collection, doc } from 'firebase/firestore';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

export function useClubs() {
  const firestore = useFirestore();

  const clubsCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clubs') : null),
    [firestore]
  );

  const {
    data: clubs,
    isLoading: isClubsLoading,
    error: clubsError,
  } = useCollection<Club>(clubsCollection);

  const addClub = (club: Omit<Club, 'id'>) => {
    if (!clubsCollection) return;
    addDocumentNonBlocking(clubsCollection, club);
  };

  const removeClub = (clubId: string) => {
    if (!firestore) return;
    const clubDoc = doc(firestore, 'clubs', clubId);
    deleteDocumentNonBlocking(clubDoc);
  };
  
  const updateClub = (clubId: string, club: Omit<Club, 'id'>) => {
    if (!firestore) return;
    const clubDoc = doc(firestore, 'clubs', clubId);
    updateDocumentNonBlocking(clubDoc, club);
  };

  return {
    clubs: clubs || [],
    isClubsLoading,
    clubsError,
    addClub,
    removeClub,
    updateClub,
    isInitialized: !!firestore,
  };
}

    