// Partial DTO from https://api.ivao.aero/docs 

import { LatLngLiteral } from "leaflet";

interface CenterDto {
    id: number;
    name: string;
    countryId: string;
    military: boolean;
}

export interface SubcenterDto {
    id: number;
    centerId: string;
    atcCallsign: string;
    middleIdentifier: string | null;
    position: string;
    composePosition: string;
    military: boolean;
    frequency: number;
    latitude: number;
    longitude: number;
    regionMap: LatLngLiteral[];
    center: CenterDto;
}

