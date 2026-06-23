import {
	SourceEndpointKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export type WebSocketLiveEvent = {
	type: string
	source: string
	targetKey: string
	payload?: unknown
}

export const iterateWebSocketLive = async function* ({
	binding,
	operationGroup,
}: {
	binding: SourceBinding
	operationGroup: string
}): AsyncGenerator<WebSocketLiveEvent> {
	const endpoint = binding.endpoints.find((candidate) => (
		candidate.endpointKind === SourceEndpointKind.WebSocketUrl
	))
	if (endpoint == null)
		throw new Error(`${binding.source}: missing WebSocket endpoint for ${operationGroup}`)

	const socket = new WebSocket(endpoint.locator)

	try {
		yield await new Promise<WebSocketLiveEvent>((resolve, reject) => {
			socket.addEventListener('open', () => resolve({
				type: 'connected',
				source: binding.source,
				targetKey: binding.target.key,
			}), { once: true })
			socket.addEventListener('error', reject, { once: true })
		})

		for await (const event of websocketMessages(socket)) {
			yield {
				type: 'message',
				source: binding.source,
				targetKey: binding.target.key,
				payload: event.data,
			}
		}
	} finally {
		socket.close()
	}
}

const websocketMessages = async function* (
	socket: WebSocket
): AsyncGenerator<MessageEvent> {
	const messages: MessageEvent[] = []
	let wake: (() => void) | undefined

	socket.addEventListener('message', (event) => {
		messages.push(event)
		wake?.()
	})

	while (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
		if (messages.length > 0) {
			const message = messages.shift()
			if (message != null)
				yield message
			continue
		}

		await new Promise<void>((resolve) => {
			wake = resolve
		})
		wake = undefined
	}
}
