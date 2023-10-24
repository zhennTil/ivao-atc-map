import { PropsWithChildren, createContext, useCallback, useMemo, useState } from "react";
import { useAtcBookings } from "../queries/useAtcBookings";
import { useAtcPositions } from "../queries/useAtcPositions";
import { useSubcenters } from "../queries/useSubcenters";
import { AtcBookingsDto, AtcPositionDto, SubcenterDto } from "../auth";

export const AtcContext = createContext<BookingContext>({bookings: [], setTimeFilter: () => {}});

export const UNKNOWN_ATC_POSITION_TYPE_CODE = "UNKNOWN";

export interface BookingContext {
    bookings: Booking[];
    setTimeFilter: (start: Date, end: Date) => void;
}
export interface Booking extends AtcBookingsDto {
    positionTypeCode: string;
    aerodromePosition: AtcPositionDto | undefined;
    centerPosition: SubcenterDto | undefined;
}

const AtcProvider = ({children}: PropsWithChildren) => {
    const [ startDate, setStartDate ] = useState<Date>(new Date());
    const [ endDate, setEndDate ] = useState<Date>(new Date());
    const days = useMemo<Date[]>(() => {
        const newDays = [];

        let d = new Date(startDate);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        do {
            newDays.push(new Date(d));
            d.setUTCDate(d.getUTCDate() + 1);
        } while (d <= endDate);

        return newDays;
    }, [startDate, endDate]);

    const bookingQueries = useAtcBookings(days);
    const bookings: AtcBookingsDto[] = useMemo(() => bookingQueries
        .filter(b => b.isSuccess)
        .flatMap(b => b.data!)
        .filter(b => new Date(b.startDate) < endDate && new Date(b.endDate) > startDate),
        [bookingQueries]);

    const positionQueries = useAtcPositions(bookings?.map(booking => booking.atcPosition) ?? [])
    const subcenterQueries = useSubcenters(bookings?.map(booking => booking.subcenter) ?? [])

    const mappedBookings = useMemo<Booking[]>(() => {
        if (!bookings) return [];

        return bookings.map(booking => {
            let positionData = undefined;
            if (booking.atcPosition) {
                positionData = positionQueries.find(q => q.data?.composePosition === booking.atcPosition)
            }
            let subcenterData = undefined;
            if (booking.subcenter) {
                subcenterData = subcenterQueries.find(q => q.data?.composePosition === booking.subcenter)
            }

            return {
                ...booking,
                positionTypeCode: positionData?.data?.position ?? subcenterData?.data?.position ?? UNKNOWN_ATC_POSITION_TYPE_CODE,
                aerodromePosition: positionData?.data,
                centerPosition: subcenterData?.data,
            };
        }).filter(b => b.positionTypeCode !== UNKNOWN_ATC_POSITION_TYPE_CODE);
    }, [bookings, positionQueries, subcenterQueries]);

    const setTimeFilter = useCallback((start: Date, end: Date) => {
        setStartDate(start);
        setEndDate(end);
    }, []);

    const context = {
        bookings: mappedBookings,
        setTimeFilter
    };

    return (<AtcContext.Provider value={context}>{children}</AtcContext.Provider>);
};

export default AtcProvider;