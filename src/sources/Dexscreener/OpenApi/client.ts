import { corsFetch, fetchFailedMessage } from '$/lib/http.ts'
import {
	baseUrl,
	dexscreenerOrigins,
} from '$/sources/Dexscreener/OpenApi/constants.ts'

export const getDexscreenerJson = async <_Response>(
	pathAndQuery: string
): Promise<_Response> => {
	const href = `${baseUrl}${pathAndQuery}`
	const response = await corsFetch(href, {
		origins: dexscreenerOrigins,
		init: {
			headers: {
				Accept: 'application/json',
			},
		},
	})

	if (!response.ok) throw new Error(await fetchFailedMessage(href, response))

	return response.json<_Response>()
}
