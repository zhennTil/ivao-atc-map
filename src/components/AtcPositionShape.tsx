import { Polygon, Popup } from "react-leaflet";
import { useMemo } from "react";
import { LatLngLiteral } from "leaflet";
import AirportPositionShape from "./positionShapes/AirportPositionShape";
import { PATH_STYLE } from "../config/constants";
import { Booking } from "../modules/contexts/AtcProvider";
import { formatDateTime } from "../modules/utils/utils";

interface AtcPositionPolygonProps {
    bookings: Booking[];
}

const AtcPositionShape = ({bookings}: AtcPositionPolygonProps) => {
    const firstBooking = useMemo(() => bookings.length > 0 ? bookings[0] : undefined, [bookings]);
    const position = useMemo(() => firstBooking?.aerodromePosition ?? undefined, [firstBooking]);
    const subcenter = useMemo(() => firstBooking?.centerPosition ?? undefined, [firstBooking]);

    const polyPositions: LatLngLiteral[] = useMemo(() => position?.regionMap ?? subcenter?.regionMap ?? [], [position, subcenter])
    const Shape = useMemo(() => polyPositions.length > 0
        ? Polygon 
        : AirportPositionShape, [polyPositions])

    return <Shape positions={polyPositions} position={position} pathOptions={PATH_STYLE}>
            <Popup pane="popupPane">
                {bookings[0].atcPosition ?? bookings[0].subcenter} ({position?.atcCallsign ?? subcenter?.atcCallsign})
                {bookings.sort((a,b) => a.startDate > b.startDate ? 1 : -1).map(booking => {
                    const date = new Date(booking.startDate)
                    const endDate = new Date(booking.endDate)
                    return <ul key={booking.id}>
                        <li>{formatDateTime(date)} -&gt; {formatDateTime(endDate)}</li>
                    </ul>
                })}
            </Popup>
        </Shape>
}

export default AtcPositionShape;
