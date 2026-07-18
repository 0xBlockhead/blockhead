import type {
	NostrRelayEvent,
	NostrRelayFilter,
	NostrRelayMessage,
	NostrRelaySocket,
	NostrRelaySubscriptionEvent,
} from '$/sources/NostrRelay/WebSocket/types.ts'
import {
	isJsonArray,
	isJsonNumber,
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const relayWebSocketUrl = (relayUrl: string) => {
	if (relayUrl.length === 0 || relayUrl.length > 2_048)
		throw new Error('Nostr relay URL length is invalid')
	if (/[\u0000-\u001f\u007f]/.test(relayUrl))
		throw new Error('Nostr relay URL contains control characters')
	if (
		/^[a-z][a-z0-9+.-]*:\/\/[^/?#]*(?:\/[^?#]*)?/i
			.exec(relayUrl)?.[0]
			.match(/%(?:0[0-9a-f]|1[0-9a-f]|2e|2f|5c|7f)/i)
	)
		throw new Error('Nostr relay URL contains encoded path traversal')

	const url = new URL(relayUrl)
	if (!['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol))
		throw new Error('Nostr relay URL must use ws, wss, http, or https')
	if (url.username !== '' || url.password !== '')
		throw new Error('Nostr relay URL must not contain credentials')
	if (url.hash !== '')
		throw new Error('Nostr relay URL must not contain a fragment')
	if (url.hostname.length === 0 || url.hostname.length > 253)
		throw new Error('Nostr relay URL host length is invalid')

	if (url.protocol === 'https:')
		url.protocol = 'wss:'
	else if (url.protocol === 'http:')
		url.protocol = 'ws:'

	return url.toString()
}

export const openRelaySocket = (relayUrl: string) => new WebSocket(relayWebSocketUrl(relayUrl))

export const sendRelayMessage = (
	socket: NostrRelaySocket,
	message: NostrRelayMessage
) => {
	socket.send(JSON.stringify(message))
}

export const openRelaySubscription = ({
	relayUrl,
	subscriptionId,
	filters,
	signal,
	onEvent,
	socketFactory = openRelaySocket,
	initialReconnectDelayMs = 250,
	maxReconnectDelayMs = 10_000,
	maxSeenEventIds = 100_000,
}: {
	relayUrl: string
	subscriptionId: string
	filters: readonly NostrRelayFilter[]
	signal?: AbortSignal
	onEvent: (event: NostrRelaySubscriptionEvent) => void
	socketFactory?: (relayUrl: string) => NostrRelaySocket
	initialReconnectDelayMs?: number
	maxReconnectDelayMs?: number
	maxSeenEventIds?: number
}) => {
	if (subscriptionId === '')
		throw new Error('Nostr relay subscription id must not be empty')
	if (filters.length === 0)
		throw new Error('Nostr relay subscription requires at least one filter')
	if (
		initialReconnectDelayMs < 0
		|| maxReconnectDelayMs < initialReconnectDelayMs
		|| maxSeenEventIds < 1
	) throw new Error('Nostr relay subscription limits are invalid')

	const normalizedRelayUrl = relayWebSocketUrl(relayUrl)
	let activeSocket: NostrRelaySocket | undefined
	let reconnectTimeout: ReturnType<typeof setTimeout> | undefined
	let reconnectDelayMs = initialReconnectDelayMs
	let highestCreatedAt: number | undefined
	let stopped = false
	const seenEventIds = new Set<string>()

	const requestFilters = () => filters.map((filter) => ({
		...filter,
		...(highestCreatedAt != null && {
			since: Math.max(
				filter.since ?? highestCreatedAt,
				highestCreatedAt
			),
		}),
	}))

	const stop = (sendClose: boolean) => {
		if (stopped) return
		stopped = true
		if (reconnectTimeout != null)
			clearTimeout(reconnectTimeout)
		if (sendClose && activeSocket?.readyState === WebSocket.OPEN)
			sendRelayMessage(activeSocket, [
				'CLOSE',
				subscriptionId,
			])
		activeSocket?.close()
		signal?.removeEventListener('abort', close)
	}
	const close = () => stop(true)
	const closeWithEvent = (
		event: NostrRelaySubscriptionEvent,
		sendClose: boolean
	) => {
		try {
			onEvent(event)
		} finally {
			stop(sendClose)
		}
	}

	const connect = () => {
		if (stopped) return
		const socket = socketFactory(normalizedRelayUrl)
		activeSocket = socket
		let requestSent = false

		const handleOpen = () => {
			if (stopped || activeSocket !== socket || requestSent) return
			requestSent = true
			sendRelayMessage(socket, [
				'REQ',
				subscriptionId,
				...requestFilters(),
			])
		}
		const handleMessage = (messageEvent: MessageEvent) => {
			if (stopped || activeSocket !== socket) return

			let message: JsonValue
			try {
				message = JSON.parse(String(messageEvent.data))
			} catch {
				return
			}
			if (
				!isJsonArray(message)
				|| !isJsonString(message[0])
				|| !isJsonString(message[1])
				|| message[1] !== subscriptionId
			) return

			if (
				message[0] === 'EVENT'
				&& isJsonObject(message[2])
				&& isJsonString(message[2].id)
				&& isJsonNumber(message[2].created_at)
			) {
				if (seenEventIds.has(message[2].id)) return
				if (seenEventIds.size >= maxSeenEventIds) {
					closeWithEvent({
						type: 'closed',
						relayUrl: normalizedRelayUrl,
						subscriptionId,
						reason: 'client: event-id limit exceeded',
					}, true)
					return
				}
				seenEventIds.add(message[2].id)
				highestCreatedAt = Math.max(
					highestCreatedAt ?? message[2].created_at,
					message[2].created_at
				)
				onEvent({
					type: 'event',
					relayUrl: normalizedRelayUrl,
					subscriptionId,
					event: message[2] as NostrRelayEvent,
				})
				return
			}

			if (message[0] === 'EOSE') {
				reconnectDelayMs = initialReconnectDelayMs
				onEvent({
					type: 'eose',
					relayUrl: normalizedRelayUrl,
					subscriptionId,
				})
				return
			}

			if (
				message[0] === 'CLOSED'
				&& isJsonString(message[2])
			) {
				closeWithEvent({
					type: 'closed',
					relayUrl: normalizedRelayUrl,
					subscriptionId,
					reason: message[2],
				}, false)
			}
		}
		const handleClose = () => {
			socket.removeEventListener('open', handleOpen)
			socket.removeEventListener('message', handleMessage)
			socket.removeEventListener('close', handleClose)
			if (stopped || activeSocket !== socket) return
			activeSocket = undefined
			reconnectTimeout = setTimeout(() => {
				reconnectTimeout = undefined
				connect()
			}, reconnectDelayMs)
			reconnectDelayMs = Math.min(
				Math.max(1, reconnectDelayMs * 2),
				maxReconnectDelayMs
			)
		}

		socket.addEventListener('open', handleOpen)
		socket.addEventListener('message', handleMessage)
		socket.addEventListener('close', handleClose)
	}

	signal?.addEventListener('abort', close, {
		once: true,
	})
	if (signal?.aborted)
		close()
	else
		connect()

	return {
		close,
	}
}
