import {
	SourceEndpointKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export type WebSocketLiveEvent = {
	type: 'connected' | 'message'
	source: string
	targetKey: string
	payload?: unknown
}

const maximumBufferedMessageCount = 1_024

export const iterateWebSocketLive = async function* ({
	binding,
	initialMessage,
	operationGroup,
	signal,
}: {
	binding: SourceBinding
	initialMessage?: string
	operationGroup: string
	signal?: AbortSignal
}): AsyncGenerator<WebSocketLiveEvent> {
	if (signal?.aborted)
		return

	const endpoint = binding.endpoints.find((candidate) => (
		candidate.endpointKind === SourceEndpointKind.WebSocketUrl
	))
	if (endpoint == null)
		throw new Error(`${binding.source}: missing WebSocket endpoint for ${operationGroup}`)

	const socket = new WebSocket(endpoint.locator)

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
							payload: nextMessage.data,
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
