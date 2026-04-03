"use client";

import { useState, useEffect } from "react";
import { Save, Mail, Phone, Calendar, DollarSign, Zap, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeadDetail } from "@/features/dashboard/hooks/useLeads";
import type { LeadStatus } from "@/features/dashboard/types";

interface LeadDetailsSheetProps {
  leadId: string | null;
  tenant: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (leadId: string, data: { status?: LeadStatus; notes?: string }) => void;
  isSaving?: boolean;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW",       label: "Nuevo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "QUALIFIED", label: "Calificado" },
  { value: "CONVERTED", label: "Convertido" },
  { value: "LOST",      label: "Perdido" },
];

export function LeadDetailsSheet({
  leadId,
  tenant,
  open,
  onOpenChange,
  onSave,
  isSaving = false,
}: LeadDetailsSheetProps) {
  // Own data source — always fresh, never stale from the list
  const { data: lead, isLoading } = useLeadDetail(tenant, open ? leadId : null);

  // Local editable state — synced from fresh lead data
  const [status, setStatus]     = useState<LeadStatus>("NEW");
  const [notes, setNotes]       = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state whenever fresh lead data arrives
  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
      setNotes(lead.notes ?? "");
      setHasChanges(false);
    }
  }, [lead]);

  // Track changes against the fresh lead
  useEffect(() => {
    if (!lead) return;
    setHasChanges(
      status !== lead.status || notes !== (lead.notes ?? ""),
    );
  }, [status, notes, lead]);

  const handleSave = () => {
    if (!leadId) return;
    onSave(leadId, { status, notes });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle>Detalle del lead</SheetTitle>
          <SheetDescription>
            Ver y gestionar la información del lead
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <SheetSkeleton />
          ) : !lead ? (
            <p className="text-sm text-muted-foreground">Lead no encontrado.</p>
          ) : (
            <div className="space-y-6">
              {/* Customer info */}
              <div>
                <h3 className="mb-4 text-sm font-semibold">Información del cliente</h3>
                <div className="space-y-3">
                  <InfoRow icon={<Mail className="size-4 text-muted-foreground" />} label="Email">
                    {lead.customerEmail}
                  </InfoRow>
                  {lead.customerPhone && (
                    <InfoRow icon={<Phone className="size-4 text-muted-foreground" />} label="Teléfono">
                      {lead.customerPhone}
                    </InfoRow>
                  )}
                  <InfoRow icon={<Calendar className="size-4 text-muted-foreground" />} label="Creado">
                    {new Date(lead.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </InfoRow>
                </div>
              </div>

              <Separator />

              {/* Quote info */}
              <div>
                <h3 className="mb-4 text-sm font-semibold">Cotización</h3>
                <div className="space-y-3">
                  <InfoRow icon={<Zap className="size-4 text-muted-foreground" />} label="Potencia">
                    {lead.systemSize.toFixed(1)} kW
                  </InfoRow>
                  <InfoRow icon={<DollarSign className="size-4 text-muted-foreground" />} label="Valor">
                    ${lead.quoteValue.toLocaleString()} USD
                  </InfoRow>
                </div>
              </div>

              <Separator />

              {/* Editable fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lead-status">Estado</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as LeadStatus)}
                  >
                    <SelectTrigger id="lead-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead-notes">Notas</Label>
                  <Textarea
                    id="lead-notes"
                    placeholder="Agregar notas sobre este lead..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving || isLoading}
            >
              {isSaving ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Guardar cambios
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  );
}

function SheetSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}