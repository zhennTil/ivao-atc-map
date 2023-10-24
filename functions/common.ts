
const KV_TOKEN_KEY = "token";
const TOKEN_REFRESH_THRESHOLD_SECONDS = 30;

export const IVAO_BASE_API_URL = "https://api.ivao.aero";
export const IVAO_ACCESS_TOKEN_URL = "https://api.ivao.aero/v2/oauth/token";
export const RESPONSE_OPTS = {headers: {
    "Cache-Control": "public, max-age=120, s-maxage=120"
}};

export interface Env {
    IVAO: KVNamespace,
    OpenidClientSecret: string,
    OpenidClientId: string,
}

interface TokenInfo {
    token_type: string,
    access_token: string,
    expires_in: number,
}

export const getToken = async (env: Env) => {
    const cached = await env.IVAO.get(KV_TOKEN_KEY, "text");

    if (cached)
        return cached;

    console.log(`Refreshing token from ${IVAO_ACCESS_TOKEN_URL}`);

    // Get token
    const tokenResponse = await fetch(IVAO_ACCESS_TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "application/json",
        },
        body: `grant_type=client_credentials&client_id=${env.OpenidClientId}&client_secret=${env.OpenidClientSecret}`,
    });
    if (!tokenResponse.ok)
        throw new Error("Failed to authenticate with IVAO");

    const tokenInfo = await tokenResponse.json<TokenInfo>();

    // Store in KV
    await env.IVAO.put(KV_TOKEN_KEY, tokenInfo.access_token, {
        expirationTtl: tokenInfo.expires_in - TOKEN_REFRESH_THRESHOLD_SECONDS
    });

    return tokenInfo.access_token;
}

export const fetchFromIvao = (path: string, bearer: string) => {
    return fetch (
        `${IVAO_BASE_API_URL}${path}`, 
        {
            headers: {
                Authorization: `Bearer ${bearer}`
            },
        }
    )
}