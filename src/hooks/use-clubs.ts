
'use client';

import { initialClubs } from '../lib/data';
import { useState } from 'react';


export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

export function useClubs() {
    const [clubs, setClubs] = useState<Club[]>(initialClubs);

    const addClub = (club: Omit<Club, 'id'>) => {
        setClubs(prev => [...prev, { ...club, id: `club-${Date.now()}` }]);
    };
    
    const removeClub = (clubId: string) => {
        setClubs(prev => prev.filter(c => c.id !== clubId));
    };

    const updateClub = (clubId: string, updatedClub: Omit<Club, 'id'>) => {
        setClubs(prev => prev.map(c => c.id === clubId ? { ...updatedClub, id: clubId } : c));
    };


  return {
    clubs,
    isClubsLoading: false,
    clubsError: null,
    addClub,
    removeClub,
    updateClub,
    isInitialized: true,
  };
}
