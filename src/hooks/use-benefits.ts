
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface Benefit {
  id: string;
  title: string;
  provider: string;
  description: string;
  tags: string;
  imageUrl: string;
  redirectUrl?: string;
}

const uploadImage = async (file: File): Promise<string> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    }
    
    const imageFile = await imageCompression(file, options);
    const canvas = await imageCompression.loadImage(URL.createObjectURL(imageFile));
    const resizedFile = await imageCompression.canvasToFile(
      canvas,
      imageFile.type,
      imageFile.name,
      imageFile.lastModified,
      1 // Set quality to 1
    );

    const filePath = `benefits/${Date.now()}-${resizedFile.name}`;
    const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, resizedFile);

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
    return publicUrl;
};

export function useBenefits() {
    const [benefits, setBenefits] = useState<Benefit[]>([]);
    const [isBenefitsLoading, setIsLoading] = useState(true);
    const [benefitsError, setBenefitsError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchBenefits = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('benefits')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching benefits:", error);
            setBenefitsError(error as unknown as Error);
        } else {
            setBenefits(data as Benefit[]);
        }
        setIsLoading(false);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        fetchBenefits();
    }, [fetchBenefits]);

    const addBenefit = async (benefit: Omit<Benefit, 'id' | 'imageUrl'>, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        
        const { data, error } = await supabase
            .from('benefits')
            .insert([{ ...benefit, imageUrl }])
            .select();

        if (error) {
            console.error("Error adding benefit:", error);
            throw error;
        }

        if (data) {
            setBenefits(prev => [data[0], ...prev]);
        }
    };
    
    const removeBenefit = async (benefitId: string) => {
        const { error } = await supabase
            .from('benefits')
            .delete()
            .eq('id', benefitId);
        
        if (error) {
            console.error("Error removing benefit:", error);
            throw error;
        }

        setBenefits(prev => prev.filter(b => b.id !== benefitId));
    };

    const updateBenefit = async (benefitId: string, updatedBenefit: Partial<Omit<Benefit, 'id'>> & { imageFile?: File }, imageFile?: File) => {
        let finalImageUrl = updatedBenefit.imageUrl;
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }

        const updateData = { ...updatedBenefit, imageUrl: finalImageUrl };
        delete updateData.imageFile;
        
        const { data, error } = await supabase
            .from('benefits')
            .update(updateData)
            .eq('id', benefitId)
            .select();

        if (error) {
            console.error("Error updating benefit:", error);
            throw error;
        }
        
        if(data) {
            setBenefits(prev => prev.map(b => b.id === benefitId ? data[0] : b));
        }
    };

    return {
        benefits,
        isBenefitsLoading,
        benefitsError,
        addBenefit,
        removeBenefit,
        updateBenefit,
        isInitialized,
    };
}
