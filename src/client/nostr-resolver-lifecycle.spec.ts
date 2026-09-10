import { expect, it, vi } from 'vitest'
import { QueryClient } from '@tanstack/query-core'
import { and, createLiveQueryCollection, eq } from '@tanstack/db'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'
import { stringify } from 'devalue'
import { client } from '$/client/$client.svelte.ts'
import nostr from '$/resolvers/NostrRelay-WebSocket.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { sourceProviders } from '$/sources/index.ts'
import bindings from '$/sources/NostrRelay/bindings.ts'
import { nostrEventId } from '$/sources/NostrRelay/Nip01/event.ts'
import type { NostrRelayMessage } from '$/sources/NostrRelay/WebSocket/types.ts'
import { inMemoryPersistence } from '../../tests/inMemoryPersistence.ts'

it.each([
	{ kind: 1, field: '$$replies', publisher: 'replies', entityType: EntityType.NostrNote },
	{ kind: 7, field: '$$reactions', publisher: 'reactions', entityType: EntityType.NostrReaction },
] as const)('shares two bound Nostr $publisher streams until the last collection consumer leaves', async ({ kind, field, publisher, entityType }) => {
	const sockets: RelaySocket[] = []
	class RelaySocket extends EventTarget {
		static CONNECTING = 0
		static OPEN = 1
		static CLOSED = 3
		readyState: number = RelaySocket.CONNECTING
		requests: NostrRelayMessage[] = []
		constructor(readonly url: string) {
			super()
			sockets.push(this)
			queueMicrotask(() => {
				if (this.readyState !== RelaySocket.CONNECTING)
					return
				this.readyState = RelaySocket.OPEN
				this.dispatchEvent(new Event('open'))
			})
		}
		send(data: string) {
			const message: NostrRelayMessage = JSON.parse(data)
			this.requests.push(message)
			if (message[0] === 'REQ' && message[1] === 'blockhead-snapshot')
				queueMicrotask(() => this.frame(['EOSE', 'blockhead-snapshot']))
		}
		frame(message: NostrRelayMessage) {
			this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify(message) }))
		}
		close() {
			this.readyState = RelaySocket.CLOSED
			this.dispatchEvent(new Event('close'))
		}
	}
	vi.stubGlobal('WebSocket', RelaySocket)
	const selectedBindings = bindings[Source.NostrRelay_WebSocket].slice(0, 2)
	const context = client({ schema, sourceProviders })({
		resolvers: [nostr],
		sourceIndex: {
			enabledBindingIds: new Set(selectedBindings.map(sourceBindingId)),
			enabledSources: new Set([Source.NostrRelay_WebSocket]),
			resolverPublicEnvBySource: new Map([[Source.NostrRelay_WebSocket, {}]]),
		},
	})({
		queryClient: new QueryClient(),
		persistence: inMemoryPersistence().persistence,
		schemaVersion: 1,
	})
	const targetEventId = 'a'.repeat(64)
	const collection = context.entityFieldCollections.NostrNote[
		entityFieldAddressKey(EntityType.NostrNote, [], field)
	]
	const createQuery = () => createLiveQueryCollection({
		gcTime: 1,
		startSync: true,
		query: (query) => query.from({ row: collection }).where(({ row }) => and(
			eq(row[EntityMetaKey.ParentSelectorKey], stringify({ eventId: targetEventId })),
			eq(row[EntityMetaKey.Source], Source.NostrRelay_WebSocket)
		)),
	})
	const first = createQuery()
	const second = createQuery()
	const firstConsumer = first.subscribeChanges(() => {}, { includeInitialState: true })
	const secondConsumer = second.subscribeChanges(() => {}, { includeInitialState: true })
	try {
		await Promise.all([first.preload(), second.preload()])
		await expect.poll(() => context.liveSubscriptions.size).toBe(2)
		expect([...context.liveSubscriptions.values()].map((entry) => entry.referenceCount)).toEqual([2, 2])
		const liveSockets = sockets.filter((socket) => socket.requests.some((request) => (
			request[0] === 'REQ'
			&& String(request[1]).startsWith(`blockhead-note-${publisher}-`)
		)))
		expect(liveSockets.map((socket) => socket.url).sort()).toEqual(
			selectedBindings.map((binding) => new URL(binding.endpoints[0].locator).href).sort()
		)
		const emit = (socket: RelaySocket, content: string) => {
			const secret = Hex.toBytes(`0x${'05'.repeat(32)}`)
			const unsigned = {
				pubkey: Hex.fromBytes(schnorr.getPublicKey(secret)).slice(2),
				kind,
				created_at: 1_700_000_000,
				content,
				tags: [['e', targetEventId, '', 'reply']],
			}
			const id = nostrEventId(unsigned)
			const event = {
				...unsigned,
				id,
				sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), secret, new Uint8Array(32))).slice(2),
			}
			for (const request of socket.requests)
				if (request[0] === 'REQ')
					socket.frame(['EVENT', request[1], event])
			return id
		}
		expect(first.toArray).toEqual([])
		const firstId = emit(liveSockets[0], 'First relay reply')
		await expect.poll(() => first.toArray.length).toBe(1)
		expect(second.toArray).toEqual(first.toArray)
		expect(first.toArray).toEqual([expect.objectContaining({
			[EntityMetaKey.Source]: Source.NostrRelay_WebSocket,
			[EntityMetaKey.Value]: expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: firstId },
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(entityType, [], 'content')]: 'First relay reply',
				}),
			}),
		})])
		const secondId = emit(liveSockets[1], 'Second relay reply')
		await expect.poll(() => JSON.stringify(second.toArray)).toContain(secondId)
		expect(JSON.stringify(second.toArray)).toContain(firstId)
		firstConsumer.unsubscribe()
		await expect.poll(() => [...context.liveSubscriptions.values()].map((entry) => entry.referenceCount)).toEqual([1, 1])
		expect(liveSockets.every((socket) => socket.readyState === RelaySocket.OPEN)).toBe(true)
		const nextId = emit(liveSockets[1], 'Reply after first consumer leaves')
		await expect.poll(() => JSON.stringify(second.toArray)).toContain(nextId)
		secondConsumer.unsubscribe()
		await expect.poll(() => context.liveSubscriptions.size).toBe(0)
		expect(liveSockets.every((socket) => socket.readyState === RelaySocket.CLOSED)).toBe(true)
		for (const socket of liveSockets)
			expect(socket.requests.filter((request) => request[0] === 'CLOSE')).toHaveLength(1)
		const retained = collection.toArray
		for (const socket of liveSockets)
			emit(socket, 'Stale reply after last consumer leaves')
		expect(collection.toArray).toEqual(retained)
	} finally {
		context.destroy()
		vi.unstubAllGlobals()
	}
})
