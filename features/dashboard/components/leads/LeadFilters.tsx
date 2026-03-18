"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "../shared/SearchBar";
import { useFiltersStore } from "@/features/dashboard/store/useFiltersStore";

export function LeadFilters() {
  const { searchQuery, setSearchQuery } = useFiltersStore();

  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar 
            placeholder="Search leads by name or email..." 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <Button variant="outline">
            <Filter className="mr-2 size-4" />
            Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}