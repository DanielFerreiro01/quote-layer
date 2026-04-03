"use client";

import { MoreHorizontal, Loader2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import type { Lead, LeadStatus } from "@/features/dashboard/types";

interface LeadRowProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onDelete?: (leadId: string) => void;
  isUpdating?: boolean;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW",       label: "Nuevo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "QUALIFIED", label: "Calificado" },
  { value: "CONVERTED", label: "Convertido" },
  { value: "LOST",      label: "Perdido" },
];

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW:       "Nuevo",
  CONTACTED: "Contactado",
  QUALIFIED: "Calificado",
  CONVERTED: "Convertido",
  LOST:      "Perdido",
};

const getStatusVariant = (
  status: LeadStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "NEW":       return "secondary";
    case "CONTACTED": return "outline";
    case "QUALIFIED": return "default";
    case "CONVERTED": return "default";
    case "LOST":      return "destructive";
  }
};

export function LeadRow({
  lead,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  isUpdating = false,
}: LeadRowProps) {
  const initials = lead.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TableRow className={isUpdating ? "opacity-60 pointer-events-none" : ""}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{lead.customerName}</p>
            <p className="text-xs text-muted-foreground">{lead.id.slice(0, 8)}...</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div>
          <p className="text-sm">{lead.customerEmail}</p>
          {lead.customerPhone && (
            <p className="text-xs text-muted-foreground">{lead.customerPhone}</p>
          )}
        </div>
      </TableCell>

      <TableCell>
        <p className="font-medium">{lead.systemSize.toFixed(1)} kW</p>
      </TableCell>

      <TableCell>
        <p className="font-medium">${lead.quoteValue.toLocaleString()}</p>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          {isUpdating && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
          <Badge variant={getStatusVariant(lead.status)}>
            {STATUS_LABELS[lead.status]}
          </Badge>
        </div>
      </TableCell>

      <TableCell>
        <p className="text-sm text-muted-foreground">
          {new Date(lead.createdAt).toLocaleDateString("es-AR")}
        </p>
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(lead)}>
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Cambiar estado</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={lead.status}
                  onValueChange={(v) => onUpdateStatus(lead.id, v as LeadStatus)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(lead.id)}
                >
                  Eliminar lead
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}