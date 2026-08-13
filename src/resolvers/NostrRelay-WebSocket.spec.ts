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

const openNostrRelaySubscription = vi.hoisted(() => vi.fn())
const openNostrRelaySubscriptionsForOperationGroup = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrRelay/WebSocket/queries.ts', () => ({
	openNostrRelaySubscription,
	openNostrRelaySubscriptionsForOperationGroup,
}))

const { default: nostrRelayWebSocket } = await import('$/resolvers/NostrRelay-WebSocket.ts')
const resolver = nostrRelayWebSocket.resolvers[0]
const noteRepliesResolver = nostrRelayWebSocket.resolvers.find((candidate) => (
	candidate.entityType === EntityType.NostrNote
	&& 'resolveLive' in candidate
	&& 'replies' in candidate.resolveLive
))
const noteReactionsResolver = nostrRelayWebSocket.resolvers.find((candidate) => (
	candidate.entityType === EntityType.NostrNote
	&& 'resolveLive' in candidate
	&& 'reactions' in candidate.resolveLive
))

describe('Nostr relay live note resolver', () => {
	it('publishes bounded signed notes and preserves lifecycle ownership', async () => {
		let onEvent: ((event: NostrRelaySubscriptionEvent) => void) | undefined
		const close = vi.fn()
		openNostrRelaySubscription.mockImplementationOnce((options) => {
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

		expect(openNostrRelaySubscription).toHaveBeenCalledWith(expect.objectContaining({
			relayUrl: 'wss://relay.example/path',
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

	it('streams signed direct replies and reactions into an open note journey', async () => {
		if (
			noteRepliesResolver == null
			|| !('resolveLive' in noteRepliesResolver)
			|| noteReactionsResolver == null
			|| !('resolveLive' in noteReactionsResolver)
		)
			throw new Error('Nostr note live resolver missing')

		const onEvents: ((event: NostrRelaySubscriptionEvent) => void)[] = []
		const closes = [vi.fn(), vi.fn()]
		openNostrRelaySubscriptionsForOperationGroup.mockImplementation((options) => {
			onEvents.push(options.onEvent)
			return { close: closes[onEvents.length - 1] }
		})
		const replaceReplyRows = vi.fn()
		const replaceReplyCountRows = vi.fn()
		const replaceReactionRows = vi.fn()
		const replaceReactionCountRows = vi.fn()
		const signal = new AbortController().signal
		const targetEventId = 'a'.repeat(64)
		const cleanupReplies = await noteRepliesResolver.resolveLive.replies.start({
			parentEntitySelector: { eventId: targetEventId },
			queryClient: {},
			signal,
			trigger: {
				filters: [],
				sorts: [],
				pagination: { limit: 2 },
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [Source.NostrRelay_WebSocket],
			},
			fields: {
				$$replies: {
					replaceRows: replaceReplyRows,
					invalidate: vi.fn(),
					count: {
						replaceRows: replaceReplyCountRows,
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
		})
		const cleanupReactions = await noteReactionsResolver.resolveLive.reactions.start({
			parentEntitySelector: { eventId: targetEventId },
			queryClient: {},
			signal,
			trigger: {
				filters: [],
				sorts: [],
				pagination: { limit: 2 },
				selectorKeys: [],
				parentSelectorKeys: [],
				sources: [Source.NostrRelay_WebSocket],
			},
			fields: {
				$$reactions: {
					replaceRows: replaceReactionRows,
					invalidate: vi.fn(),
					count: {
						replaceRows: replaceReactionCountRows,
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
		})

		expect(openNostrRelaySubscriptionsForOperationGroup).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				filters: [{
					'#e': [targetEventId],
					kinds: [1],
					limit: 2,
				}],
				signal,
			})
		)
		expect(openNostrRelaySubscriptionsForOperationGroup).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				filters: [{
					'#e': [targetEventId],
					kinds: [7],
					limit: 2,
				}],
				signal,
			})
		)
		if (onEvents.length !== 2)
			throw new Error('Nostr note live callback missing')

		const secretKey = Hex.toBytes(`0x${'05'.repeat(32)}`)
		const emit = (
			kind: number,
			tags: string[][],
			content: string
		) => {
			const unsignedEvent = {
				pubkey: Hex.fromBytes(schnorr.getPublicKey(secretKey)).slice(2),
				kind,
				created_at: 1_700_000_000 + kind,
				content,
				tags,
			}
			const id = nostrEventId(unsignedEvent)
			for (const onEvent of onEvents)
				onEvent({
					type: 'event',
					relayUrl: 'wss://relay.example',
					subscriptionId: 'thread',
					event: {
						...unsignedEvent,
						id,
						sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), secretKey, new Uint8Array(32))).slice(2),
					},
				})
			return id
		}

		const replyEventId = emit(1, [['e', targetEventId, '', 'reply']], 'Direct reply')
		const reactionEventId = emit(7, [['e', targetEventId]], '+')
		emit(1, [['e', targetEventId, '', 'root'], ['e', 'b'.repeat(64), '', 'reply']], 'Nested reply')

		expect(replaceReplyRows).toHaveBeenCalledTimes(1)
		expect(replaceReplyRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: replyEventId },
			})],
		}])
		expect(replaceReplyCountRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: 1,
		}])
		expect(replaceReactionRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: [{
				[EntityMetaKey.Selector]: { eventId: reactionEventId },
			}],
		}])
		expect(replaceReactionCountRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: 1,
		}])

		cleanupReplies()
		cleanupReactions()
		expect(closes[0]).toHaveBeenCalledOnce()
		expect(closes[1]).toHaveBeenCalledOnce()
	})
})
