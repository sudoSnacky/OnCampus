
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

const uploadImage = async (file: File): Promise<string> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    }
    const compressedFile = await imageCompression(file, options);

    const filePath = `events/${Date.now()}-${compressedFile.name}`;
    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile);

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
    return publicUrl;
};

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

    const addEvent = async (event: Omit<CampusEvent, 'id' | 'imageUrl' | 'date'> & { date: Date; imageFile?: File }, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        const { id, imageFile: omitImageFile, ...newEvent } = event as any;
        const { data, error } = await supabase
            .from('events')
            .insert([{ ...newEvent, imageUrl, date: event.date.toISOString() }])
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

    const updateEvent = async (eventId: string, event: Partial<Omit<CampusEvent, 'id' | 'date'>> & { date?: Date; imageFile?: File }, imageFile?: File) => {
        let finalImageUrl = event.imageUrl;
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }
        
        const { id, date, imageFile: omitImageFile, ...updateData } = event as any;
        const payload: { [key: string]: any } = { ...updateData, imageUrl: finalImageUrl };
        if (date) {
            payload.date = date.toISOString();
        }

        const { data, error } = await supabase
            .from('events')
            .update(payload)
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
