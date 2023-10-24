import { AtcPositionDto } from '../../../src/modules/types/atcPosition.dto';
import { Env, IVAO_BASE_API_URL, getToken } from '../../common';


const fetchPosition = async (position: string, bearer: string) => {
    const positionResponse = await fetch (
        `${IVAO_BASE_API_URL}/v2/ATCPositions/${position}`, 
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
    const positionName = params.position as string;

    return Response.json(await fetchPosition(positionName, bearer));
}
