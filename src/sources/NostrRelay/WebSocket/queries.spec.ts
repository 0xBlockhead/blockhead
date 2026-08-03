import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'
import type { NostrRelaySocket } from '$/sources/NostrRelay/WebSocket/types.ts'
import {
	latestNostrRelayListFromEvents,
	listRelayEvents,
	nostrCommentFromEvent,
	nostrRelayListFromEvent,
	nostrZapReceiptFromEvent,
	nostrZapRequestFromEvent,
	openRelaySubscription,
	relayWebSocketUrl,
} from '$/sources/NostrRelay/WebSocket/queries.ts'
import {
	nostrEventId,
	type NostrEventEnvelope,
} from '$/sources/NostrRelay/Nip01/event.ts'
import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const secretKey = Hex.toBytes(`0x${'01'.repeat(32)}`)
const pubkey = Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2)
const signedEvent = (
	kind: number,
	overrides: Partial<Omit<NostrEventEnvelope, 'id' | 'sig'>> = {},
	signingKey = secretKey
) => {
	const unsignedEvent = {
		pubkey: Hex.fromBytes(schnorr.getPublicKey(signingKey)).slice(2),
		created_at: 1_700_000_000,
		kind,
		tags: [],
		content: '',
		...overrides,
	}
	const id = nostrEventId(unsignedEvent)
	return {
		...unsignedEvent,
		id,
		sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), signingKey, new Uint8Array(32))).slice(2),
	}
}

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

	it('verifies and normalizes NIP-65 access markers without duplicate relays', () => {
		const event = signedEvent(10_002, {
			tags: [
				['r', 'https://Relay.Example:443', 'read'],
				['r', 'wss://relay.example/', 'write'],
				['r', 'wss://write.example', 'write'],
				['r', 'wss://both.example'],
				['r', 'wss://ignored.example', 'search'],
				['r', 'ftp://ignored.example'],
				['p', '02'.repeat(32), 'wss://not-a-relay-list-tag.example'],
			],
		})

		expect(nostrRelayListFromEvent(event, pubkey)).toEqual({
			eventId: event.id,
			pubkey,
			createdAt: 1_700_000_000,
			relays: [
				{
					relayUrl: 'wss://relay.example/',
					read: true,
					write: true,
				},
				{
					relayUrl: 'wss://write.example/',
					read: false,
					write: true,
				},
				{
					relayUrl: 'wss://both.example/',
					read: true,
					write: true,
				},
			],
		})
	})

	it('keeps the newest signed replacement and never treats comments or zaps as relay lists', () => {
		const older = signedEvent(10_002, {
			created_at: 10,
			tags: [['r', 'wss://older.example']],
		})
		const tied = [
			signedEvent(10_002, {
				created_at: 20,
				content: 'first tie',
				tags: [['r', 'wss://first.example']],
			}),
			signedEvent(10_002, {
				created_at: 20,
				content: 'second tie',
				tags: [['r', 'wss://second.example']],
			}),
		]
		const expected = tied.toSorted((left, right) => left.id.localeCompare(right.id))[0]
		const invalidSignature = {
			...signedEvent(10_002, {
				created_at: 30,
				tags: [['r', 'wss://forged.example']],
			}),
			sig: '00'.repeat(64),
		}

		expect(latestNostrRelayListFromEvents([
			older,
			invalidSignature,
			...tied,
		], pubkey).eventId).toBe(expected.id)
		for (const kind of [
			1_111,
			9_735,
		])
			expect(() => nostrRelayListFromEvent(signedEvent(kind, {
				tags: [['r', 'wss://wrong-kind.example']],
			}), pubkey)).toThrow('event kind')
	})

	it('verifies and links a signed NIP-57 receipt to its embedded request', () => {
		const receiptSecretKey = Hex.toBytes(`0x${'02'.repeat(32)}`)
		const receiptPubkey = Hex.fromBytes(schnorr.getPublicKey(receiptSecretKey)).slice(2)
		const recipientPubkey = '03'.repeat(32)
		const targetEventId = '04'.repeat(32)
		const targetCoordinate = `30023:${'05'.repeat(32)}:article`
		const request = signedEvent(9_734, {
			content: 'Excellent post',
			tags: [
				['relays', 'https://Relay.Example', 'wss://relay.example/'],
				['amount', '21000'],
				['lnurl', 'lnurl1opaque'],
				['p', recipientPubkey],
				['e', targetEventId],
				['a', targetCoordinate],
				['k', '1'],
				['P', receiptPubkey],
			],
		})
		const receipt = signedEvent(9_735, {
			created_at: 1_700_000_001,
			tags: [
				['p', recipientPubkey],
				['P', request.pubkey],
				['e', targetEventId],
				['a', targetCoordinate],
				['k', '1'],
				['bolt11', 'lnbc1opaqueinvoice'],
				['description', JSON.stringify(request)],
				['preimage', 'opaque-preimage'],
			],
		}, receiptSecretKey)

		expect(nostrZapRequestFromEvent(request)).toMatchObject({
			eventId: request.id,
			senderPubkey: request.pubkey,
			recipientPubkey,
			relayUrls: ['wss://relay.example/'],
			amountMillisats: '21000',
			targetEventId,
			targetCoordinate,
			targetKind: '1',
			receiptPubkey,
		})
		expect(nostrZapReceiptFromEvent(receipt, {
			receiptPubkey,
			recipientPubkey,
		})).toMatchObject({
			eventId: receipt.id,
			receiptPubkey,
			request: {
				eventId: request.id,
				senderPubkey: request.pubkey,
				recipientPubkey,
			},
			bolt11: 'lnbc1opaqueinvoice',
			preimage: 'opaque-preimage',
		})
	})

	it('rejects forged, mismatched, duplicated, and non-zap receipt semantics', () => {
		const recipientPubkey = '06'.repeat(32)
		const targetEventId = '07'.repeat(32)
		const request = signedEvent(9_734, {
			tags: [
				['relays', 'wss://relay.example'],
				['p', recipientPubkey],
				['e', targetEventId],
			],
		})
		const receiptTags = [
			['p', recipientPubkey],
			['P', request.pubkey],
			['e', targetEventId],
			['bolt11', 'opaque-invoice'],
			['description', JSON.stringify(request)],
		]

		expect(() => nostrZapReceiptFromEvent({
			...signedEvent(9_735, { tags: receiptTags }),
			sig: '00'.repeat(64),
		})).toThrow('signature')
		expect(() => nostrZapReceiptFromEvent(signedEvent(9_735, {
			tags: receiptTags.map((tag) => tag[0] === 'p' ? ['p', '08'.repeat(32)] : tag),
		}))).toThrow('recipient')
		expect(() => nostrZapReceiptFromEvent(signedEvent(9_735, {
			tags: [
				...receiptTags,
				['e', '09'.repeat(32)],
			],
		}))).toThrow('cardinality')
		expect(() => nostrZapReceiptFromEvent(signedEvent(9_735, {
			tags: receiptTags.map((tag) => tag[0] === 'description' ? [
				'description',
				JSON.stringify({
					...request,
					content: 'forged embedded request',
				}),
			] : tag),
		}))).toThrow('valid signed zap request')
		for (const kind of [
			1_111,
			10_002,
		])
			expect(() => nostrZapReceiptFromEvent(signedEvent(kind, {
				tags: receiptTags,
			}))).toThrow('event kind')
	})

	it('preserves distinct NIP-22 root and parent targets with author provenance', () => {
		const rootAuthor = '0a'.repeat(32)
		const parentAuthor = '0b'.repeat(32)
		const rootCoordinate = `30023:${rootAuthor}:article`
		const parentEventId = '0c'.repeat(32)
		const comment = signedEvent(1_111, {
			content: 'Reply to the article discussion',
			tags: [
				['A', rootCoordinate],
				['K', '30023'],
				['P', rootAuthor],
				['e', parentEventId, 'wss://relay.example', parentAuthor],
				['k', '1111'],
				['p', parentAuthor],
			],
		})

		expect(nostrCommentFromEvent(comment)).toEqual({
			eventId: comment.id,
			authorPubkey: comment.pubkey,
			createdAt: comment.created_at,
			content: comment.content,
			tags: comment.tags,
			root: {
				type: 'addressable',
				coordinate: rootCoordinate,
				kind: 30_023,
				authorPubkey: rootAuthor,
			},
			parent: {
				type: 'event',
				eventId: parentEventId,
				kind: 1_111,
				authorPubkey: parentAuthor,
			},
		})
	})

	it('accepts supported external scopes and rejects ambiguous or NIP-10 targets', () => {
		const url = 'https://example.com/articles/one'
		const externalComment = signedEvent(1_111, {
			tags: [
				['I', url],
				['K', 'web'],
				['i', url],
				['k', 'web'],
			],
		})
		expect(nostrCommentFromEvent(externalComment)).toMatchObject({
			root: {
				type: 'external',
				identifier: url,
				kind: 'web',
			},
			parent: {
				type: 'external',
				identifier: url,
				kind: 'web',
			},
		})

		const author = '0d'.repeat(32)
		const eventId = '0e'.repeat(32)
		for (const tags of [
			[
				['E', eventId],
				['E', '0f'.repeat(32)],
				['K', '1063'],
				['P', author],
				['e', eventId],
				['k', '1063'],
				['p', author],
			],
			[
				['E', eventId],
				['K', '1'],
				['P', author],
				['e', eventId],
				['k', '1'],
				['p', author],
			],
			[
				['I', 'opaque:value'],
				['K', 'unknown-external-kind'],
				['i', 'opaque:value'],
				['k', 'unknown-external-kind'],
			],
		])
			expect(() => nostrCommentFromEvent(signedEvent(1_111, { tags }))).toThrow()
		expect(() => nostrCommentFromEvent({
			...externalComment,
			content: 'forged',
		})).toThrow('canonical serialization')
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

	it('collects raw snapshot events through EOSE and closes the subscription', async () => {
		const socket = new RelaySocketFixture()
		const event = signedEvent(30_023)
		const invalidEvent = {
			...event,
			id: 'invalid-event-id',
		}
		const result = listRelayEvents({
			relayUrl: 'https://relay.example/path',
			filters: [{
				kinds: [
					6,
					16,
					30_023,
				],
				limit: 2,
			}],
			timeoutMs: 1_000,
			socketFactory: () => socket as NostrRelaySocket,
		})

		socket.open()
		socket.message([
			'EVENT',
			'blockhead-snapshot',
			event,
		])
		socket.message([
			'EVENT',
			'blockhead-snapshot',
			invalidEvent,
		])
		socket.message([
			'EOSE',
			'blockhead-snapshot',
		])

		await expect(result).resolves.toEqual([
			event,
			invalidEvent,
		])
		expect(socket.sent).toEqual([
			JSON.stringify([
				'REQ',
				'blockhead-snapshot',
				{
					kinds: [
						6,
						16,
						30_023,
					],
					limit: 2,
				},
			]),
			JSON.stringify([
				'CLOSE',
				'blockhead-snapshot',
			]),
		])
		expect(socket.closed).toBe(true)
	})

	it('rejects relay closure without sending a redundant CLOSE', async () => {
		const socket = new RelaySocketFixture()
		const result = listRelayEvents({
			relayUrl: 'wss://relay.example',
			filters: [{
				kinds: [1],
			}],
			timeoutMs: 1_000,
			socketFactory: () => socket as NostrRelaySocket,
		})

		socket.open()
		socket.message([
			'CLOSED',
			'blockhead-snapshot',
			'blocked',
		])

		await expect(result).rejects.toThrow('Nostr relay snapshot closed: blocked')
		expect(socket.sent).toEqual([
			JSON.stringify([
				'REQ',
				'blockhead-snapshot',
				{
					kinds: [1],
				},
			]),
		])
		expect(socket.closed).toBe(true)
	})

	it('aborts snapshot reads on caller cancellation and bounded timeout', async () => {
		vi.useFakeTimers()
		const cancelledSocket = new RelaySocketFixture()
		const abortController = new AbortController()
		const cancelledResult = listRelayEvents({
			relayUrl: 'wss://relay.example',
			filters: [{
				kinds: [1],
			}],
			signal: abortController.signal,
			timeoutMs: 1_000,
			socketFactory: () => cancelledSocket as NostrRelaySocket,
		})
		const cancelledExpectation = expect(cancelledResult).rejects.toThrow('cancelled')
		cancelledSocket.open()
		abortController.abort(new Error('cancelled'))
		await cancelledExpectation
		expect(cancelledSocket.sent.at(-1)).toBe(JSON.stringify([
			'CLOSE',
			'blockhead-snapshot',
		]))
		expect(cancelledSocket.closed).toBe(true)

		const timedOutSocket = new RelaySocketFixture()
		const timedOutResult = listRelayEvents({
			relayUrl: 'wss://relay.example',
			filters: [{
				kinds: [1],
			}],
			timeoutMs: 25,
			socketFactory: () => timedOutSocket as NostrRelaySocket,
		})
		const timedOutExpectation = expect(timedOutResult).rejects.toThrow(
			'Nostr relay snapshot timed out after 25ms'
		)
		timedOutSocket.open()
		await vi.advanceTimersByTimeAsync(25)
		await timedOutExpectation
		expect(timedOutSocket.sent.at(-1)).toBe(JSON.stringify([
			'CLOSE',
			'blockhead-snapshot',
		]))
		expect(timedOutSocket.closed).toBe(true)
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
