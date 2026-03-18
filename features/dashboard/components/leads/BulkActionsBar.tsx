    "use client";

import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  isDeleting?: boolean;
}

export function BulkActionsBar({ 
  selectedCount, 
  onClearSelection, 
  onBulkDelete,
  isDeleting 
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <Card className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border-border bg-background shadow-lg">
      <div className="flex items-center gap-4 px-6 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onClearSelection}
          >
            <X className="size-4" />
          </Button>
          <span className="text-sm font-medium">
            {selectedCount} lead{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-6 w-px bg-border" />

        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 size-4" />
          Delete {selectedCount > 1 ? 'All' : ''}
        </Button>
      </div>
    </Card>
  );
}