import {
	corsFetch,
	fetchFailedMessage,
} from '$/lib/http.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	sourceBindingId,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type { SourceOrigin } from '$/sources/SourceProviderDefinition.ts'

const sourceFetchQueueByEndpoint = new Map<string, {
	activeCount: number
	waiters: (() => void)[]
}>()

const sourceFetchConcurrency = 4

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

export const sourceFetch = async (
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
	if (binding.delivery === SourceDelivery.HttpProxy && endpointIndex === -1)
		throw new Error(`${binding.source}: missing HTTP proxy endpoint for ${url}`)

	const queueKey = `${binding.source}:${new URL(url).origin}`
	const queue = sourceFetchQueueByEndpoint.get(queueKey) ?? {
		activeCount: 0,
		waiters: [],
	}
	sourceFetchQueueByEndpoint.set(queueKey, queue)
	if (queue.activeCount >= sourceFetchConcurrency)
		await new Promise<void>((resolve) => queue.waiters.push(resolve))

	queue.activeCount++
	try {
		if (binding.delivery === SourceDelivery.HttpProxy) {
			return await corsFetch(url, {
				delivery: binding.delivery,
				init,
				origins: httpOriginsForBinding(binding),
				proxy: {
					proxyId: sourceBindingId(binding),
					endpointIndex,
				},
			})
		}

		return await corsFetch(url, {
			delivery: binding.delivery,
			init,
			origins: httpOriginsForBinding(binding),
		})
	} finally {
		queue.activeCount--
		queue.waiters.shift()?.()
		if (queue.activeCount === 0 && queue.waiters.length === 0)
			sourceFetchQueueByEndpoint.delete(queueKey)
	}
}

export const sourceGetJson = <_Json>(
	binding: SourceBinding,
	url: string
): Promise<_Json> => sourceFetch(binding, url).then(async (response) => {
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json()
})

export const sourceGetText = (
	binding: SourceBinding,
	url: string
): Promise<string> => sourceFetch(binding, url).then(async (response) => {
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.text()
})
