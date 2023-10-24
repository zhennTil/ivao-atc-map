import { useQueries } from "react-query";
import { useCallback } from "react";
import Http from "../utils/Http";
import { AtcPositionDto } from "../auth";

const fetchPosition = (callsign: string) => Http<AtcPositionDto>({ url: `/positions/${callsign}` });

export const useAtcPositions = (callsigns: (string | null)[]) => {
  const fetchEntity = useCallback((callsign: string) => fetchPosition(callsign), []);
  return useQueries(callsigns.map((callsign) => ({
    queryKey: ['atcPosition', callsign],
    queryFn: () => fetchEntity(callsign!),
    enabled: callsign !== null,
    staleTime: Infinity,
  })));
};
