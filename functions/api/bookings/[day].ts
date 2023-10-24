import { AtcBookingsPaginatedDto, AtcBookingsDto } from '../../../src/modules/types/atcBookings.dto';
import { Env, fetchFromIvao, getToken } from '../../common';

const BOOKING_RESULTS_PER_PAGE = 50;


const fetchBookings = async (day: string, page: number, bearer: string) => {
    const bookingsResponse = await fetchFromIvao(`/v2/atc/bookings?date=${day}&perPage=${BOOKING_RESULTS_PER_PAGE}&page=${page}`, bearer);
    return await bookingsResponse.json<AtcBookingsPaginatedDto>();
}

export const onRequest: PagesFunction<Env> = async ({env, params}) => {

    const bearer = await getToken(env);
    const day = params.day as string;

    let bookingsJson = await fetchBookings(day, 1, bearer);

    let results: AtcBookingsDto[] = [];
    for (let page = bookingsJson.page; page <= bookingsJson.pages; ++page) {
        console.log(`Fetched page ${page} of ${bookingsJson.pages}, size ${BOOKING_RESULTS_PER_PAGE}`)

        if (page > 1) {
            bookingsJson = await fetchBookings(day, page, bearer);
        }

        results = results.concat(bookingsJson.items.map(b => {const { user, ...rest } = b; return rest;}));
    }

    return Response.json(results, {headers: {
        "Cache-Control": "public, max-age=120, s-maxage=120"
    }});
}
