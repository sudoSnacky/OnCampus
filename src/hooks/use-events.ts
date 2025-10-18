
"use client";

import { useState, useEffect, useCallback } from 'react';
import { initialEvents, type CampusEvent } from '../lib/data';

const EVENTS_STORAGE_KEY = 'oncampus-events';

export const useEvents = () => {
    const [events, setEvents] = useState<CampusEvent[]>(initialEvents);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // This effect runs only on the client after hydration
        try {
            const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
            if (storedEvents) {
                setEvents(JSON.parse(storedEvents));
            } else {
                // If nothing in storage, initialize it with mock data
                localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
                setEvents(initialEvents);
            }
        } catch (error) {
            console.error("Failed to access or parse events from localStorage", error);
            setEvents(initialEvents);
        }
        setIsInitialized(true);
    }, []);

    const addEvent = useCallback((newEventData: Omit<CampusEvent, 'id'>) => {
        if (!isInitialized) return;

        setEvents(prevEvents => {
            const newEvent: CampusEvent = {
                ...newEventData,
                id: new Date().toISOString(),
                imageId: newEventData.imageId || `event-${Math.floor(Math.random() * 3) + 1}`,
            };
            const updatedEvents = [...prevEvents, newEvent];
            localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
            return updatedEvents;
        });
    }, [isInitialized]);
    
    const removeEvent = useCallback((eventId: string) => {
        if (!isInitialized) return;

        setEvents(prevEvents => {
            const updatedEvents = prevEvents.filter(e => e.id !== eventId);
            localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
            return updatedEvents;
        });
    }, [isInitialized]);

    // Return an empty array until the client-side has initialized
    // to prevent hydration mismatches.
    const safeEvents = isInitialized ? events : [];

    return { events: safeEvents, addEvent, removeEvent, isInitialized };
};
