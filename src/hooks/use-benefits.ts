"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialBenefits, type Benefit } from '../lib/data';

const BENEFITS_STORAGE_KEY = 'oncampus-benefits';

export const useBenefits = () => {
    const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedBenefits = localStorage.getItem(BENEFITS_STORAGE_KEY);
            if (storedBenefits) {
                setBenefits(JSON.parse(storedBenefits));
            } else {
                localStorage.setItem(BENEFITS_STORAGE_KEY, JSON.stringify(initialBenefits));
                setBenefits(initialBenefits);
            }
        } catch (error) {
            console.error("Failed to access or parse benefits from localStorage", error);
            setBenefits(initialBenefits);
        }
        setIsInitialized(true);
    }, []);

    const addBenefit = useCallback((newBenefitData: Omit<Benefit, 'id' | 'imageId'> & { imageId?: string }) => {
        if (!isInitialized) return;

        setBenefits(prevBenefits => {
            const newBenefit: Benefit = {
                ...newBenefitData,
                id: new Date().toISOString(),
                imageId: newBenefitData.imageId || `benefit-${Math.floor(Math.random() * 5) + 1}`,
                redirectUrl: newBenefitData.redirectUrl,
            };
            const updatedBenefits = [...prevBenefits, newBenefit];
            localStorage.setItem(BENEFITS_STORAGE_KEY, JSON.stringify(updatedBenefits));
            return updatedBenefits;
        });
    }, [isInitialized]);

    const removeBenefit = useCallback((benefitId: string) => {
        if (!isInitialized) return;

        setBenefits(prevBenefits => {
            const updatedBenefits = prevBenefits.filter(b => b.id !== benefitId);
            localStorage.setItem(BENEFITS_STORAGE_KEY, JSON.stringify(updatedBenefits));
            return updatedBenefits;
        });
    }, [isInitialized]);

    const safeBenefits = isInitialized ? benefits : [];

    return { benefits: safeBenefits, addBenefit, removeBenefit, isInitialized };
};
