
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface Club {
  id: string;
  name: string;
  category: string;
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
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isClubsLoading, setIsLoading] = useState(true);
    const [clubsError, setClubsError] = useState<Error | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const fetchClubs = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('clubs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching clubs:", error);
            setClubsError(error as unknown as Error);
        } else {
            setClubs(data as Club[]);
        }
        setIsLoading(false);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);

    const addClub = async (club: Omit<Club, 'id' | 'imageUrl'> & { imageFile?: File }, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        const { id, imageFile: omitImageFile, ...newClub } = club as any;
        const { data, error } = await supabase
            .from('clubs')
            .insert([{ ...newClub, imageUrl }])
            .select();

        if (error) {
            console.error("Error adding club:", error);
            throw error;
        }

        if (data) {
            setClubs(prev => [data[0], ...prev]);
        }
    };
    
    const removeClub = async (clubId: string) => {
        const { error } = await supabase
            .from('clubs')
            .delete()
            .eq('id', clubId);
        
        if (error) {
            console.error("Error removing club:", error);
            throw error;
        }

        setClubs(prev => prev.filter(c => c.id !== clubId));
    };

    const updateClub = async (clubId: string, updatedClub: Partial<Club>, imageFile?: File) => {
        let finalImageUrl = updatedClub.imageUrl;
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }
        
        const { id, imageFile: omitImageFile, ...updateData } = { ...updatedClub, imageUrl: finalImageUrl };
        const { data, error } = await supabase
            .from('clubs')
            .update(updateData)
            .eq('id', clubId)
            .select();

        if (error) {
            console.error("Error updating club:", error);
            throw error;
        }
        
        if(data) {
            setClubs(prev => prev.map(c => c.id === clubId ? data[0] : c));
        }
    };


  return {
    clubs,
    isClubsLoading,
    clubsError,
    addClub,
    removeClub,
    updateClub,
    isInitialized,
  };
}
