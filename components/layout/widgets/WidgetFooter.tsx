interface WidgetFooterProps {
  text: string;
}

export function WidgetFooter({ text }: WidgetFooterProps) {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-muted-foreground">
          { text } Pro. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
