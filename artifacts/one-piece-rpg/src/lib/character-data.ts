import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useGetCharacter,
  useSaveCharacter,
  type CharacterInput,
  type Character,
} from "@workspace/api-client-react";

export interface CharacterDataApi {
  data: Character | undefined;
  isLoading: boolean;
  refetch: () => void;
  save: {
    mutate: (
      vars: { data: CharacterInput },
      opts?: { onSuccess?: () => void; onError?: () => void; onSettled?: () => void }
    ) => void;
    isSuccess: boolean;
    isPending: boolean;
  };
}

function useAdminCharacter(userId: string, enabled: boolean): CharacterDataApi {
  const queryClient = useQueryClient();
  const queryKey = ["admin-character-edit", userId];

  const query = useQuery<Character | undefined>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/admin/character/${userId}`, { credentials: "include" });
      if (res.status === 404) return undefined;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    retry: false,
    enabled,
  });

  const mutation = useMutation({
    mutationFn: async (data: CharacterInput) => {
      const res = await fetch(`/api/admin/character/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Character>;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKey, saved);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    save: {
      mutate: ({ data }, opts) => {
        mutation.mutate(data, {
          onSuccess: () => opts?.onSuccess?.(),
          onError: () => opts?.onError?.(),
          onSettled: () => opts?.onSettled?.(),
        });
      },
      isSuccess: mutation.isSuccess,
      isPending: mutation.isPending,
    },
  };
}

function useOwnCharacter(): CharacterDataApi {
  const query = useGetCharacter({ query: { retry: false } });
  const mutation = useSaveCharacter();
  return {
    data: query.data,
    isLoading: query.isLoading,
    refetch: () => query.refetch(),
    save: {
      mutate: ({ data }, opts) => {
        mutation.mutate(
          { data },
          {
            onSuccess: () => opts?.onSuccess?.(),
            onError: () => opts?.onError?.(),
            onSettled: () => opts?.onSettled?.(),
          }
        );
      },
      isSuccess: mutation.isSuccess,
      isPending: mutation.isPending,
    },
  };
}

export function useCharacterData(targetUserId?: string): CharacterDataApi {
  const own = useOwnCharacter();
  const admin = useAdminCharacter(targetUserId ?? "__skip__", !!targetUserId);
  return targetUserId ? admin : own;
}
