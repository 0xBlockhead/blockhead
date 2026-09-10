import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { schnorr } from '@noble/curves/secp256k1.js'
import * as Hex from 'ox/Hex'
import { QueryClient } from '@tanstack/query-core'
import bindings from '$/sources/NostrRelay/bindings.ts'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { NostrRelaySubscriptionEvent } from '$/sources/NostrRelay/WebSocket/types.ts'
import { nostrEventId } from '$/sources/NostrRelay/Nip01/event.ts'

const openNostrRelaySubscription = vi.hoisted(() => vi.fn())
const openRelaySubscription = vi.hoisted(() => vi.fn<typeof import('$/sources/NostrRelay/WebSocket/queries.ts').openRelaySubscription>())
const openNostrRelaySubscriptionsForOperationGroup = vi.hoisted(() => vi.fn())
const listNostrRelayEventsForOperationGroup = vi.hoisted(() => vi.fn())
const listNostrRelayEventSnapshotForOperationGroup = vi.hoisted(() => vi.fn())

vi.mock('$/sources/NostrRelay/WebSocket/queries.ts', () => ({
	listNostrRelayEventSnapshotForOperationGroup,
	listNostrRelayEventsForOperationGroup,
	nostrSearchTargetKey: 'wss://relay.nostr.band',
	openNostrRelaySubscription,
	openRelaySubscription,
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
	it('bounds the binding union, isolates client/parent/limit, and revokes released callbacks', async () => {
		if (noteRepliesResolver == null || !('resolveLive' in noteRepliesResolver) || !('replies' in noteRepliesResolver.resolveLive))
			throw new Error('Nostr reply publisher missing')
		const publisher = noteRepliesResolver.resolveLive.replies
		const requests: Parameters<typeof import('$/sources/NostrRelay/WebSocket/queries.ts').openRelaySubscription>[0][] = []
		const closes: ReturnType<typeof vi.fn>[] = []
		openRelaySubscription.mockImplementation((request) => {
			requests.push(request)
			const close = vi.fn()
			closes.push(close)
			return { close }
		})
		const queryClient = new QueryClient()
		const otherClient = new QueryClient()
		const target = 'a'.repeat(64)
		const start = async (client: QueryClient, bindingIndex: number, limit = 2, eventId = target) => {
			const replaceRows = vi.fn()
			const count = vi.fn()
			const controller = new AbortController()
			const cleanup = await publisher.start({
				queryClient: client,
				parentEntitySelector: { eventId },
				signal: controller.signal,
				trigger: {
					filters: [],
					sorts: [],
					pagination: { limit },
					selectorKeys: [],
					parentSelectorKeys: [],
					sourceBinding: bindings[Source.NostrRelay_WebSocket][bindingIndex],
				},
				fields: {
					$$replies: {
						replaceRows,
						invalidate: vi.fn(),
						count: { replaceRows: count, invalidate: vi.fn() },
					},
					invalidate: vi.fn(),
				},
			})
			return { replaceRows, count, controller, cleanup, request: requests.at(-1) }
		}
		const first = await start(queryClient, 0)
		const second = await start(queryClient, 1)
		const other = await start(otherClient, 0)
		const narrow = await start(queryClient, 0, 1)
		const otherParent = await start(queryClient, 0, 2, 'b'.repeat(64))
		const registrations = [first, second, other, narrow, otherParent]
		const secret = Hex.toBytes(`0x${'05'.repeat(32)}`)
		const signed = (created_at: number) => {
			const unsigned = {
				pubkey: Hex.fromBytes(schnorr.getPublicKey(secret)).slice(2),
				kind: 1,
				created_at,
				content: `reply ${created_at}`,
				tags: [['e', target, '', 'reply']],
			}
			const id = nostrEventId(unsigned)
			return { ...unsigned, id, sig: Hex.fromBytes(schnorr.sign(Hex.toBytes(`0x${id}`), secret, new Uint8Array(32))).slice(2) }
		}
		const emit = (registration: typeof first, event: ReturnType<typeof signed>) => {
			const request = registration.request
			if (request == null)
				throw new Error('Missing source subscription')
			request.onEvent({ type: 'event', event, relayUrl: request.binding.target.key, subscriptionId: request.subscriptionId })
		}
		const expectRows = (registration: typeof first, events: ReturnType<typeof signed>[]) => {
			expect(registration.replaceRows).toHaveBeenLastCalledWith([{
				source: Source.NostrRelay_WebSocket,
				value: events.map((event) => expect.objectContaining({
					[EntityMetaKey.Selector]: { eventId: event.id },
				})),
			}])
		}
		try {
			const older = signed(10)
			const newer = signed(20)
			const newest = signed(30)
			emit(first, older)
			emit(second, newer)
			expectRows(second, [newer, older])
			emit(second, older)
			expectRows(second, [newer, older])
			emit(first, newest)
			expectRows(first, [newest, newer])
			emit(other, older)
			expectRows(other, [older])
			emit(narrow, older)
			expectRows(narrow, [older])
			emit(otherParent, older)
			expect(otherParent.replaceRows).not.toHaveBeenCalled()
			first.controller.abort()
			first.cleanup()
			emit(first, signed(40))
			expectRows(first, [newest, newer])
			emit(second, signed(5))
			expectRows(second, [newer, older])
			second.cleanup()
			const publications = second.replaceRows.mock.calls.length
			emit(second, signed(50))
			expect(second.replaceRows).toHaveBeenCalledTimes(publications)
			const restarted = await start(queryClient, 0)
			registrations.push(restarted)
			emit(restarted, older)
			expectRows(restarted, [older])
			for (const registration of registrations)
				expect(registration.count).not.toHaveBeenCalled()
		} finally {
			for (const registration of registrations)
				registration.cleanup()
			openRelaySubscription.mockReset()
			queryClient.clear()
			otherClient.clear()
		}
		for (const close of closes)
			expect(close).toHaveBeenCalledOnce()
	})

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
		expect(replaceReplyCountRows).not.toHaveBeenCalled()
		expect(noteRepliesResolver.projections.$$replies.resolveCount).toBeUndefined()
		expect(replaceReactionRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: reactionEventId },
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.NostrReaction, [], 'content')]: '+',
					[entityFieldAddressKey(EntityType.NostrReaction, [], '$targetNote')]: {
						[EntityMetaKey.Selector]: { eventId: targetEventId },
					},
				}),
			})],
		}])
		expect(replaceReactionCountRows).not.toHaveBeenCalled()
		expect(noteReactionsResolver.projections.$$reactions.resolveCount).toBeUndefined()

		onEvents[0]({
			type: 'eose',
			relayUrl: 'wss://relay.example',
			subscriptionId: 'thread',
		})
		onEvents[1]({
			type: 'eose',
			relayUrl: 'wss://relay.example',
			subscriptionId: 'thread',
		})
		expect(replaceReplyRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: replyEventId },
			})],
		}])
		expect(replaceReactionRows).toHaveBeenLastCalledWith([{
			source: Source.NostrRelay_WebSocket,
			value: [expect.objectContaining({
				[EntityMetaKey.Selector]: { eventId: reactionEventId },
			})],
		}])

		cleanupReplies()
		cleanupReactions()
		expect(closes[0]).toHaveBeenCalledOnce()
		expect(closes[1]).toHaveBeenCalledOnce()
	})
})

describe('Nostr relay public search completion', () => {
	it('records completion only from selected-relay EOSE', async () => {
		listNostrRelayEventSnapshotForOperationGroup.mockResolvedValueOnce({
			events: [],
			selectedBindingCount: 2,
			completedBindingCount: 1,
			completed: false,
		})
		const searchResolver = nostrRelayWebSocket.resolvers.find((candidate) => (
			candidate.entityType === EntityType.NostrSearchQuery
		))
		if (searchResolver == null)
			throw new Error('Nostr search resolver missing')

		await expect(searchResolver.resolve.Query.resolve({
			query: 'alice',
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 2,
				offset: 0,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).resolves.toMatchObject({
			query: 'alice',
			profiles: [],
			resultCount: 0,
			completed: false,
		})
	})
})
