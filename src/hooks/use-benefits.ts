
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface Benefit {
  id: string;
  created_at: string;
  title: string;
  provider: string;
  description: string;
  category: string;
  imageUrl: string;
  redirectUrl?: string;
}

const uploadImage = async (file: File): Promise<string> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }
    
    const compressedFile = await imageCompression(file, options);

    const filePath = `benefits/${Date.now()}-${compressedFile.name}`;
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

export function useBenefits() {
    const [data, setData] = useState<Benefit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchBenefits = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('benefits')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching benefits:", error);
            setError(error as unknown as Error);
        } else {
            setData(data as Benefit[]);
        }
        setIsLoading(false);
        if (!isInitialized) setIsInitialized(true);
    }, [isInitialized]);

    useEffect(() => {
        fetchBenefits();
    }, [fetchBenefits]);

    const add = async (benefit: Omit<Benefit, 'id' | 'imageUrl' | 'created_at'>, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        
        const { imageFile: _, ...benefitData } = benefit as any;

        const { data, error } = await supabase
            .from('benefits')
            .insert([{ ...benefitData, imageUrl }])
            .select();

        if (error) throw error;
        if (data) fetchBenefits();
    };
    
    const remove = async (id: string) => {
        const itemToDelete = data.find(item => item.id === id);
        if (!itemToDelete) throw new Error("Item not found");

        // 1. Delete image from storage
        try {
            const imageUrl = itemToDelete.imageUrl;
            const imageName = imageUrl.split('/').pop();
            if (imageName) {
                 const { error: storageError } = await supabase.storage.from('images').remove([`benefits/${imageName}`]);
                 if (storageError) {
                    console.error("Error deleting image, but proceeding with DB record deletion:", storageError);
                 }
            }
        } catch(e) {
            console.error("Error parsing image URL for deletion:", e);
        }

        // 2. Delete record from database
        const { error } = await supabase.from('benefits').delete().eq('id', id);
        if (error) throw error;

        // 3. Refresh local data
        fetchBenefits();
    };

    const update = async (id: string, updatedBenefit: Partial<Omit<Benefit, 'id' | 'created_at'>>, imageFile?: File) => {
        let imageUrl = updatedBenefit.imageUrl;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        }

        const { imageFile: _, ...updateData } = updatedBenefit as any;
        
        const { data, error } = await supabase
            .from('benefits')
            .update({ ...updateData, imageUrl })
            .eq('id', id)
            .select();

        if (error) throw error;
        if(data) fetchBenefits();
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
