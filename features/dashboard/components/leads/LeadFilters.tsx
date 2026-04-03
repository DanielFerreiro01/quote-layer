"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "../shared/SearchBar";
import { useFiltersStore } from "@/features/dashboard/store/useFiltersStore";
import type { LeadStatus } from "@/features/dashboard/types";

const STATUS_OPTIONS: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all",       label: "Todos los estados" },
  { value: "NEW",       label: "Nuevo" },
  { value: "CONTACTED", label: "Contactado" },
  { value: "QUALIFIED", label: "Calificado" },
  { value: "CONVERTED", label: "Convertido" },
  { value: "LOST",      label: "Perdido" },
];

export function LeadFilters() {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    resetFilters,
  } = useFiltersStore();

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as LeadStatus | "all")
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="size-3.5" />
              Limpiar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}