/**
 * Production LI.FI API host (OpenAPI servers).
 * @see https://docs.li.fi/openapi.yaml
 */
export const lifiApiBaseUrl = 'https://li.quest' as const

/**
 * Staging host — pass as `baseUrl` to {@link fetchLifiChains} / {@link fetchLifiTokens}.
 * @see https://docs.li.fi/openapi.yaml
 */
export const lifiApiStagingBaseUrl = 'https://staging.li.quest' as const
