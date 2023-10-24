import { AtcPositionDto } from '../../../src/modules/types/atcPosition.dto';
import { Env, RESPONSE_OPTS, fetchFromIvao, getToken } from '../../common';


const fetchPosition = async (position: string, bearer: string) => {
    const positionResponse = await fetchFromIvao(`/v2/ATCPositions/${position}`, bearer);
    return await positionResponse.json<AtcPositionDto>();
}

export const onRequest: PagesFunction<Env> = async ({env, params}) => {

    const bearer = await getToken(env);
    const positionName = params.position as string;

    return Response.json(await fetchPosition(positionName, bearer), RESPONSE_OPTS);
}
