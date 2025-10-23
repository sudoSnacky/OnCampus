
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
}

export function useClubs() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isClubsLoading, setIsLoading] = useState(true);
    const [clubsError, setClubsError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchClubs = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('clubs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching clubs:", error);
            setClubsError(error as unknown as Error);
        } else {
            setClubs(data as Club[]);
        }
        setIsLoading(false);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);

    const addClub = async (club: Omit<Club, 'id'>) => {
        const { data, error } = await supabase
            .from('clubs')
            .insert([club])
            .select();

        if (error) {
            console.error("Error adding club:", error);
            throw error;
        }

        if (data) {
            setClubs(prev => [data[0], ...prev]);
        }
    };
    
    const removeClub = async (clubId: string) => {
        const { error } = await supabase
            .from('clubs')
            .delete()
            .eq('id', clubId);
        
        if (error) {
            console.error("Error removing club:", error);
            throw error;
        }

        setClubs(prev => prev.filter(c => c.id !== clubId));
    };

    const updateClub = async (clubId: string, updatedClub: Omit<Club, 'id'>) => {
        const { data, error } = await supabase
            .from('clubs')
            .update(updatedClub)
            .eq('id', clubId)
            .select();

        if (error) {
            console.error("Error updating club:", error);
            throw error;
        }
        
        if(data) {
            setClubs(prev => prev.map(c => c.id === clubId ? data[0] : c));
        }
    };


  return {
    clubs,
    isClubsLoading,
    clubsError,
    addClub,
    removeClub,
    updateClub,
    isInitialized,
  };
}
