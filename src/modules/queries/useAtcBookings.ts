import { useQueries } from "react-query";
import { useCallback } from "react";
import Http from "../utils/Http";
import { AtcBookingsDto } from "../auth";

const fetchBookings = (date: string) => Http<AtcBookingsDto[]>({ url: `/bookings/${date}` });

const formatQueryDate = (d: Date) => {
  return `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}`;
};

export const useAtcBookings = (days: Date[] = []) => {
  const fetchEntity = useCallback((day: string) => fetchBookings(day), []);
  return useQueries(days.map(formatQueryDate).map((day) => ({
    queryKey: ['atcBookings', day], 
    queryFn: () => fetchEntity(day),
    staleTime: 300000,
  })));
};
