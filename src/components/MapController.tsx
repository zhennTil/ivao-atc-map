import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";
import { useLocalStorage } from "react-use";

function MapController() {
    const [mapCenter, setMapCenter] = useLocalStorage<LatLngExpression>('MAP_POSITION', {"lat":55.95,"lng":16.96})
    const [mapZoom, setMapZoom] = useLocalStorage('MAP_ZOOM', 4);

    const map = useMapEvents({
        zoom() {
            setMapZoom(map.getZoom());
        },
        dragend() {
            setMapCenter(map.getCenter());
        }
    });

    useEffect(
        () => {
            map.setView(mapCenter!, mapZoom);
        },
        [map]
    );

    return <></>;
}

export default MapController;
