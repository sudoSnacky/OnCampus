"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useClubs } from '../../../hooks/use-clubs';
import { PlaceHolderImages } from '../../../lib/placeholder-images';

export default function ClubsPage() {
  const { clubs } = useClubs();

  return (
    <div className="container mx-auto">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          Club Directory
        </h1>
        <p className="mt-3 text-xl text-foreground/70">
          Find your community. Discover and join student clubs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubs.map((club) => {
          const isUrl = club.imageId.startsWith('http');
          const image = !isUrl ? PlaceHolderImages.find(p => p.id === club.imageId) : null;
          const imageUrl = isUrl ? club.imageId : image?.imageUrl;
          const imageHint = image?.imageHint;
          return (
            <Card key={club.id} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-48 w-full">
                {imageUrl && (
                   <Image
                      src={imageUrl}
                      alt={club.name}
                      fill
                      className="object-cover"
                      data-ai-hint={imageHint}
                   />
                )}
              </div>
              <CardHeader>
                 <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-xl">{club.name}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/20 text-primary-foreground border-primary/30">{club.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-sm text-foreground/80 flex-grow">{club.description}</p>
                <Button className="mt-4 w-full">Join Club</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
