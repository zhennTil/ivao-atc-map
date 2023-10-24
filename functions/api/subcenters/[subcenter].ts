import { AtcPositionDto } from '../../../src/modules/types/atcPosition.dto';
import { Env, LONG_CACHE_RESPONSE_OPTS, fetchFromIvao, getToken } from '../../common';


const fetchPosition = async (subcenter: string, bearer: string) => {
    const positionResponse = await fetchFromIvao(`/v2/subcenters/${subcenter}`, bearer);
    return await positionResponse.json<AtcPositionDto>();
}

export const onRequest: PagesFunction<Env> = async ({env, params}) => {

    const bearer = await getToken(env);
    const subcenterName = params.subcenter as string;

    return Response.json(await fetchPosition(subcenterName, bearer), LONG_CACHE_RESPONSE_OPTS);
}
