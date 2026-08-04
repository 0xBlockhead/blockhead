/**
 * Sourcify Server API v2 — host vs path split (CORS / binding locator vs request paths).
 * @see https://docs.sourcify.dev/docs/api/
 */

export const origin = 'https://sourcify.dev' as const

export const serverPathPrefix = '/server/v2' as const

export const baseUrl = `${origin}${serverPathPrefix}` as const

/** Product contract-lookup fields for verification + compilation + source + proxy facets. */
export const contractLookupFields = [
	'abi',
	'compilation',
	'deployment',
	'metadata',
	'sources',
	'storageLayout',
	'proxyResolution',
] as const
