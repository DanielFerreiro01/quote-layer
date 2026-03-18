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
}

export function LeadsTable({ 
  leads, 
  isLoading, 
  onViewDetails, 
  onUpdateStatus,
  onDelete 
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Leads</CardTitle>
          <CardDescription>Loading leads...</CardDescription>
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
        <CardTitle>All Leads</CardTitle>
        <CardDescription>
          {leads.length} total leads from your quote calculator
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No leads yet"
            description="Leads will appear here when customers submit quote requests through your calculator."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Quote Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
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
                />
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}