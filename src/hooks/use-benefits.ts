
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [isBenefitsLoading, setIsLoading] = useState(true);
    const [benefitsError, setBenefitsError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchBenefits = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('benefits')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching benefits:", error);
            setBenefitsError(error as unknown as Error);
        } else {
            setBenefits(data as Benefit[]);
        }
        setIsLoading(false);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        fetchBenefits();
    }, [fetchBenefits]);

    const addBenefit = async (benefit: Omit<Benefit, 'id'>) => {
        const { id, ...benefitData } = benefit as any;
        const { data, error } = await supabase
            .from('benefits')
            .insert([benefitData])
            .select();

        if (error) {
            console.error("Error adding benefit:", error);
            throw error;
        }

        if (data) {
            setBenefits(prev => [data[0], ...prev]);
        }
    };
    
    const removeBenefit = async (benefitId: string) => {
        const { error } = await supabase
            .from('benefits')
            .delete()
            .eq('id', benefitId);
        
        if (error) {
            console.error("Error removing benefit:", error);
            throw error;
        }

        setBenefits(prev => prev.filter(b => b.id !== benefitId));
    };

    const updateBenefit = async (benefitId: string, updatedBenefit: Partial<Benefit>) => {
        const { id, ...updateData } = updatedBenefit;
        const { data, error } = await supabase
            .from('benefits')
            .update(updateData)
            .eq('id', benefitId)
            .select();

        if (error) {
            console.error("Error updating benefit:", error);
            throw error;
        }
        
        if(data) {
            setBenefits(prev => prev.map(b => b.id === benefitId ? data[0] : b));
        }
    };

    return {
        benefits,
        isBenefitsLoading,
        benefitsError,
        addBenefit,
        removeBenefit,
        updateBenefit,
        isInitialized,
    };
}
