import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { benefits, type Benefit } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function BenefitsPage() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit: Benefit) => {
          const image = PlaceHolderImages.find(p => p.id === benefit.imageId);
          return (
            <Card key={benefit.id} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="relative h-48 w-full">
                {image && (
                   <Image
                      src={image.imageUrl}
                      alt={benefit.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint={image.imageHint}
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
              <CardContent className="flex-grow">
                <p className="text-sm text-foreground/80">{benefit.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
