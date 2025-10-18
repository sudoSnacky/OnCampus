import { cn } from "../lib/utils";

export function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 h-20 border-b bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
}
