import {
	SourceEndpointKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	BlockList,
	isIP,
} from 'node:net'

export type WebSocketLiveEvent = {
	type: 'connected' | 'message'
	source: string
	targetKey: string
	payload?: string | Uint8Array
}

const maximumBufferedMessageCount = 1_024
const forbiddenServiceAddresses = new BlockList()
for (const [address, prefix, type] of [
	['0.0.0.0', 8, 'ipv4'],
	['10.0.0.0', 8, 'ipv4'],
	['100.64.0.0', 10, 'ipv4'],
	['127.0.0.0', 8, 'ipv4'],
	['169.254.0.0', 16, 'ipv4'],
	['172.16.0.0', 12, 'ipv4'],
	['192.0.0.0', 24, 'ipv4'],
	['192.168.0.0', 16, 'ipv4'],
	['198.18.0.0', 15, 'ipv4'],
	['224.0.0.0', 4, 'ipv4'],
	['240.0.0.0', 4, 'ipv4'],
	['::', 128, 'ipv6'],
	['::1', 128, 'ipv6'],
	['::ffff:0:0', 96, 'ipv6'],
	['fc00::', 7, 'ipv6'],
	['fe80::', 10, 'ipv6'],
	['ff00::', 8, 'ipv6'],
] as const)
	forbiddenServiceAddresses.addSubnet(address, prefix, type)

const metadataHosts = new Set([
	'metadata.google.internal',
	'metadata.aws.internal',
])

const validatedServiceOrigin = (
	serviceOrigin: string,
	source: string
) => {
	const url = new URL(serviceOrigin)
	const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
	const addressType = isIP(hostname)

	if (
		url.protocol !== 'https:'
		|| url.origin !== serviceOrigin
		|| url.username !== ''
		|| url.password !== ''
		|| metadataHosts.has(hostname)
		|| (
			addressType !== 0
			&& forbiddenServiceAddresses.check(
				hostname,
				addressType === 4 ? 'ipv4' : 'ipv6'
			)
		)
	)
		throw new Error(`${source}: invalid public HTTPS service origin`)

	return url.origin
}

export const iterateWebSocketLive = async function* ({
	binding,
	cursor,
	initialMessage,
	operationGroup,
	serviceOrigin,
	signal,
}: {
	binding: SourceBinding
	cursor?: number
	initialMessage?: string
	operationGroup: string
	serviceOrigin?: string
	signal?: AbortSignal
}): AsyncGenerator<WebSocketLiveEvent> {
	if (signal?.aborted)
		return

	const endpoint = [...binding.endpoints].find((candidate) => (
		candidate.endpointKind === SourceEndpointKind.WebSocketUrl
	))
	if (endpoint == null)
		throw new Error(`${binding.source}: missing WebSocket endpoint for ${operationGroup}`)

	const hasServiceHostTemplate = endpoint.locator.includes('{pds-host}')
	if (!hasServiceHostTemplate && (serviceOrigin != null || cursor != null))
		throw new Error(`${binding.source}: fixed WebSocket endpoint rejects service overrides`)
	if (hasServiceHostTemplate && serviceOrigin == null)
		throw new Error(`${binding.source}: templated WebSocket endpoint requires a service origin`)

	const locator = new URL(
		hasServiceHostTemplate && serviceOrigin != null ?
			endpoint.locator.replace(
				'{pds-host}',
				new URL(validatedServiceOrigin(serviceOrigin, binding.source)).host
			)
		:
			endpoint.locator
	)
	if (cursor != null)
		locator.searchParams.set('cursor', String(cursor))

	const socket = new WebSocket(locator.toString())
	socket.binaryType = 'arraybuffer'

	try {
		const connected = await new Promise<WebSocketLiveEvent | undefined>((resolve, reject) => {
			const cleanup = () => {
				socket.removeEventListener('open', open)
				socket.removeEventListener('close', close)
				socket.removeEventListener('error', error)
				signal?.removeEventListener('abort', abort)
			}
			const open = () => {
				cleanup()
				resolve({
					type: 'connected',
					source: binding.source,
					targetKey: binding.target.key,
				})
			}
			const error = (event: Event) => {
				cleanup()
				reject(event)
			}
			const close = (event: CloseEvent) => {
				cleanup()
				reject(new Error(
					`${binding.source}: WebSocket closed before opening for ${operationGroup} (${event.code}${event.reason === '' ? '' : `: ${event.reason}`})`
				))
			}
			const abort = () => {
				cleanup()
				resolve(undefined)
			}
			socket.addEventListener('open', open, { once: true })
			socket.addEventListener('close', close, { once: true })
			socket.addEventListener('error', error, { once: true })
			signal?.addEventListener('abort', abort, { once: true })
		})
		if (connected == null)
			return

		const messages: MessageEvent[] = []
		let wake: (() => void) | undefined
		let failure: Error | Event | undefined

		const message = (event: MessageEvent) => {
			if (failure != null)
				return

			if (messages.length === maximumBufferedMessageCount) {
				failure = new Error(
					`${socket.url}: WebSocket message buffer exceeded ${maximumBufferedMessageCount} messages`
				)
				socket.close(1009, 'Message buffer exceeded')
				wake?.()
				return
			}

			messages.push(event)
			wake?.()
		}
		const close = (event: CloseEvent) => {
			if (!signal?.aborted && failure == null)
				failure = new Error(
					`${socket.url}: WebSocket closed by peer (${event.code}${event.reason === '' ? '' : `: ${event.reason}`})`
				)

			wake?.()
		}
		const fail = (event: Event) => {
			failure = event
			wake?.()
		}
		const abort = () => {
			wake?.()
		}

		socket.addEventListener('message', message)
		socket.addEventListener('close', close)
		socket.addEventListener('error', fail)
		signal?.addEventListener('abort', abort, { once: true })

		try {
			if (initialMessage != null)
				socket.send(initialMessage)

			yield connected

			for (;;) {
				if (signal?.aborted)
					return
				if (messages.length > 0) {
					const nextMessage = messages.shift()
					if (nextMessage != null)
						yield {
							type: 'message',
							source: binding.source,
							targetKey: binding.target.key,
							payload: nextMessage.data instanceof ArrayBuffer ?
								new Uint8Array(nextMessage.data)
							:
								nextMessage.data,
						}
					continue
				}
				if (failure != null)
					throw failure
				await new Promise<void>((resolve) => {
					wake = resolve
				})
				wake = undefined
			}
		} finally {
			socket.removeEventListener('message', message)
			socket.removeEventListener('close', close)
			socket.removeEventListener('error', fail)
			signal?.removeEventListener('abort', abort)
		}
	} finally {
		socket.close()
	}
}
