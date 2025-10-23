
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
        const { imageFile: omitImageFile, ...newEvent } = event as any;
        const { data: newData, error } = await supabase
            .from('events')
            .insert([{ ...newEvent, imageUrl }])
            .select()
            .single();

        if (error) throw error;
        if (newData) {
            setData(prevData => [...prevData, newData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
    };
    
    const remove = async (id: string) => {
        const itemToDelete = data.find(item => item.id === id);
        if (!itemToDelete) throw new Error("Event not found");

        const imageUrl = itemToDelete.imageUrl;
        const imagePath = imageUrl.substring(imageUrl.indexOf('/events/') + 1);
        
        if (imagePath) {
             const { error: storageError } = await supabase.storage.from('images').remove([imagePath]);
             if (storageError) {
                console.error("Could not delete image from storage:", storageError.message);
                throw storageError;
             }
        }

        const { error: dbError } = await supabase.from('events').delete().eq('id', id);
        if (dbError) throw dbError;
        
        setData(prevData => prevData.filter(item => item.id !== id));
    };

    const update = async (id: string, event: Partial<Omit<CampusEvent, 'id' | 'created_at'>>, imageFile?: File) => {
        let finalImageUrl = event.imageUrl;
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }
        
        const { imageFile: _, ...updateData } = event as any;

        const { data: updatedData, error } = await supabase
            .from('events')
            .update({ ...updateData, imageUrl: finalImageUrl })
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
