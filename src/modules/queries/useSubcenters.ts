import { useQueries } from "react-query";
import { useCallback } from "react";
import Http from "../utils/Http";
import { SubcenterDto } from "../auth";

const fetchPosition = (id: string) => Http<SubcenterDto>({ url: `/subcenters/${id}` });

export const useSubcenters = (ids: (string | null)[]) => {
  const fetchEntity = useCallback((id: string) => fetchPosition(id), []);
  return useQueries(ids.map(id => ({
    queryKey: ['subcenter', id], 
    queryFn: () => fetchEntity(id!),
    enabled: id !== null,
    staleTime: Infinity,
  })))
};
