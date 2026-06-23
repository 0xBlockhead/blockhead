import type { NostrRelayMessage } from '$/sources/NostrRelay/WebSocket/types.ts'

export const relayWebSocketUrl = (relayUrl: string) => {
	const url = new URL(relayUrl)
	if (url.protocol === 'https:')
		url.protocol = 'wss:'
	else if (url.protocol === 'http:')
		url.protocol = 'ws:'

	return url.toString()
}

export const openRelaySocket = (relayUrl: string) => new WebSocket(relayWebSocketUrl(relayUrl))

export const sendRelayMessage = (
	socket: WebSocket,
	message: NostrRelayMessage
) => {
	socket.send(JSON.stringify(message))
}
