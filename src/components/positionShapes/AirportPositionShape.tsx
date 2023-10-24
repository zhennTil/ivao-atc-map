import { FC, PropsWithChildren, useMemo } from "react";
import { AtcPositionDto } from "../../modules/auth";
import { Circle, Polygon } from "react-leaflet";
import { LatLngLiteral, LatLngTuple } from "leaflet";

const RADIUS_KM = 25;
const LAT_PER_KM = 0.00904371732;
const lngPerKm = (lat: number) => (1 / (111.320*Math.cos(lat*(Math.PI/180))));
const GND_POLYGON: LatLngTuple[] = [[0, 1],[.19,.19],[1,0],[.19,-.19],[0,-1],[-.19,-.19],[-1,0],[-.19,.19],];
const DEL_POLYGON: LatLngTuple[] = GND_POLYGON.map(point => [point[0]*Math.cos(Math.PI/4) - point[1]*Math.sin(Math.PI/4), point[1]*Math.cos(Math.PI/4) + point[0]*Math.sin(Math.PI/4)]);
const offsetPolygon = (polygon: LatLngTuple[], center: LatLngLiteral): LatLngTuple[] => polygon.map(point => [center.lat + point[0]*RADIUS_KM*LAT_PER_KM, center.lng + point[1]*RADIUS_KM*lngPerKm(center.lat)]);

interface AirportPositionShapeProps {
    position: AtcPositionDto | undefined;
}

const AirportPositionShape: FC<AirportPositionShapeProps> = ({position, children, ...props}: PropsWithChildren<AirportPositionShapeProps>) => {
    
    const Shape = useMemo(() => 
        {
            if (!position) return () => <></>;

            const {position: positionType, airport} = position;
            const center = {lat: airport.latitude, lng: airport.longitude};

            switch (positionType) {
                case "TWR":
                    return () => <Circle {...props} center={center} radius={RADIUS_KM*1000}>{children}</Circle>
                case "DEL":
                    return () => <Polygon {...props} positions={offsetPolygon(DEL_POLYGON, center)}>{children}</Polygon>
                case "GND":
                    return () => <Polygon {...props} positions={offsetPolygon(GND_POLYGON, center)}>{children}</Polygon>
                default:
                    return () => <></>;
            }
        },
        [position?.position, position?.airport, children]);

    return <Shape></Shape>
}

export default AirportPositionShape;
