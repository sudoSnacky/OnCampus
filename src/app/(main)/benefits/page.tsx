
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useBenefits } from '../../../hooks/use-benefits';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { Skeleton } from '../../../components/ui/skeleton';

export default function BenefitsPage() {
  const { benefits, isBenefitsLoading } = useBenefits();

  return (
    <div className="container mx-auto">
      <div className="mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
          Benefits Hub
        </h1>
        <p className="mt-3 text-xl text-foreground/70">
          Exclusive discounts and offers for Indian students.
        </p>
      </div>

      {isBenefitsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="flex flex-col">
                    <Skeleton className="h-48 w-full" />
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
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
            {benefits.map((benefit) => {
            return (
                <Card key={benefit.id} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="relative h-48 w-full">
                    {benefit.imageUrl && (
                    <Image
                        src={benefit.imageUrl}
                        alt={benefit.title}
                        fill
                        className="object-cover"
                    />
                    )}
                </div>
                <CardHeader>
                    <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-xl">{benefit.title}</CardTitle>
                        <CardDescription>{benefit.provider}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">{benefit.category}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <p className="text-sm text-foreground/80 flex-grow">{benefit.description}</p>
                    {benefit.redirectUrl && (
                    <Button asChild className="mt-4 w-full bg-primary/90 text-primary-foreground hover:bg-primary/100 backdrop-blur-lg border border-primary/30 transition-all duration-300">
                        <Link href={benefit.redirectUrl} target="_blank" rel="noopener noreferrer">
                        Redeem
                        </Link>
                    </Button>
                    )}
                </CardContent>
                </Card>
            );
            })}
        </div>
      )}
    </div>
  );
}
