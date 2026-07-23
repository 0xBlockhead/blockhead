import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	fxEmbedApiV2Base,
} from '$/sources/FxEmbed/Rest/constants.ts'

const fxEmbedRestBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.X_FxEmbed_Rest)

if (fxEmbedRestBinding == null)
	throw new Error('X_FxEmbed_Rest: missing source binding')

const toQuery = (params: Record<string, string | number | undefined>) => {
	const searchParams = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		searchParams.set(key, String(value))
	}
	const query = searchParams.toString()
	return query ? `?${query}` : ''
}

export const fxEmbedGet = async <T>(
	path: `/${string}`,
	params?: Record<string, string | number | undefined>
): Promise<T> => {
	const response = await sourceGetJson<T & {
		code?: number
		message?: string
	}>(
		fxEmbedRestBinding,
		`${fxEmbedApiV2Base}${path}${toQuery(params ?? {})}`
	)
	if (response.code != null && response.code !== 200)
		throw new Error(`X_FxEmbed_Rest: ${response.message ?? `request failed with code ${response.code}`}`)
	return response
}
