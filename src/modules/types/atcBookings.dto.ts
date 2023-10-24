// Partial DTO from https://api.ivao.aero/docs 

interface AtcBookingUserDto {
    id: number;
    divisionId: string;
    firstName: string;
    lastName: string;
}

interface AtcBookingsPositionDto {
    id: number;
    airportId: string;
    atcCallsign: string;
    military: boolean;
    frequency: number;
    composePosition: string;
}

export interface AtcBookingsDto {
    id: number;
    atcPosition: string | null;
    atcPositionRef: AtcBookingsPositionDto;
    subcenter: string | null;
    startDate: string;
    endDate: string;
    voice: boolean;
    training: "training" | "exam" | null;
    createdAt: string;
}

export interface RawAtcBookingsDto {
    id: number;
    user: AtcBookingUserDto;
    atcPosition: string | null;
    atcPositionRef: AtcBookingsPositionDto;
    subcenter: string | null;
    startDate: string;
    endDate: string;
    voice: boolean;
    training: "training" | "exam" | null;
    createdAt: string;
}

export interface AtcBookingsPaginatedDto {
    items: RawAtcBookingsDto[];
    perPage: number;
    page: number;
    pages: number;
}
