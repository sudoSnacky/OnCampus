import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Icons } from "../../components/icons";
import { MainNav } from "../../components/main-nav";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/page-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader>
        <div className="container mx-auto flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-2">
              <Icons.logo />
            </Link>
          <div className="flex items-center gap-4">
            <MainNav />
          </div>
        </div>
      </PageHeader>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
