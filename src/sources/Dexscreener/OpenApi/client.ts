import { fetchFailedMessage } from '$/lib/http.ts'
import { baseUrl } from '$/sources/Dexscreener/OpenApi/constants.ts'

export const getDexscreenerJson = async <_Response>(
	pathAndQuery: string,
): Promise<_Response> => {
	const href = `${baseUrl}${pathAndQuery}`
	const response = await fetch(href, {
		headers: {
			Accept: 'application/json',
		},
	})

	if (!response.ok) throw new Error(await fetchFailedMessage(href, response))

	return response.json<_Response>()
}
