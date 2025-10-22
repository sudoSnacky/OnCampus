
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { useEvents } from '../../../hooks/use-events';
import { PlaceHolderImages } from '../../../lib/placeholder-images';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { Calendar } from '../../../components/ui/calendar';
import { Button } from '../../../components/ui/button';

export default function EventsPage() {
  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Sort events by date, future events first
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
    const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  const googleColors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];

  const eventModifiers = useMemo(() => {
    const modifiers: { [key: string]: Date[] } = {
        googleBlue: [],
        googleRed: [],
        googleYellow: [],
        googleGreen: [],
    };
    const eventDates = new Set<string>();

    sortedEvents.forEach(event => {
      const eventDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date);
      const dateString = format(eventDate, 'yyyy-MM-dd');
      
      if (!eventDates.has(dateString)) {
        const randomColor = googleColors[Math.floor(Math.random() * googleColors.length)];
        if (randomColor === '#4285F4') modifiers.googleBlue.push(eventDate);
        else if (randomColor === '#DB4437') modifiers.googleRed.push(eventDate);
        else if (randomColor === '#F4B400') modifiers.googleYellow.push(eventDate);
        else if (randomColor === '#0F9D58') modifiers.googleGreen.push(eventDate);
        eventDates.add(dateString);
      }
    });

    return modifiers;
  }, [sortedEvents]);


  const filteredEvents = selectedDate
    ? sortedEvents.filter(event => {
        const eventDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date);
        return format(eventDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      })
    : sortedEvents;


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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <Card>
                <CardContent className="p-2">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md"
                        modifiers={eventModifiers}
                        modifiersStyles={{
                            googleBlue: { boxShadow: '0 0 0 2px #4285F4' },
                            googleRed: { boxShadow: '0 0 0 2px #DB4437' },
                            googleYellow: { boxShadow: '0 0 0 2px #F4B400' },
                            googleGreen: { boxShadow: '0 0 0 2px #0F9D58' },
                        }}
                    />
                </CardContent>
            </Card>
            {selectedDate && (
              <Button onClick={() => setSelectedDate(undefined)} className="w-full mt-4">
                View All Events
              </Button>
            )}
        </div>
        <div className="md:col-span-2 space-y-8">
            {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => {
                const isUrl = event.imageId.startsWith('http');
                const image = !isUrl ? PlaceHolderImages.find(p => p.id === event.imageId) : null;
                const imageUrl = isUrl ? event.imageId : image?.imageUrl;
                const imageHint = image?.imageHint;
                const eventDate = event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date);

                return (
                    <Card key={event.id} className="flex flex-col md:flex-row overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="relative h-48 md:h-auto md:w-1/3">
                        {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover md:rounded-l-lg md:rounded-r-none rounded-t-lg"
                            data-ai-hint={imageHint}
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
                            <CalendarIcon className="h-4 w-4" />
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
                })
            ) : (
                <div className="text-center py-16">
                    <p className="text-lg text-foreground/70">
                        {selectedDate ? "No events found for this date." : "No upcoming events."}
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
