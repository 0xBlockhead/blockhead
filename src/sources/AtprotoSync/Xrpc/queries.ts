import { fetchFailedMessage } from '$/lib/http.ts'
import {
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { sourceLive } from '$/sources/_runtime/live.remote.ts'
import { decodeAtprotoSyncFrame } from '$/sources/AtprotoSync/Xrpc/framing.ts'
import type { AtprotoSyncSubscribeReposMessage } from '$/sources/AtprotoSync/Xrpc/types.ts'


const validatedServiceOrigin = (serviceOrigin: string) => {
	const url = new URL(serviceOrigin)
	const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
	const ipv4 = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)?.slice(1).map(Number)

	if (
		url.protocol !== 'https:'
		|| url.origin !== serviceOrigin
		|| url.username !== ''
		|| url.password !== ''
		|| hostname === 'metadata.google.internal'
		|| hostname === 'metadata.aws.internal'
		|| hostname === '::'
		|| hostname === '::1'
		|| hostname.startsWith('fc')
		|| hostname.startsWith('fd')
		|| /^fe[89ab]/.test(hostname)
		|| hostname.startsWith('ff')
		|| hostname.startsWith('::ffff:')
		|| (
			ipv4 != null
			&& (
				ipv4[0] === 0
				|| ipv4[0] === 10
				|| ipv4[0] === 127
				|| ipv4[0] >= 224
				|| (ipv4[0] === 100 && ipv4[1] >= 64 && ipv4[1] <= 127)
				|| (ipv4[0] === 169 && ipv4[1] === 254)
				|| (ipv4[0] === 172 && ipv4[1] >= 16 && ipv4[1] <= 31)
				|| (ipv4[0] === 192 && ipv4[1] === 168)
				|| (ipv4[0] === 198 && (ipv4[1] === 18 || ipv4[1] === 19))
			)
		)
	)
		throw new Error('AtprotoSync_Xrpc: invalid public HTTPS service origin')

	return url.origin
}


export const getRepo = async ({
	binding,
	serviceOrigin,
	did,
	since,
	signal,
}: {
	binding: SourceBinding
	serviceOrigin: string
	did: string
	since?: string
	signal?: AbortSignal
}) => {
	if (binding.delivery !== SourceDelivery.RemoteQuery)
		throw new Error('AtprotoSync_Xrpc: getRepo requires the RemoteQuery HTTP binding')

	if (typeof window !== 'undefined')
		throw new Error('AtprotoSync_Xrpc: getRepo RemoteQuery must run through a SvelteKit query')

	const validatedOrigin = validatedServiceOrigin(serviceOrigin)
	const resolvedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
				{
					...endpoint,
					locator: validatedOrigin,
				}
			:
				endpoint
		)),
	}
	if (!resolvedBinding.endpoints.some((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
	)))
		throw new Error('AtprotoSync_Xrpc: getRepo requires an HttpUrl RemoteQuery endpoint')

	const url = new URL('/xrpc/com.atproto.sync.getRepo', validatedOrigin)
	url.searchParams.set('did', did)
	if (since != null)
		url.searchParams.set('since', since)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	return new Uint8Array(await response.arrayBuffer())
}


export const subscribeRepos = async function* ({
	binding,
	serviceOrigin,
	cursor,
	signal,
}: {
	binding: SourceBinding
	serviceOrigin: string
	cursor?: number
	signal?: AbortSignal
}): AsyncGenerator<AtprotoSyncSubscribeReposMessage> {
	if (signal?.aborted)
		return

	if (
		binding.delivery !== SourceDelivery.RemoteLive
		|| !binding.operationGroups.includes(SourceOperationGroup.GenericSubscribe)
		|| !binding.endpoints.some((endpoint) => (
			endpoint.endpointKind === SourceEndpointKind.WebSocketUrl
		))
	)
		throw new Error('AtprotoSync_Xrpc: subscribeRepos requires the RemoteLive WebSocket binding')
	if (
		cursor != null
		&& (!Number.isSafeInteger(cursor) || cursor < 0)
	)
		throw new Error('AtprotoSync_Xrpc: subscribeRepos cursor must be a non-negative safe integer')

	const frames = sourceLive({
		source: binding.source,
		targetKey: binding.target.key,
		operationGroup: SourceOperationGroup.GenericSubscribe,
		serviceOrigin: validatedServiceOrigin(serviceOrigin),
		...(cursor != null && {
			cursor,
		}),
	})[Symbol.asyncIterator]()
	const abort = () => {
		void frames.return?.()
	}
	signal?.addEventListener('abort', abort, { once: true })

	try {
		for (
			let result = await frames.next();
			!result.done;
			result = await frames.next()
		) {
			if (signal?.aborted)
				return
			if (result.value.type === 'connected')
				continue
			if (!(result.value.payload instanceof Uint8Array))
				throw new Error('AtprotoSync_Xrpc: subscribeRepos received a non-binary WebSocket frame')

			const message = decodeAtprotoSyncFrame(result.value.payload)
			if (message != null)
				yield message
		}
	} finally {
		signal?.removeEventListener('abort', abort)
		await frames.return?.()
	}
}
