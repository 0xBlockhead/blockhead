import type { NostrRelaySocket } from '$/sources/NostrRelay/WebSocket/types.ts'
import {
	openRelaySubscription,
	relayWebSocketUrl,
} from '$/sources/NostrRelay/WebSocket/queries.ts'
import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

class RelaySocketFixture {
	readyState = WebSocket.CONNECTING
	sent: string[] = []
	closed = false
	listeners = new Map<string, Set<EventListener>>()

	send(message: string) {
		this.sent.push(message)
	}

	close() {
		this.closed = true
		this.readyState = WebSocket.CLOSED
	}

	addEventListener(type: string, listener: EventListener) {
		const listeners = this.listeners.get(type) ?? new Set()
		listeners.add(listener)
		this.listeners.set(type, listeners)
	}

	removeEventListener(type: string, listener: EventListener) {
		this.listeners.get(type)?.delete(listener)
	}

	dispatch(type: string, event: Event) {
		for (const listener of this.listeners.get(type) ?? [])
			listener(event)
	}

	open() {
		this.readyState = WebSocket.OPEN
		this.dispatch('open', new Event('open'))
	}

	message(message: readonly unknown[]) {
		this.dispatch('message', new MessageEvent('message', {
			data: JSON.stringify(message),
		}))
	}

	disconnect() {
		this.readyState = WebSocket.CLOSED
		this.dispatch('close', new CloseEvent('close'))
	}
}

describe('Nostr relay WebSocket subscriptions', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('normalizes HTTP relay schemes without changing native WebSocket URLs', () => {
		expect(relayWebSocketUrl('https://relay.example/path')).toBe('wss://relay.example/path')
		expect(relayWebSocketUrl('ws://relay.example/path')).toBe('ws://relay.example/path')
		expect(relayWebSocketUrl('HTTPS://Relay.Example:443/path?limit=20')).toBe('wss://relay.example/path?limit=20')
	})

	it.each([
		'ftp://relay.example',
		'wss://user:secret@relay.example',
		'wss://relay.example/#fragment',
		'wss://relay.example/%2e%2e/admin',
		'wss://relay.example/%2fadmin',
		'wss://relay.example/\u0000',
		`wss://${'a'.repeat(254)}`,
	])('rejects unsafe relay ingress %s', (relayUrl) => {
		expect(() => relayWebSocketUrl(relayUrl)).toThrow()
	})

	it('sends one REQ, deduplicates events, and handles EOSE and CLOSED', () => {
		const socket = new RelaySocketFixture()
		const events: { type: string }[] = []
		const subscription = openRelaySubscription({
			relayUrl: 'wss://relay.example',
			subscriptionId: 'notes',
			filters: [{
				kinds: [1],
			}],
			socketFactory: () => socket as NostrRelaySocket,
			onEvent: (event) => events.push(event),
		})

		socket.open()
		socket.open()
		socket.message([
			'EVENT',
			'notes',
			{
				id: 'event-1',
				created_at: 10,
			},
		])
		socket.message([
			'EVENT',
			'notes',
			{
				id: 'event-1',
				created_at: 10,
			},
		])
		socket.message([
			'EOSE',
			'notes',
		])
		socket.message([
			'CLOSED',
			'notes',
			'rate-limited',
		])

		expect(socket.sent).toEqual([
			JSON.stringify([
				'REQ',
				'notes',
				{
					kinds: [1],
				},
			]),
		])
		expect(events.map((event) => event.type)).toEqual([
			'event',
			'eose',
			'closed',
		])
		expect(socket.closed).toBe(true)
		subscription.close()
	})

	it('reconnects once, resumes inclusively, and cancels the active subscription', async () => {
		vi.useFakeTimers()
		const availableSockets = [
			new RelaySocketFixture(),
			new RelaySocketFixture(),
		]
		const createdSockets: RelaySocketFixture[] = []
		const abortController = new AbortController()
		const events: { relayUrl: string }[] = []
		const subscription = openRelaySubscription({
			relayUrl: 'wss://relay.example',
			subscriptionId: 'resume',
			filters: [{
				kinds: [1],
				since: 5,
				until: 100,
			}],
			signal: abortController.signal,
			initialReconnectDelayMs: 10,
			socketFactory: () => {
				const socket = availableSockets.shift()
				if (socket == null)
					throw new Error('Unexpected relay reconnect')
				createdSockets.push(socket)
				return socket as NostrRelaySocket
			},
			onEvent: (event) => events.push(event),
		})
		const firstSocket = createdSockets[0]
		firstSocket.open()
		firstSocket.message([
			'EVENT',
			'resume',
			{
				id: 'event-1',
				created_at: 20,
			},
		])
		firstSocket.disconnect()
		await vi.advanceTimersByTimeAsync(10)
		const secondSocket = createdSockets[1]
		secondSocket.open()
		secondSocket.message([
			'EVENT',
			'resume',
			{
				id: 'event-1',
				created_at: 20,
			},
		])
		secondSocket.message([
			'EVENT',
			'resume',
			{
				id: 'event-2',
				created_at: 20,
			},
		])
		abortController.abort()

		expect(secondSocket.sent).toEqual([
			JSON.stringify([
				'REQ',
				'resume',
				{
					kinds: [1],
					since: 20,
					until: 100,
				},
			]),
			JSON.stringify([
				'CLOSE',
				'resume',
			]),
		])
		expect(events).toHaveLength(2)
		expect(events.every((event) => event.relayUrl === 'wss://relay.example/')).toBe(true)
	})

	it('grows and caps reconnect backoff, then resets it after EOSE', async () => {
		vi.useFakeTimers()
		const createdSockets: RelaySocketFixture[] = []
		const subscription = openRelaySubscription({
			relayUrl: 'https://relay.example',
			subscriptionId: 'backoff',
			filters: [{
				kinds: [1],
			}],
			initialReconnectDelayMs: 10,
			maxReconnectDelayMs: 20,
			socketFactory: (relayUrl) => {
				expect(relayUrl).toBe('wss://relay.example/')
				const socket = new RelaySocketFixture()
				createdSockets.push(socket)
				return socket as NostrRelaySocket
			},
			onEvent: () => {},
		})

		createdSockets[0].disconnect()
		await vi.advanceTimersByTimeAsync(9)
		expect(createdSockets).toHaveLength(1)
		await vi.advanceTimersByTimeAsync(1)
		createdSockets[1].disconnect()
		await vi.advanceTimersByTimeAsync(19)
		expect(createdSockets).toHaveLength(2)
		await vi.advanceTimersByTimeAsync(1)
		createdSockets[2].disconnect()
		await vi.advanceTimersByTimeAsync(20)
		createdSockets[3].open()
		createdSockets[3].message([
			'EOSE',
			'backoff',
		])
		createdSockets[3].disconnect()
		await vi.advanceTimersByTimeAsync(9)
		expect(createdSockets).toHaveLength(4)
		await vi.advanceTimersByTimeAsync(1)
		expect(createdSockets).toHaveLength(5)
		subscription.close()
	})

	it('ignores malformed and unrelated frames and does not open after prior abort', () => {
		const socket = new RelaySocketFixture()
		const onEvent = vi.fn()
		openRelaySubscription({
			relayUrl: 'wss://relay.example',
			subscriptionId: 'notes',
			filters: [{
				kinds: [1],
			}],
			socketFactory: () => socket as NostrRelaySocket,
			onEvent,
		})
		socket.open()
		socket.message(['EVENT', 'other', {
			id: 'event-1',
			created_at: 1,
		}])
		socket.message(['EVENT', 'notes', {
			created_at: 1,
		}])
		socket.message(['EOSE'])
		socket.dispatch('message', new MessageEvent('message', {
			data: 'not json',
		}))
		expect(onEvent).not.toHaveBeenCalled()

		const abortController = new AbortController()
		const socketFactory = vi.fn(() => socket as NostrRelaySocket)
		abortController.abort()
		openRelaySubscription({
			relayUrl: 'wss://relay.example',
			subscriptionId: 'aborted',
			filters: [{
				kinds: [1],
			}],
			signal: abortController.signal,
			socketFactory,
			onEvent,
		})
		expect(socketFactory).not.toHaveBeenCalled()
	})

	it('sends CLOSE and cleans up at the event ceiling even when the callback throws', () => {
		const socket = new RelaySocketFixture()
		openRelaySubscription({
			relayUrl: 'http://relay.example',
			subscriptionId: 'bounded',
			filters: [{
				kinds: [1],
			}],
			maxSeenEventIds: 1,
			socketFactory: () => socket as NostrRelaySocket,
			onEvent: (event) => {
				if (event.type === 'closed')
					throw new Error('consumer failed')
			},
		})
		socket.open()
		socket.message([
			'EVENT',
			'bounded',
			{
				id: 'event-1',
				created_at: 1,
			},
		])
		expect(() => socket.message([
			'EVENT',
			'bounded',
			{
				id: 'event-2',
				created_at: 2,
			},
		])).toThrow('consumer failed')
		expect(socket.sent.at(-1)).toBe(JSON.stringify([
			'CLOSE',
			'bounded',
		]))
		expect(socket.closed).toBe(true)
	})

	it('cleans up relay CLOSED even when the callback throws', () => {
		const socket = new RelaySocketFixture()
		openRelaySubscription({
			relayUrl: 'wss://relay.example',
			subscriptionId: 'closed',
			filters: [{
				kinds: [1],
			}],
			socketFactory: () => socket as NostrRelaySocket,
			onEvent: () => {
				throw new Error('consumer failed')
			},
		})
		socket.open()
		expect(() => socket.message([
			'CLOSED',
			'closed',
			'blocked',
		])).toThrow('consumer failed')
		expect(socket.closed).toBe(true)
		expect(socket.sent).toHaveLength(1)
	})
})
