
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useClubs } from '../../../hooks/use-clubs';
import { Skeleton } from '../../../components/ui/skeleton';

export default function ClubsPage() {
  const { clubs, isClubsLoading } = useClubs();

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

      {isClubsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => {
            return (
              <Card key={club.id} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative h-48 w-full">
                  {club.imageUrl && (
                    <Image
                        src={club.imageUrl}
                        alt={club.name}
                        fill
                        className="object-cover"
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
                  <Button className="mt-4 w-full" disabled>Join Club</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
