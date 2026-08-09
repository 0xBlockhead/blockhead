import {
	corsFetch,
	fetchFailedMessage,
} from '$/lib/http.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	sourceBindingId,
	sourceEndpointOrigin,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const sourceFetchQueueByEndpoint = new Map<string, {
	activeCount: number
	waiters: (() => void)[]
}>()

const sourceFetchConcurrency = 4

export const httpOriginsForBinding = (
	binding: SourceBinding
) => (
	[...binding.endpoints].flatMap((endpoint) => {
		if (endpoint.endpointKind !== SourceEndpointKind.HttpUrl)
			return []

		const origin = sourceEndpointOrigin(endpoint)
		return origin == null ? [] : [{
			origin,
			corsEnabled: endpoint.corsEnabled === true,
		}]
	})
)

export const firstHttpUrlForBinding = (
	binding: SourceBinding
) => {
	const endpoint = [...binding.endpoints].find((candidate) => (
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
) => {
	const endpointIndex = [...binding.endpoints].findIndex((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& sourceEndpointOrigin(endpoint) === new URL(url).origin
		&& (
			url.startsWith(endpoint.locator)
			|| (endpoint.locator.includes('{') && url.startsWith(endpoint.locator.slice(0, endpoint.locator.indexOf('{'))))
		)
	))
	if (binding.delivery === SourceDelivery.HttpProxy && endpointIndex === -1)
		throw new Error(`${binding.source}: missing HTTP proxy endpoint for ${url}`)

	const queueKey = `${sourceBindingId(binding)}:${new URL(url).origin}`
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
	url: string,
	acceptedErrorStatuses: readonly number[] = []
) => sourceFetch(binding, url).then(async (response) => {
	if (!response.ok && !acceptedErrorStatuses.includes(response.status))
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<_Json>()
})

export const sourceGetText = (
	binding: SourceBinding,
	url: string
) => sourceFetch(binding, url).then(async (response) => {
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.text()
})
