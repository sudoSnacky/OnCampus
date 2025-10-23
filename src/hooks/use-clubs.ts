
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
        const { data, error } = await supabase
            .from('clubs')
            .insert([{ ...clubData, imageUrl }])
            .select();

        if (error) throw error;
        if (data) fetchClubs();
    };
    
    const remove = async (id: string) => {
        const itemToDelete = data.find(item => item.id === id);
        if (!itemToDelete) throw new Error("Item not found");

        try {
            const imageUrl = itemToDelete.imageUrl;
            const urlParts = imageUrl.split('/');
            const imagePath = urlParts.slice(urlParts.indexOf('clubs')).join('/');
            
            if (imagePath) {
                 const { error: storageError } = await supabase.storage.from('images').remove([imagePath]);
                 if (storageError) {
                    console.error("Could not delete image from storage, but proceeding with DB record deletion:", storageError.message);
                 }
            }
        } catch(e) {
            console.error("Error parsing image URL for deletion:", e);
        }

        const { error } = await supabase.from('clubs').delete().eq('id', id);
        if (error) throw error;
        
        fetchClubs();
    };

    const update = async (id: string, updatedClub: Partial<Omit<Club, 'id' | 'created_at'>>, imageFile?: File) => {
        let imageUrl = updatedClub.imageUrl;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }
        
        const { imageFile: _, ...updateData } = updatedClub as any;

        const { data, error } = await supabase
            .from('clubs')
            .update({ ...updateData, imageUrl })
            .eq('id', id)
            .select();

        if (error) throw error;
        if(data) fetchClubs();
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
