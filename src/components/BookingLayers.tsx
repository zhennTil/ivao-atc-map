import { useContext, useEffect, useMemo } from "react";
import AtcPositionShape from "./AtcPositionShape";
import { Pane } from "react-leaflet";
import { AtcContext, Booking } from "../modules/contexts/AtcProvider";
import { useSnackbar } from "notistack";

const TYPES_CENTER = ['CTR', 'FSS'];
const TYPES_APPROACH = ['APP'];
const TYPES_AERODROME = ['TWR', 'GND', 'DEL'];
const TYPES_ALL = TYPES_CENTER.concat(TYPES_APPROACH).concat(TYPES_AERODROME);

interface BookingsLayerProps {
}

const BookingLayers = ({}: BookingsLayerProps) => {
    const { bookings } = useContext(AtcContext);
    const { enqueueSnackbar } = useSnackbar();

    const centers = useMemo(() => {
        const centerMap = new Map<string, Booking[]>();
        bookings.filter(b => TYPES_CENTER.includes(b.positionTypeCode)).forEach(b => {
            if (!centerMap.has(b.subcenter!)) centerMap.set(b.subcenter!, []);
            centerMap.get(b.subcenter!)?.push(b);
        });
        return centerMap;
    }, [bookings]);

    const approaches = useMemo(() => {
        const approachMap = new Map<string, Booking[]>();
        bookings.filter(b => TYPES_APPROACH.includes(b.positionTypeCode)).forEach(b => {
            if (!approachMap.has(b.atcPosition!)) approachMap.set(b.atcPosition!, []);
            approachMap.get(b.atcPosition!)?.push(b);
        });
        return approachMap;
    }, [bookings]);

    const aerodromes = useMemo(() => {
        const adMap = new Map<string, Booking[]>();
        bookings.filter(b => TYPES_AERODROME.includes(b.positionTypeCode)).forEach(b => {
            if (!adMap.has(b.atcPosition!)) adMap.set(b.atcPosition!, []);
            adMap.get(b.atcPosition!)?.push(b);
        });
        return adMap;
    }, [bookings]);

    useEffect(() => {
        bookings.filter(b => !TYPES_ALL.includes(b.positionTypeCode)).forEach(b => {
            enqueueSnackbar({variant: 'warning', message: `Found unknown booking type: ${b.positionTypeCode}`, preventDuplicate: true});
        });
    }, [bookings]);

    return <>
        <Pane name="center">
            {Array.from(centers).map(([name, bookings]) => <AtcPositionShape key={name} bookings={bookings} />)}
        </Pane>
        <Pane name="approach">
            {Array.from(approaches).map(([name, bookings]) => <AtcPositionShape key={name} bookings={bookings} />)}
        </Pane>
        <Pane name="aerodrome">
            {Array.from(aerodromes).map(([name, bookings]) => <AtcPositionShape key={name} bookings={bookings} />)}
        </Pane>
    </>;
}

export default BookingLayers;
