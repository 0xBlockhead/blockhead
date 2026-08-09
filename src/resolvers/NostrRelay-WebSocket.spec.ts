import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { NostrRelaySubscriptionEvent } from '$/sources/NostrRelay/WebSocket/types.ts'
import { nostrEventId } from '$/sources/NostrRelay/Nip01/event.ts'

const openRelaySubscription = vi.hoisted(() => vi.fn())
const listNostrRelayEvents = vi.hoisted(() => vi.fn())
const nostrRelaySnapshotBindings = vi.hoisted(() => vi.fn(() => [{
	target: {
		key: 'wss://relay.nostr.band',
	},
}]))

vi.mock('$/sources/NostrRelay/WebSocket/queries.ts', () => ({
	listNostrRelayEvents,
	nostrRelaySnapshotBindings,
	openRelaySubscription,
}))

const { default: nostrRelayWebSocket } = await import('$/resolvers/NostrRelay-WebSocket.ts')
const resolver = nostrRelayWebSocket.resolvers[0]

describe('Nostr relay live note resolver', () => {
	it('publishes bounded signed notes and preserves lifecycle ownership', async () => {
		let onEvent: ((event: NostrRelaySubscriptionEvent) => void) | undefined
		const close = vi.fn()
		openRelaySubscription.mockImplementationOnce((options) => {
			onEvent = options.onEvent
			return { close }
		})
		const replaceRows = vi.fn()
		const replaceCountRows = vi.fn()
		const signal = new AbortController().signal
		const cleanup = await resolver.resolveLive.notes.start({
			parentEntitySelector: {
				relayUrl: 'wss://relay.example/path',
			},
			queryClient: {},
			signal,
			trigger: {
				filters: [],
				sorts: [],
				pagination: {
					limit: 1,
				},
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [Source.NostrRelay_WebSocket],
			},
			fields: {
				$$notes: {
					replaceRows,
					invalidate: vi.fn(),
					count: {
						replaceRows: replaceCountRows,
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
		})

		expect(openRelaySubscription).toHaveBeenCalledWith(expect.objectContaining({
			binding: expect.objectContaining({
				target: {
					kind: 'Feed',
					key: 'wss://relay.example/path',
				},
			}),
			subscriptionId: 'blockhead-live-notes',
			filters: [{
				kinds: [1],
				limit: 1,
			}],
			signal,
		}))
		if (onEvent == null)
			throw new Error('NostrRelay-WebSocket spec missing subscription callback')

		const secretKey = Hex.toBytes(`0x${'03'.repeat(32)}`)
		const unsignedFirstEvent = {
			pubkey: Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2),
			kind: 1,
			created_at: 1_700_000_000,
			content: 'Live relay note',
			tags: [['content-warning', 'Spoiler']],
		}
		const firstEventId = nostrEventId(unsignedFirstEvent)
		const firstEvent = {
			...unsignedFirstEvent,
			id: firstEventId,
			sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${firstEventId}`), secretKey, new Uint8Array(32))).slice(2),
		}
		onEvent({
			type: 'event',
			relayUrl: 'wss://relay.example/path',
			subscriptionId: 'blockhead-live-notes',
			event: firstEvent,
		})
		onEvent({
			type: 'event',
			relayUrl: 'wss://relay.example/path',
			subscriptionId: 'blockhead-live-notes',
			event: firstEvent,
		})
		onEvent({
			type: 'eose',
			relayUrl: 'wss://relay.example/path',
			subscriptionId: 'blockhead-live-notes',
		})

		expect(replaceRows).toHaveBeenCalledTimes(1)
		expect(replaceRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: [{
				[EntityMetaKey.Selector]: {
					eventId: firstEventId,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.NostrNote, [], 'content')]: 'Live relay note',
					[entityFieldAddressKey(EntityType.NostrNote, [], 'createdAt')]: 1_700_000_000_000,
					[entityFieldAddressKey(EntityType.NostrNote, [], 'tags')]: firstEvent.tags,
					[entityFieldAddressKey(EntityType.NostrNote, [], 'sensitive')]: true,
					[entityFieldAddressKey(EntityType.NostrNote, [], 'contentWarning')]: 'Spoiler',
				}),
			}],
		}])
		expect(replaceCountRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: 1,
		}])

		onEvent({
			type: 'event',
			relayUrl: 'wss://relay.example/path',
			subscriptionId: 'blockhead-live-notes',
			event: {
				...firstEvent,
				id: '4'.repeat(64),
				sig: 'invalid',
			},
		})
		expect(replaceRows).toHaveBeenCalledTimes(1)

		onEvent({
			type: 'event',
			relayUrl: 'wss://relay.example/path',
			subscriptionId: 'blockhead-live-notes',
			event: {
				...firstEvent,
				content: 'Replacement note',
			},
		})
		expect(replaceRows).toHaveBeenCalledTimes(1)

		const replacementUnsignedEvent = {
			...unsignedFirstEvent,
			content: 'Replacement note',
		}
		const replacementEventId = nostrEventId(replacementUnsignedEvent)
		onEvent({
			type: 'event',
			relayUrl: 'wss://relay.example/path',
			subscriptionId: 'blockhead-live-notes',
			event: {
				...replacementUnsignedEvent,
				id: replacementEventId,
				sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${replacementEventId}`), secretKey, new Uint8Array(32))).slice(2),
			},
		})
		expect(replaceRows).toHaveBeenCalledTimes(2)
		expect(replaceRows.mock.calls.at(-1)?.[0][0].value).toHaveLength(1)
		expect(replaceRows.mock.calls.at(-1)?.[0][0].value[0][EntityMetaKey.Selector]).toEqual({
			eventId: replacementEventId,
		})

		cleanup()
		expect(close).toHaveBeenCalledOnce()
	})
})
