import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ticket, Users, Calendar, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Icons } from "../components/icons";
import RecommendationEngine from "../components/recommendation-engine";
import { PlaceHolderImages } from "../lib/placeholder-images";

const features = [
  {
    icon: <Ticket className="h-8 w-8 text-primary" />,
    title: "Benefits Hub",
    description: "Unlock exclusive student discounts on your favorite brands, software, and services across India.",
    href: "/benefits",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Club Directory",
    description: "Discover and join vibrant student communities, from coding clubs to cultural societies.",
    href: "/clubs",
  },
  {
    icon: <Calendar className="h-8 w-8 text-primary" />,
    title: "Event Calendar",
    description: "Stay updated with the latest workshops, seminars, and fests happening on your campus.",
    href: "/events",
  },
];

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo />
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/benefits" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Benefits</Link>
            <Link href="/clubs" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Clubs</Link>
            <Link href="/events" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Events</Link>
          </nav>
          <Button asChild>
            <Link href="/login">Admin Login <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground">
                  Your College Life,{" "}
                  <span className="text-primary">Supercharged</span>.
                </h1>
                <p className="max-w-xl text-lg text-foreground/80">
                  Welcome to OnCampus India! The single platform to discover student benefits, join exciting clubs, and never miss an event. Powered by AI to personalize your campus experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="#recommendations">
                      Get Started <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-full min-h-[300px] lg:min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                {heroImage && (
                   <Image
                      src={heroImage.imageUrl}
                      alt={heroImage.description}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      data-ai-hint={heroImage.imageHint}
                      priority
                    />
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">
                Everything You Need, All in One Place
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                From exclusive deals to campus happenings, we've got you covered.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center flex flex-col items-center p-8 bg-card hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl rounded-2xl">
                    <div className="bg-primary/10 p-4 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="mt-6 font-headline text-xl font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-foreground/60 flex-grow">{feature.description}</p>
                    <Button variant="link" asChild className="mt-4 text-primary">
                      <Link href={feature.href}>
                        Explore Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="recommendations" className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-primary" />
                Personalized For You
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                Tell us what you're passionate about, and our AI will curate a list of benefits, clubs, and events just for you.
              </p>
            </div>
            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="bg-white dark:bg-gray-900 shadow-xl border-border/80 rounded-2xl">
                <CardContent className="p-8">
                  <RecommendationEngine />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Icons.logo />
            </div>
            <p className="text-sm text-foreground/60 mt-4 md:mt-0">
              © {new Date().getFullYear()} OnCampus. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
