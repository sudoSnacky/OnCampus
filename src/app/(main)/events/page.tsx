
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { useEvents } from '../../../hooks/use-events';
import { PlaceHolderImages } from '../../../lib/placeholder-images';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '../../../components/ui/calendar';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '../../../components/ui/dialog';

export default function EventsPage() {
  const { events } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Consolidate date conversion at the beginning
  const processedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      dateObj: event.date instanceof Timestamp ? event.date.toDate() : new Date(event.date),
    })).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [events]);

  const googleColors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];

  const eventModifiers = useMemo(() => {
    const modifiers: Record<string, Date[]> = {
        googleBlue: [],
        googleRed: [],
        googleYellow: [],
        googleGreen: [],
    };
    const colorMap: Record<string, string> = {
        '#4285F4': 'googleBlue',
        '#DB4437': 'googleRed',
        '#F4B400': 'googleYellow',
        '#0F9D58': 'googleGreen',
    };
    const eventDates = new Set<string>();

    processedEvents.forEach(event => {
      const dateString = format(event.dateObj, 'yyyy-MM-dd');
      
      if (!eventDates.has(dateString)) {
        const dayOfMonth = event.dateObj.getDate();
        const colorIndex = dayOfMonth % googleColors.length;
        const stableColor = googleColors[colorIndex];
        const modifierClass = colorMap[stableColor];

        if (modifierClass) {
            modifiers[modifierClass].push(event.dateObj);
        }
        eventDates.add(dateString);
      }
    });
    return modifiers;
  }, [processedEvents]);


  const filteredEvents = selectedDate
    ? processedEvents.filter(event => {
        return format(event.dateObj, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
      })
    : processedEvents;


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
                        modifiersClassNames={{
                            googleBlue: 'day-google-blue',
                            googleRed: 'day-google-red',
                            googleYellow: 'day-google-yellow',
                            googleGreen: 'day-google-green',
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
                const eventDate = event.dateObj;

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
                        <div className="flex flex-col flex-1 p-6">
                            <CardHeader className="p-0">
                                <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 flex-grow flex flex-col justify-between mt-4">
                            <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{event.description}</p>
                            <div className="space-y-2 text-sm text-foreground/70 mb-4">
                                <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{format(eventDate, "MMMM d, yyyy 'at' h:mm a")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                                </div>
                            </div>
                             <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" className="mt-auto">Learn More</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] bg-card">
                                  <DialogHeader>
                                    <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                                      {imageUrl && (
                                        <Image
                                          src={imageUrl}
                                          alt={event.title}
                                          fill
                                          className="object-cover"
                                          data-ai-hint={imageHint}
                                        />
                                      )}
                                    </div>
                                    <DialogTitle className="font-headline text-2xl">{event.title}</DialogTitle>
                                    <DialogDescription className="space-y-2 text-md text-foreground/70 pt-2">
                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4" />
                                            <span>{format(eventDate, "MMMM d, yyyy 'at' h:mm a")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="py-4 text-foreground/80">
                                    <p>{event.longDescription || event.description}</p>
                                  </div>
                                  <DialogFooter>
                                    <Button type="button" variant="secondary">RSVP (Placeholder)</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
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
