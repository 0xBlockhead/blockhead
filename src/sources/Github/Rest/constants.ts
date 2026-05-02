/** JSON REST (`api.github.com`). */
export const restOrigin = 'https://api.github.com'

/** Raw blob /usercontent hosts. */
export const rawOrigin = 'https://raw.githubusercontent.com'

export const restApiVersion = '2022-11-28'

export const restHeaders = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': restApiVersion,
} as const
