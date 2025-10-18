"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialClubs, type Club } from '../lib/data';

const CLUBS_STORAGE_KEY = 'oncampus-clubs';

export const useClubs = () => {
    const [clubs, setClubs] = useState<Club[]>(initialClubs);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedClubs = localStorage.getItem(CLUBS_STORAGE_KEY);
            if (storedClubs) {
                setClubs(JSON.parse(storedClubs));
            } else {
                localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(initialClubs));
                setClubs(initialClubs);
            }
        } catch (error) {
            console.error("Failed to access or parse clubs from localStorage", error);
            setClubs(initialClubs);
        }
        setIsInitialized(true);
    }, []);

    const addClub = useCallback((newClubData: Omit<Club, 'id' | 'imageId'> & { imageId?: string }) => {
        if (!isInitialized) return;

        setClubs(prevClubs => {
            const newClub: Club = {
                ...newClubData,
                id: new Date().toISOString(),
                imageId: newClubData.imageId || `club-${Math.floor(Math.random() * 5) + 1}`,
            };
            const updatedClubs = [...prevClubs, newClub];
            localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(updatedClubs));
            return updatedClubs;
        });
    }, [isInitialized]);

    const removeClub = useCallback((clubId: string) => {
        if (!isInitialized) return;

        setClubs(prevClubs => {
            const updatedClubs = prevClubs.filter(c => c.id !== clubId);
            localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(updatedClubs));
            return updatedClubs;
        });
    }, [isInitialized]);

    const safeClubs = isInitialized ? clubs : [];

    return { clubs: safeClubs, addClub, removeClub, isInitialized };
};
