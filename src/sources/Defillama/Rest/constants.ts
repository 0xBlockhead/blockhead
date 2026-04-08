/**
 * Public current-prices host — `GET /prices/current/{coins}` (comma-separated path segment).
 * Pro uses `https://pro-api.llama.fi/<API_KEY>/coins/prices/current/{coins}` (not this host).
 * @see https://docs.llama.fi/coin-prices-api
 */
export const publicCoinsBaseUrl = 'https://coins.llama.fi'

/**
 * Pro API host: `https://pro-api.llama.fi/<KEY>/…`.
 * @see https://docs.llama.fi/pro-api
 */
export const proApiBaseUrl = 'https://pro-api.llama.fi'
