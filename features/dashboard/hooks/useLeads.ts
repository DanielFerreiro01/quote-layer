import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeads } from "@/app/actions/leads/get-leads";
import { updateLead } from "@/app/actions/leads/update-lead";
import { deleteLead, bulkDeleteLeads } from "@/app/actions/leads/delete-lead";
import type { GetLeadsInput } from "@/app/actions/leads/get-leads";
import type { UpdateLeadInput } from "@/app/actions/leads/update-lead";
import type { DeleteLeadInput, BulkDeleteLeadsInput } from "@/app/actions/leads/delete-lead";
import type { Lead } from "@/features/dashboard/types";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const leadsKeys = {
  all:    (tenant: string) => ["leads", tenant] as const,
  list:   (tenant: string, input: GetLeadsInput) => ["leads", tenant, "list", input] as const,
  detail: (tenant: string, leadId: string) => ["leads", tenant, "detail", leadId] as const,
};

// ─── useLeads ─────────────────────────────────────────────────────────────────

export function useLeads(input: GetLeadsInput) {
  return useQuery({
    queryKey:  leadsKeys.list(input.tenant, input),
    queryFn:   () => getLeads(input),
    staleTime: 30_000,
    select: (result) => {
      if (!result.ok) throw new Error(result.error);
      return result;
    },
  });
}

// ─── useLeadDetail ────────────────────────────────────────────────────────────
// Used by LeadDetailsSheet to have its own fresh source of truth.
// Reads from any existing list cache first — no extra network request if the
// lead is already loaded. Falls back to a targeted fetch otherwise.

export function useLeadDetail(tenant: string, leadId: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey:  leadsKeys.detail(tenant, leadId ?? ""),
    enabled:   !!leadId,
    staleTime: 30_000,
    queryFn:   async () => {
      // Try every cached list before hitting the network
      const cached = findLeadInCache(queryClient, tenant, leadId!);
      if (cached) return cached;

      // Targeted fetch: get page 1 filtered to just this lead
      // (no single-lead endpoint yet — fetch list and extract)
      const result = await getLeads({
        tenant,
        filters:    {},
        pagination: { page: 1, pageSize: 1 },
      });
      if (!result.ok) throw new Error(result.error);
      const found = result.leads.find((l) => l.id === leadId);
      if (!found) throw new Error("Lead no encontrado");
      return found;
    },
  });
}

// ─── useUpdateLead ────────────────────────────────────────────────────────────

export function useUpdateLead(tenant: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateLeadInput) => updateLead(input),

    // Optimistic update: patch every cached list + the detail cache immediately
    // so the UI reflects the change without waiting for the server round-trip.
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: leadsKeys.all(tenant) });

      // Snapshot all affected caches for rollback
      const snapshot = queryClient.getQueriesData<any>({
        queryKey: leadsKeys.all(tenant),
      });

      const patch = (l: Lead) =>
        l.id !== input.leadId
          ? l
          : {
              ...l,
              ...(input.data.status !== undefined ? { status: input.data.status } : {}),
              ...(input.data.notes  !== undefined ? { notes:  input.data.notes  } : {}),
            };

      // Patch all list caches
      queryClient.setQueriesData<any>(
        { queryKey: leadsKeys.all(tenant) },
        (old: any) =>
          old?.leads ? { ...old, leads: old.leads.map(patch) } : old,
      );

      // Patch the detail cache if it exists
      queryClient.setQueryData<Lead>(
        leadsKeys.detail(tenant, input.leadId),
        (old) => (old ? patch(old) : old),
      );

      return { snapshot };
    },

    onError: (_err, _input, context) => {
      // Roll back all caches to pre-mutation state
      context?.snapshot?.forEach(([key, value]: [any, any]) => {
        queryClient.setQueryData(key, value);
      });
    },

    onSettled: () => {
      // Sync with server truth regardless of outcome
      queryClient.invalidateQueries({ queryKey: leadsKeys.all(tenant) });
    },
  });
}

// ─── useDeleteLead ────────────────────────────────────────────────────────────

export function useDeleteLead(tenant: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteLeadInput) => deleteLead(input),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: leadsKeys.all(tenant) });
      }
    },
  });
}

// ─── useBulkDeleteLeads ───────────────────────────────────────────────────────

export function useBulkDeleteLeads(tenant: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BulkDeleteLeadsInput) => bulkDeleteLeads(input),
    onSuccess: (result) => {
      if (result.ok) {
        queryClient.invalidateQueries({ queryKey: leadsKeys.all(tenant) });
      }
    },
  });
}

// ─── Cache helper ─────────────────────────────────────────────────────────────

function findLeadInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  tenant: string,
  leadId: string,
): Lead | undefined {
  const allCached = queryClient.getQueriesData<any>({
    queryKey: leadsKeys.all(tenant),
  });
  for (const [, data] of allCached) {
    const found = data?.leads?.find((l: Lead) => l.id === leadId);
    if (found) return found;
  }
  return undefined;
}