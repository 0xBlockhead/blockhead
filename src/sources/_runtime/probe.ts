import { sourceBindingsBySource } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceEndpointKind } from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'


export const probeSourceHttpEndpoint = async (source: Source) => {
	const binding = sourceBindingsBySource[source]?.find(({ endpoints }) => (
		endpoints.some(({ endpointKind, locator }) => (
			endpointKind === SourceEndpointKind.HttpUrl
			&& !locator.includes('{')
		))
	))
	const endpoint = binding?.endpoints.find(({ endpointKind, locator }) => (
		endpointKind === SourceEndpointKind.HttpUrl
		&& !locator.includes('{')
	))
	if (binding == null || endpoint == null)
		return undefined

	const response = await sourceFetch(binding, endpoint.locator, {
		method: 'HEAD',
		signal: AbortSignal.timeout(10_000),
	})
	const rateLimitRemaining = Number(response.headers.get('ratelimit-remaining') ?? response.headers.get('x-ratelimit-remaining'))
	const rateLimitReset = Number(response.headers.get('ratelimit-reset') ?? response.headers.get('x-ratelimit-reset'))
	return {
		ok: response.ok,
		statusCode: response.status,
		...(Number.isFinite(rateLimitRemaining) && { rateLimitRemaining }),
		...(Number.isFinite(rateLimitReset) && {
			rateLimitResetMs: rateLimitReset > 10_000_000_000 ? rateLimitReset : rateLimitReset * 1_000,
		}),
	}
}
