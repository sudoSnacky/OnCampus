
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export interface Club {
  id: string;
  name: string;
  tags: string;
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

    const imageFile = await imageCompression(file, options);
    const canvas = await imageCompression.loadImage(URL.createObjectURL(imageFile));
    const resizedFile = await imageCompression.canvasToFile(
      canvas,
      imageFile.type,
      imageFile.name,
      imageFile.lastModified,
      1 // Set quality to 1
    );
    
    const filePath = `clubs/${Date.now()}-${resizedFile.name}`;
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

    const addClub = async (club: Omit<Club, 'id' | 'imageUrl'>, imageFile: File) => {
        const imageUrl = await uploadImage(imageFile);
        const { data, error } = await supabase
            .from('clubs')
            .insert([{ ...club, imageUrl }])
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

    const updateClub = async (clubId: string, updatedClub: Partial<Omit<Club, 'id'>> & { imageFile?: File }, imageFile?: File) => {
        let finalImageUrl = updatedClub.imageUrl;
        if (imageFile) {
            finalImageUrl = await uploadImage(imageFile);
        }
        
        const updateData = { ...updatedClub, imageUrl: finalImageUrl };
        delete updateData.imageFile;

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
