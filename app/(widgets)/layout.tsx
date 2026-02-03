// app/(widget)/layout.tsx
export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="bg-background text-foreground">
        {children}
      </div>
    </div>
  );
}
