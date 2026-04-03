"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "../shared/EmptyState";
import { LeadRow } from "./LeadRow";
import { Users } from "lucide-react";
import type { Lead, LeadStatus } from "@/features/dashboard/types";

interface LeadsTableProps {
  leads: Lead[];
  isLoading?: boolean;
  onViewDetails: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onDelete?: (leadId: string) => void;
  updatingLeadId?: string | null;
}

export function LeadsTable({
  leads,
  isLoading,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  updatingLeadId,
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Todos los leads</CardTitle>
          <CardDescription>Cargando leads...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos los leads</CardTitle>
        <CardDescription>
          {leads.length} leads cargados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Sin leads"
            description="Los leads aparecerán aquí cuando los clientes envíen solicitudes de cotización."
          />
        ) : (
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Sistema</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  onViewDetails={onViewDetails}
                  onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete}
                  isUpdating={updatingLeadId === lead.id}
                />
              ))}
            </TableBody>
          </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
