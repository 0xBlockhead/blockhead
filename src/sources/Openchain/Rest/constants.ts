/**
 * Public REST base for function / event / error signature lookup (no API key).
 * @see https://api.4byte.sourcify.dev/api-docs/swagger.json
 */

export const signatureOrigin = 'https://api.4byte.sourcify.dev' as const

export const signaturePathPrefix = '/signature-database/v1' as const

export const signatureBaseUrl = `${signatureOrigin}${signaturePathPrefix}` as const

/**
 * 4byte.directory REST v1 (fallback when Sourcify returns no rows).
 * @see https://www.4byte.directory/docs/
 */

export const directoryOrigin = 'https://www.4byte.directory' as const

export const directoryPathPrefix = '/api/v1' as const

export const directoryBaseUrl = `${directoryOrigin}${directoryPathPrefix}` as const

export const openchainOrigins = [
	{
		origin: signatureOrigin,
		corsEnabled: false,
	},
	{
		origin: directoryOrigin,
		corsEnabled: false,
	},
] as const
