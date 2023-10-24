import { AtcPositionDto } from '../../../src/modules/types/atcPosition.dto';
import { Env, IVAO_BASE_API_URL, getToken } from '../../common';


const fetchPosition = async (subcenter: string, bearer: string) => {
    const positionResponse = await fetch (
        `${IVAO_BASE_API_URL}/v2/subcenters/${subcenter}`, 
        {
            headers: {
                Authorization: `Bearer ${bearer}`
            },
        }
    );
    return await positionResponse.json<AtcPositionDto>();
}

export const onRequest: PagesFunction<Env> = async ({env, params}) => {

    const bearer = await getToken(env);
    const subcenterName = params.subcenter as string;

    return Response.json(await fetchPosition(subcenterName, bearer));
}
