import bindings from '$/sources/AtprotoSync/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { fetchFailedMessage } from '$/lib/http.ts'
import {
	sourceBindingId,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { sourceLive } from '$/sources/_runtime/live.remote.ts'
import {
	parseGetHostStatusResponse,
	parseGetLatestCommitResponse,
	parseGetRepoStatusResponse,
	parseListHostsResponse,
	parseListReposResponse,
} from '$/sources/AtprotoSync/Xrpc/commit.ts'
import { decodeAtprotoSyncFrame } from '$/sources/AtprotoSync/Xrpc/framing.ts'
import type { AtprotoSyncSubscribeReposMessage } from '$/sources/AtprotoSync/Xrpc/types.ts'


const remoteQueryBinding = bindings[Source.AtprotoSync_Xrpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteQuery
))

if (remoteQueryBinding == null)
	throw new Error('AtprotoSync_Xrpc: RemoteQuery binding is missing')

const remoteLiveBinding = bindings[Source.AtprotoSync_Xrpc].find((binding) => (
	binding.delivery === SourceDelivery.RemoteLive
))

if (remoteLiveBinding == null)
	throw new Error('AtprotoSync_Xrpc: RemoteLive binding is missing')


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


const resolvedRemoteQueryBinding = ({
	binding,
	serviceOrigin,
}: {
	binding: SourceBinding
	serviceOrigin: string
}) => {
	if (binding.delivery !== SourceDelivery.RemoteQuery)
		throw new Error('AtprotoSync_Xrpc: HTTP sync reads require the RemoteQuery binding')

	if (typeof window !== 'undefined')
		throw new Error('AtprotoSync_Xrpc: RemoteQuery must run through a SvelteKit query')

	const validatedOrigin = validatedServiceOrigin(serviceOrigin)
	const resolvedBinding = binding.endpoints.some((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
		&& endpoint.locator !== validatedOrigin
	)) ?
		{
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
	:
		binding
	if (!resolvedBinding.endpoints.some((endpoint) => (
		endpoint.endpointKind === SourceEndpointKind.HttpUrl
	)))
		throw new Error('AtprotoSync_Xrpc: RemoteQuery binding requires an HttpUrl endpoint')

	return {
		validatedOrigin,
		resolvedBinding,
	}
}


export const getRepo = async ({
	serviceOrigin,
	did,
	since,
	signal,
}: {
	serviceOrigin: string
	did: string
	since?: string
	signal?: AbortSignal
}) => {
	const {
		validatedOrigin,
		resolvedBinding,
	} = resolvedRemoteQueryBinding({
		binding: remoteQueryBinding,
		serviceOrigin,
	})

	const url = new URL('/xrpc/com.atproto.sync.getRepo', validatedOrigin)
	url.searchParams.set('did', did)
	if (since != null)
		url.searchParams.set('since', since)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	return new Uint8Array(await response.arrayBuffer())
}


export const getLatestCommit = async ({
	serviceOrigin,
	did,
	signal,
}: {
	serviceOrigin: string
	did: string
	signal?: AbortSignal
}) => {
	const {
		validatedOrigin,
		resolvedBinding,
	} = resolvedRemoteQueryBinding({
		binding: remoteQueryBinding,
		serviceOrigin,
	})

	const url = new URL('/xrpc/com.atproto.sync.getLatestCommit', validatedOrigin)
	url.searchParams.set('did', did)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	return parseGetLatestCommitResponse(await response.json())
}


export const getRepoStatus = async ({
	serviceOrigin,
	did,
	signal,
}: {
	serviceOrigin: string
	did: string
	signal?: AbortSignal
}) => {
	const {
		validatedOrigin,
		resolvedBinding,
	} = resolvedRemoteQueryBinding({
		binding: remoteQueryBinding,
		serviceOrigin,
	})

	const url = new URL('/xrpc/com.atproto.sync.getRepoStatus', validatedOrigin)
	url.searchParams.set('did', did)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	return parseGetRepoStatusResponse(await response.json())
}


export const listRepos = async ({
	serviceOrigin,
	limit,
	cursor,
	signal,
}: {
	serviceOrigin: string
	limit?: number
	cursor?: string
	signal?: AbortSignal
}) => {
	const {
		validatedOrigin,
		resolvedBinding,
	} = resolvedRemoteQueryBinding({
		binding: remoteQueryBinding,
		serviceOrigin,
	})

	if (
		limit != null
		&& (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000)
	)
		throw new Error('AtprotoSync_Xrpc: listRepos limit must be an integer from 1 to 1000')

	const url = new URL('/xrpc/com.atproto.sync.listRepos', validatedOrigin)
	if (limit != null)
		url.searchParams.set('limit', String(limit))
	if (cursor != null && cursor !== '')
		url.searchParams.set('cursor', cursor)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	return parseListReposResponse(await response.json())
}


export const listHosts = async ({
	serviceOrigin,
	limit,
	cursor,
	signal,
}: {
	serviceOrigin: string
	limit?: number
	cursor?: string
	signal?: AbortSignal
}) => {
	const {
		validatedOrigin,
		resolvedBinding,
	} = resolvedRemoteQueryBinding({
		binding: remoteQueryBinding,
		serviceOrigin,
	})

	if (
		limit != null
		&& (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000)
	)
		throw new Error('AtprotoSync_Xrpc: listHosts limit must be an integer from 1 to 1000')

	const url = new URL('/xrpc/com.atproto.sync.listHosts', validatedOrigin)
	if (limit != null)
		url.searchParams.set('limit', String(limit))
	if (cursor != null && cursor !== '')
		url.searchParams.set('cursor', cursor)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	return parseListHostsResponse(await response.json())
}


export const getHostStatus = async ({
	serviceOrigin,
	hostname,
	signal,
}: {
	serviceOrigin: string
	hostname: string
	signal?: AbortSignal
}) => {
	const {
		validatedOrigin,
		resolvedBinding,
	} = resolvedRemoteQueryBinding({
		binding: remoteQueryBinding,
		serviceOrigin,
	})

	if (hostname.trim() === '')
		throw new Error('AtprotoSync_Xrpc: getHostStatus hostname must not be empty')

	const url = new URL('/xrpc/com.atproto.sync.getHostStatus', validatedOrigin)
	url.searchParams.set('hostname', hostname)

	const response = await sourceFetch(resolvedBinding, url.toString(), { signal })
	if (!response.ok)
		throw new Error(`AtprotoSync_Xrpc: ${await fetchFailedMessage(url.toString(), response)}`)

	const status = parseGetHostStatusResponse(await response.json())
	if (status.hostname !== hostname)
		throw new Error('AtprotoSync_Xrpc: getHostStatus response does not match request')

	return status
}


export const subscribeRepos = async function* ({
	serviceOrigin,
	cursor,
	signal,
}: {
	serviceOrigin: string
	cursor?: number
	signal?: AbortSignal
}): AsyncGenerator<AtprotoSyncSubscribeReposMessage> {
	if (signal?.aborted)
		return

	if (
		cursor != null
		&& (!Number.isSafeInteger(cursor) || cursor < 0)
	)
		throw new Error('AtprotoSync_Xrpc: subscribeRepos cursor must be a non-negative safe integer')

	const frames = sourceLive({
		bindingId: sourceBindingId(remoteLiveBinding),
		source: remoteLiveBinding.source,
		targetKey: remoteLiveBinding.target.key,
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
