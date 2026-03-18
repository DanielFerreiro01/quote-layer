"use client";

import { MoreHorizontal } from "lucide-react";
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
}

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "CONVERTED", label: "Converted" },
  { value: "LOST", label: "Lost" },
];

const getStatusVariant = (status: LeadStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "NEW":
      return "secondary";
    case "CONTACTED":
      return "outline";
    case "QUALIFIED":
      return "default";
    case "CONVERTED":
      return "default";
    case "LOST":
      return "destructive";
    default:
      return "secondary";
  }
};

export function LeadRow({ lead, onViewDetails, onUpdateStatus, onDelete }: LeadRowProps) {
  const initials = lead.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{lead.customerName}</p>
            <p className="text-xs text-muted-foreground">{lead.id}</p>
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
        <Badge variant={getStatusVariant(lead.status)} className="capitalize">
          {lead.status.toLowerCase()}
        </Badge>
      </TableCell>
      <TableCell>
        <p className="text-sm text-muted-foreground">
          {new Date(lead.createdAt).toLocaleDateString()}
        </p>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(lead)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>Send Email</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup 
                  value={lead.status} 
                  onValueChange={(value) => onUpdateStatus(lead.id, value as LeadStatus)}
                >
                  {statusOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete(lead.id)}
                >
                  Delete Lead
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}