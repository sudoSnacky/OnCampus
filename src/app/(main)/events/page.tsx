"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEvents } from '@/hooks/use-events';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';

export default function EventsPage() {
  const { events } = useEvents();

  // Sort events by date, future events first
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container mx-auto">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          Campus Events
        </h1>
        <p className="mt-3 text-xl text-foreground/70">
          Workshops, seminars, and fests happening around you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedEvents.map((event) => {
          const image = PlaceHolderImages.find(p => p.id === event.imageId);
          const eventDate = new Date(event.date);

          return (
            <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="relative h-48 md:h-auto md:w-1/3">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={event.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-sm text-foreground/80 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(eventDate, "MMMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
