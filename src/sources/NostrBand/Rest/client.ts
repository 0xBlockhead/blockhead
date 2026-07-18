import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { nostrBandApiBaseUrl } from '$/sources/NostrBand/Rest/constants.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const nostrBandBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find(({ source }) => source === Source.NostrBand_Rest)
if (nostrBandBinding == null)
	throw new Error('NostrBand_Rest: source binding is missing')

const toQuery = (params: Record<string, string | number | undefined>) => {
	const searchParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}
	const query = searchParams.toString()
	return query ? `?${query}` : ''
}

export const nostrBandGet = async <T>(
	path: string,
	params?: Record<string, string | number | undefined>
): Promise<T> => (
	sourceGetJson<T>(
		nostrBandBinding,
		`${nostrBandApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}${toQuery(params ?? {})}`
	)
)
