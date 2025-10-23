
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export function useEvents() {
    const [events, setEvents] = useState<CampusEvent[]>([]);
    const [isEventsLoading, setIsLoading] = useState(true);
    const [eventsError, setEventsError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error("Error fetching events:", error);
            setEventsError(error as unknown as Error);
        } else {
            setEvents(data as CampusEvent[]);
        }
        setIsLoading(false);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const addEvent = async (event: Omit<CampusEvent, 'id' | 'date'> & { date: Date }) => {
        const { data, error } = await supabase
            .from('events')
            .insert([{ ...event, date: event.date.toISOString() }])
            .select();

        if (error) {
            console.error("Error adding event:", error);
            throw error;
        }

        if (data) {
            // Refetch to ensure correct sorting
            fetchEvents();
        }
    };
    
    const removeEvent = async (eventId: string) => {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);
        
        if (error) {
            console.error("Error removing event:", error);
            throw error;
        }

        setEvents(prev => prev.filter(e => e.id !== eventId));
    };

    const updateEvent = async (eventId: string, event: Omit<CampusEvent, 'id' | 'date'> & { date: Date }) => {
        const { data, error } = await supabase
            .from('events')
            .update({ ...event, date: event.date.toISOString() })
            .eq('id', eventId)
            .select();

        if (error) {
            console.error("Error updating event:", error);
            throw error;
        }
        
        if(data) {
             // Refetch to ensure correct sorting
            fetchEvents();
        }
    };

  return {
    events,
    isEventsLoading,
    eventsError,
    addEvent,
    removeEvent,
    updateEvent,
    isInitialized,
  };
}
