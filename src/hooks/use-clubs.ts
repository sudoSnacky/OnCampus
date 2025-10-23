
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface Club {
  id: string;
  created_at: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

const uploadImage = async (file: File): Promise<string> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }

    const compressedFile = await imageCompression(file, options);
    
    const filePath = `clubs/${Date.now()}-${compressedFile.name}`;
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

export function useClubs() {
    const [data, setData] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchClubs = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('clubs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching clubs:", error);
            setError(error as unknown as Error);
        } else {
            setData(data as Club[]);
        }
        setIsLoading(false);
        if (!isInitialized) setIsInitialized(true);
    }, [isInitialized]);

    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);

    const add = async (club: Omit<Club, 'id' | 'imageUrl' | 'created_at'>, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        const { imageFile: _, ...clubData } = club as any;
        const { data: newData, error } = await supabase
            .from('clubs')
            .insert([{ ...clubData, imageUrl }])
            .select()
            .single();

        if (error) throw error;
        if (newData) setData(prevData => [newData, ...prevData]);
    };
    
    const remove = async (id: string) => {
        const itemToDelete = data.find(item => item.id === id);
        if (!itemToDelete) throw new Error("Club not found");

        const imageUrl = itemToDelete.imageUrl;
        const imagePath = imageUrl.split('/images/')[1];
        
        if (imagePath) {
             const { error: storageError } = await supabase.storage.from('images').remove([imagePath]);
             if (storageError) {
                console.error("Could not delete image from storage:", storageError.message);
                throw storageError;
             }
        }
        
        const { error: dbError } = await supabase.from('clubs').delete().eq('id', id);
        if (dbError) throw dbError;
        
        setData(prevData => prevData.filter(item => item.id !== id));
    };

    const update = async (id: string, updatedClub: Partial<Omit<Club, 'id' | 'created_at'>>, imageFile?: File) => {
        let imageUrl = updatedClub.imageUrl;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const { imageFile: _, ...updateData } = updatedClub as any;

        const { data: updatedData, error } = await supabase
            .from('clubs')
            .update({ ...updateData, imageUrl })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if(updatedData) {
            setData(prevData => prevData.map(item => item.id === id ? updatedData : item));
        }
    };


  return {
    data,
    isLoading,
    error,
    add,
    remove,
    update,
    isInitialized,
  };
}
