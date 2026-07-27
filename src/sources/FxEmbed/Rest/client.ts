import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.X_FxEmbed_Rest]

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
		binding,
		new URL(
			`/2${path}${toQuery(params ?? {})}`,
			firstHttpUrlForBinding(binding)
		).toString()
	)
	if (response.code != null && response.code !== 200)
		throw new Error(`X_FxEmbed_Rest: ${response.message ?? `request failed with code ${response.code}`}`)
	return response
}
