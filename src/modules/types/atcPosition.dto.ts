// Partial DTO from https://api.ivao.aero/docs 

import { LatLngLiteral } from "leaflet";

export interface AtcPositionAirportDto {
    icao: string;
    iata: string;
    name: string;
    city: string;
    countryId: string;
    latitude: number;
    longitude: number;
    military: boolean;
    centerId: string|null;
}

export interface AtcPositionDto {
    id: number;
    airportIcao: string;
    atcCallsign: string;
    middleIdentifier: string | null;
    position: string;
    composePosition: string;
    military: boolean;
    frequency: number;
    regionMap: LatLngLiteral[];
    airport: AtcPositionAirportDto;
}

