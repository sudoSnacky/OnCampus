
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface CampusEvent {
  id: string;
  created_at: string;
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
        useWebWorker: true,
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
    const [data, setData] = useState<CampusEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error("Error fetching events:", error);
            setError(error as unknown as Error);
        } else {
            setData(data as CampusEvent[]);
        }
        setIsLoading(false);
        if (!isInitialized) setIsInitialized(true);
    }, [isInitialized]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const add = async (event: Omit<CampusEvent, 'id' | 'imageUrl' | 'created_at' >, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        const { data: newData, error } = await supabase
            .from('events')
            .insert([{ ...event, imageUrl }])
            .select()
            .single();

        if (error) throw error;
        if (newData) {
            setData(prevData => [...prevData, newData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
    };
    
    const remove = async (id: string) => {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        fetchEvents(); // Refetch
    };

    const update = async (id: string, event: Partial<Omit<CampusEvent, 'id' | 'created_at'>>, imageFile?: File) => {
        let finalImageUrl = event.imageUrl;
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }

        const { data: updatedData, error } = await supabase
            .from('events')
            .update({ ...event, imageUrl: finalImageUrl })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if(updatedData) {
            setData(prevData => prevData.map(item => item.id === id ? updatedData : item)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
    };

  return {
    data,
    isLoading,
    error,
    isInitialized,
    add,
    remove,
    update,
  };
}
