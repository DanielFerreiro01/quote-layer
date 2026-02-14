// config/installation-icons.tsx
import type { SVGProps } from "react";

export function RoofSheetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="20" width="36" height="22" rx="2" className="fill-muted stroke-current" strokeWidth="2" />
        <path d="M4 22L24 8L44 22" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V18L24 10L36 18V22" className="stroke-primary" strokeWidth="2" />
        <rect x="14" y="24" width="8" height="6" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
        <rect x="26" y="24" width="8" height="6" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
        <rect x="14" y="32" width="8" height="6" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
        <rect x="26" y="32" width="8" height="6" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
      </svg>
  );
}

export function RoofTileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect x="6" y="22" width="36" height="20" rx="2" className="fill-muted stroke-current" strokeWidth="2" />
        <path d="M4 24L24 8L44 24" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="12" cy="14" rx="4" ry="2" className="stroke-current" strokeWidth="1.5" />
        <ellipse cx="20" cy="12" rx="4" ry="2" className="stroke-current" strokeWidth="1.5" />
        <ellipse cx="28" cy="12" rx="4" ry="2" className="stroke-current" strokeWidth="1.5" />
        <ellipse cx="36" cy="14" rx="4" ry="2" className="stroke-current" strokeWidth="1.5" />
        <rect x="16" y="26" width="16" height="10" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="1.5" />
      </svg>
  );
}

export function GroundMountIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="40" width="40" height="4" rx="1" className="fill-muted stroke-current" strokeWidth="2" />
        <path d="M10 40V28" className="stroke-current" strokeWidth="2" />
        <path d="M38 40V28" className="stroke-current" strokeWidth="2" />
        <rect x="8" y="16" width="32" height="14" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="2" transform="rotate(-15 24 23)" />
        <path d="M10 28L24 12L38 28" className="stroke-primary/50" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
  );
}

export function CarportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="h-12 w-12" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="40" width="40" height="4" rx="1" className="fill-muted stroke-current" strokeWidth="2" />
        <path d="M8 40V24" className="stroke-current" strokeWidth="2" />
        <path d="M40 40V24" className="stroke-current" strokeWidth="2" />
        <rect x="4" y="18" width="40" height="8" rx="1" className="fill-primary/30 stroke-primary" strokeWidth="2" />
        <ellipse cx="16" cy="38" rx="4" ry="2" className="stroke-muted-foreground" strokeWidth="1.5" />
        <ellipse cx="32" cy="38" rx="4" ry="2" className="stroke-muted-foreground" strokeWidth="1.5" />
        <rect x="12" y="32" width="24" height="6" rx="2" className="stroke-muted-foreground" strokeWidth="1.5" />
      </svg>
  );
}