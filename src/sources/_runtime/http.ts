import {
	corsFetch,
	fetchFailedMessage,
} from '$/lib/http.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const httpOriginsForBinding = (
	binding: SourceBinding
): readonly SourceOrigin[] => (
	binding.endpoints.flatMap((endpoint) => (
		endpoint.endpointKind !== SourceEndpointKind.HttpUrl || endpoint.origin == null ?
			[]
		:
			[{
				origin: endpoint.origin,
				corsEnabled: endpoint.corsEnabled === true,
			}]
	))
)

export const firstHttpUrlForBinding = (
	binding: SourceBinding
): string => {
	const endpoint = binding.endpoints.find((candidate) => (
		candidate.endpointKind === SourceEndpointKind.HttpUrl
	))
	if (endpoint == null)
		throw new Error(`${binding.source}: missing HTTP endpoint`)

	return endpoint.locator
}

export const sourceFetch = (
	binding: SourceBinding,
	url: string,
	init?: RequestInit
): Promise<Response> => {
	const endpointIndex = binding.endpoints.findIndex((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& endpoint.origin === new URL(url).origin
		&& (
			url.startsWith(endpoint.locator)
			|| (endpoint.locator.includes('{') && url.startsWith(endpoint.locator.slice(0, endpoint.locator.indexOf('{'))))
		)
	))
	if (binding.delivery === SourceDelivery.HttpProxy && (binding.proxyId == null || endpointIndex === -1))
		throw new Error(`${binding.source}: missing HTTP proxy identity or endpoint for ${url}`)

	return corsFetch(url, {
		delivery: binding.delivery,
		init,
		origins: httpOriginsForBinding(binding),
		...(binding.delivery === SourceDelivery.HttpProxy && {
			proxy: {
				proxyId: binding.proxyId,
				endpointIndex,
			},
		}),
	})
}

export const sourceGetJson = <_Json>(
	binding: SourceBinding,
	url: string
): Promise<_Json> => sourceFetch(binding, url).then(async (response) => {
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<_Json>()
})

export const sourceGetText = (
	binding: SourceBinding,
	url: string
): Promise<string> => sourceFetch(binding, url).then(async (response) => {
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.text()
})
