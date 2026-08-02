import {
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/FxEmbed/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.X_FxEmbed_Rest][0]

export const fxEmbedGet = async <T>(
	path: `/${string}`,
	params?: Record<string, string | number | undefined>,
	acceptedErrorCodes: readonly number[] = []
): Promise<T> => {
	const response = await sourceGetJson<T & {
		code?: number
		message?: string
	}>(
		binding,
		httpUrl(binding, `/2${path}`, params),
		acceptedErrorCodes
	)
	if (
		response.code != null
		&& response.code !== 200
		&& !acceptedErrorCodes.includes(response.code)
	)
		throw new Error(`X_FxEmbed_Rest: ${response.message ?? `request failed with code ${response.code}`}`)
	return response
}
