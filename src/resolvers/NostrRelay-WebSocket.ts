import {
	resolverContextRowLimit,
	type ResolveLivePublishers,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	isNostrRepostKind,
	normalizeNostrEventId,
	normalizeNostrPubkey,
	nostrArticleEventFieldValues,
	nostrArticleEventReference,
	nostrArticleReferencesFromEvent,
	nostrEventsNewestFirst,
	nostrNoteFieldValues,
	nostrNoteFieldValuesWithThreadTargets,
	nostrNoteReference,
	nostrProfileMetadataEventFieldValues,
	nostrProfileMetadataEventReference,
	nostrReactionFieldValues,
	nostrReactionFieldValuesWithTarget,
	nostrReactionReference,
	nostrReactionTargetEventId,
	nostrReplyToEventId,
	nostrRepostFieldValues,
	nostrRepostFieldValuesWithTarget,
	nostrRepostReference,
	nostrTagValue,
} from '$/resolvers/Nostr.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceOperationGroup,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	type NostrEventEnvelope,
	type NostrEventExpectation,
	validateNostrEvent,
	validatedNostrEventFromContent,
} from '$/sources/NostrRelay/Nip01/event.ts'
import {
	listNostrRelayEventSnapshotForOperationGroup,
	listNostrRelayEventsForOperationGroup,
	nostrSearchTargetKey,
	openNostrRelaySubscription,
	openNostrRelaySubscriptionsForOperationGroup,
	openRelaySubscription,
} from '$/sources/NostrRelay/WebSocket/queries.ts'
import type { NostrRelayEvent } from '$/sources/NostrRelay/WebSocket/types.ts'

const listNostrRelayEvents = (
	request: Omit<Parameters<typeof listNostrRelayEventsForOperationGroup>[0], 'operationGroup'>
) => listNostrRelayEventsForOperationGroup({
	operationGroup: SourceOperationGroup.NostrRelayRead,
	...request,
})

const validatedNostrEvents = (
	events: Parameters<typeof validateNostrEvent>[0][],
	expectation: NostrEventExpectation
) => events.flatMap((event) => {
	try {
		return [validateNostrEvent(event, expectation)]
	} catch {
		return []
	}
})

const noteFromRelayEvent = (event: NostrRelayEvent) => {
	try {
		return nostrNoteFieldValues(validateNostrEvent(event, { kinds: [1] }))
	} catch {
		return undefined
	}
}

type ThreadContribution = {
	events: Map<string, NostrEventEnvelope>
}

const threadSubscriptions = new WeakMap<object, Map<string, Set<ThreadContribution>>>()

const subscribeThreadEvents = ({
	queryClient,
	eventId,
	kind,
	limit,
	binding,
	signal,
	publish,
}: {
	queryClient: object
	eventId: string
	kind: 1 | 7
	limit: number
	binding: SourceBinding | undefined
	signal: AbortSignal
	publish: (events: NostrEventEnvelope[]) => void
}) => {
	if (signal.aborted)
		return () => {}

	const key = JSON.stringify([
		eventId,
		kind,
		limit,
	])
	const queries = threadSubscriptions.get(queryClient) ?? new Map<string, Set<ThreadContribution>>()
	threadSubscriptions.set(queryClient, queries)
	const contributions = queries.get(key) ?? new Set<ThreadContribution>()
	queries.set(key, contributions)
	const contribution: ThreadContribution = { events: new Map() }
	contributions.add(contribution)
	let stopped = false
	let subscription: { close: () => void } | undefined
	const release = () => {
		if (stopped)
			return

		stopped = true
		signal.removeEventListener('abort', release)
		contributions.delete(contribution)
		contribution.events.clear()
		if (contributions.size === 0) {
			queries.delete(key)
			if (queries.size === 0)
				threadSubscriptions.delete(queryClient)
		}
		// Teardown releases observations without replacing the retained field snapshot.
		subscription?.close()
	}
	signal.addEventListener('abort', release, { once: true })
	const publishUnion = () => {
		const events = new Map<string, NostrEventEnvelope>()
		for (const registered of contributions)
			for (const event of registered.events.values())
				events.set(event.id, event)
		publish(nostrEventsNewestFirst([...events.values()]).slice(0, limit))
	}
	const options: Omit<Parameters<typeof openRelaySubscription>[0], 'binding'> = {
		subscriptionId: `blockhead-note-${kind === 1 ? 'replies' : 'reactions'}-${eventId}`,
		filters: [{
			'#e': [eventId],
			kinds: [kind],
			limit,
		}],
		signal,
		maxSeenEventIds: Math.max(limit * 16, 1_024),
		onEvent: (message) => {
			if (stopped || signal.aborted)
				return

			if (message.type === 'eose') {
				publishUnion()
				return
			}
			if (message.type !== 'event')
				return

			let event
			try {
				event = validateNostrEvent(message.event, { kinds: [kind] })
			} catch {
				return
			}
			if (
				(kind === 1 ? nostrReplyToEventId(event.tags) : nostrReactionTargetEventId(event.tags)) !== eventId
				|| contribution.events.has(event.id)
			)
				return

			contribution.events.set(event.id, event)
			// A binding's top N contains every candidate it can contribute to the union's top N.
			contribution.events = new Map(
				nostrEventsNewestFirst([...contribution.events.values()])
					.slice(0, limit)
					.map((candidate) => [candidate.id, candidate])
			)
			publishUnion()
		},
	}
	try {
		subscription = binding == null ?
			openNostrRelaySubscriptionsForOperationGroup({
				...options,
				operationGroup: SourceOperationGroup.NostrRelayRead,
			})
		:
			openRelaySubscription({
				...options,
				binding,
			})
		if (stopped)
			subscription.close()
	} catch (error) {
		release()
		throw error
	}
	return release
}

type NostrNoteStart = ResolveLivePublishers<
	typeof schema,
	EntityType.NostrNote
>[string]['start']

const startNoteReplies: NostrNoteStart = async ({
	fields,
	parentEntitySelector,
	queryClient,
	signal,
	trigger,
}) => subscribeThreadEvents({
	queryClient,
	eventId: parentEntitySelector.eventId,
	kind: 1,
	limit: resolverContextRowLimit(trigger),
	binding: trigger.sourceBinding,
	signal,
	publish: (events) => fields.$$replies.replaceRows([{
		source: Source.NostrRelay_WebSocket,
		value: events.map(nostrNoteReference),
	}]),
})

const startNoteReactions: NostrNoteStart = async ({
	fields,
	parentEntitySelector,
	queryClient,
	signal,
	trigger,
}) => subscribeThreadEvents({
	queryClient,
	eventId: parentEntitySelector.eventId,
	kind: 7,
	limit: resolverContextRowLimit(trigger),
	binding: trigger.sourceBinding,
	signal,
	publish: (events) => fields.$$reactions.replaceRows([{
		source: Source.NostrRelay_WebSocket,
		value: events.map((event) => nostrReactionReference(event, parentEntitySelector.eventId)),
	}]),
})

export default {
	source: Source.NostrRelay_WebSocket,

	resolvers: [
		defineResolver({
			entityType: EntityType.NostrRelay,
			resolve: {
				RelayUrl: {
					resolve: async ({ relayUrl }) => ({
						relayUrl,
					}),
				},
			},
			resolveLive: {
				notes: {
					facetPath: [],
					publishes: {
						'$$notes': true,
					},
					start: async ({
						fields,
						parentEntitySelector,
						signal,
						trigger,
					}) => {
						const notesByEventId = new Map<
							string,
							NonNullable<ReturnType<typeof noteFromRelayEvent>>
						>()
						const limit = resolverContextRowLimit(trigger)
						const subscription = openNostrRelaySubscription({
							relayUrl: parentEntitySelector.relayUrl,
							subscriptionId: 'blockhead-live-notes',
							filters: [{
								kinds: [1],
								limit,
							}],
							signal,
							maxSeenEventIds: Math.max(limit * 16, 1_024),
							onEvent: (subscriptionEvent) => {
								if (subscriptionEvent.type !== 'event')
									return

								const note = noteFromRelayEvent(subscriptionEvent.event)
								if (note == null || notesByEventId.has(note.eventId))
									return

								notesByEventId.set(note.eventId, note)
								if (notesByEventId.size > limit) {
									const oldestEventId = notesByEventId.keys().next().value
									if (oldestEventId != null)
										notesByEventId.delete(oldestEventId)
								}

								const notes = [...notesByEventId.values()].map((value) => ({
									[EntityMetaKey.Selector]: {
										eventId: value.eventId,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(value)
											.filter(([fieldName, fieldValue]) => (
												fieldName !== 'eventId'
												&& fieldValue !== undefined
											))
											.map(([fieldName, fieldValue]) => [
												entityFieldAddressKey(EntityType.NostrNote, [], fieldName),
												fieldValue,
											])
									),
								}))
								fields.$$notes.replaceRows([{
									source: Source.NostrRelay_WebSocket,
									value: notes,
								}])
								fields.$$notes.count.replaceRows([{
									source: Source.NostrRelay_WebSocket,
									value: notes.length,
								}])
							},
						})

						return subscription.close
					},
				},
			},
		})({
			relayUrl: (relay) => relay.relayUrl,
			$$notes: () => [],
		}),
		defineResolver({
			entityType: EntityType.NostrSearchQuery,
			resolve: {
				Query: {
					resolve: async ({ query }, context) => {
						if (/[\u0000-\u001f\u007f]/.test(query))
							throw new Error('Nostr profile search query contains control characters')

						const normalizedQuery = query.trim().replace(/\s+/g, ' ')
						if (normalizedQuery === '')
							throw new Error('Nostr profile search query must not be blank')
						if (normalizedQuery.length > 64)
							throw new Error('Nostr profile search query exceeds 64 characters')

						const snapshot = await listNostrRelayEventSnapshotForOperationGroup({
							operationGroup: SourceOperationGroup.NostrSearch,
							filters: [{
								kinds: [0],
								limit: resolverContextRowLimit(context),
								search: normalizedQuery,
							}],
						})
						const profiles = [...new Map(
							validatedNostrEvents(
								snapshot.events,
								{ kinds: [0] }
							)
								.flatMap((event) => {
									const pubkey = event.kind === 0 ? normalizeNostrPubkey(event.pubkey) : undefined
									return pubkey == null ?
										[]
									:
										[[
											pubkey,
											{
												[EntityMetaKey.Selector]: { pubkey },
											},
										] as const]
								})
						).values()]
						return {
							query: normalizedQuery,
							profiles,
							resultCount: profiles.length,
							completed: snapshot.completed,
						}
					},
				},
			},
		})({
			query: (search) => search.query,
			resultCount: (search) => search.resultCount,
			completed: (search) => search.completed,
			$$profiles: {
				select: (search) => search.profiles,
				resolveCount: (search) => search.resultCount,
				continuation: () => ({
					operation: 'profile-search',
					target: nostrSearchTargetKey,
					terminal: true,
				}),
			},
		}),
		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }) => {
						const events = nostrEventsNewestFirst(
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										authors: [pubkey],
										kinds: [0],
										limit: 1,
									}],
								}),
								{
									kinds: [0],
									pubkey,
								}
							)
						)
						return {
							pubkey,
							$latestMetadataEvent: (
								events.length === 0 ?
									undefined
								:
									nostrProfileMetadataEventReference(events[0])
							),
						}
					},
				}
			},
		})({
			pubkey: (profile) => profile.pubkey,
			$latestMetadataEvent: (profile) => profile.$latestMetadataEvent,
		}),

		defineResolver({
			entityType: EntityType.NostrProfileMetadataEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const event = validatedNostrEvents(
							await listNostrRelayEvents({
								filters: [{
									ids: [eventId],
									kinds: [0],
									limit: 1,
								}],
							}),
							{
								eventId,
								kinds: [0],
							}
						).at(0)
						if (event == null)
							throw new Error('NostrRelay_WebSocket: profile metadata event not found')
						return nostrProfileMetadataEventFieldValues(event)
					},
				},
			},
		})({
			eventId: (event) => event.eventId,
			$profile: (event) => event.$profile,
			pubkey: (event) => event.pubkey,
			kind: (event) => event.kind,
			createdAt: (event) => event.createdAt,
			signature: (event) => event.signature,
			content: (event) => event.content,
			tags: (event) => event.tags,
			displayName: (event) => event.displayName,
			about: (event) => event.about,
			nip05: (event) => event.nip05,
			lud16: (event) => event.lud16,
			lud06: (event) => event.lud06,
			website: (event) => event.website,
			iconUrl: (event) => event.iconUrl,
			$icon: (event) => event.$icon,
			bannerUrl: (event) => event.bannerUrl,
			$banner: (event) => event.$banner,
		}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }) => {
						const event = validatedNostrEvents(
							await listNostrRelayEvents({
								filters: [{
									ids: [eventIdSelector],
									kinds: [1],
									limit: 1,
								}],
							}),
							{
								eventId: eventIdSelector,
								kinds: [1],
							}
						).at(0)
						if (event == null || event.kind !== 1)
							throw new Error('NostrRelay_WebSocket: note not found')
						const eventId = normalizeNostrEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrRelay_WebSocket: note event id mismatch')
						const note = nostrNoteFieldValues(event)
						const threadTargetIds = [...new Set(
							[note.replyToEventId, note.rootEventId].filter((targetEventId) => targetEventId != null)
						)]
						const threadTargetsByEventId = new Map<string, NonNullable<typeof event>>()
						if (threadTargetIds.length > 0) {
							try {
								for (const [
									targetEventId,
									targetEvent,
								] of validatedNostrEvents(
									await listNostrRelayEvents({
										filters: [{
											ids: threadTargetIds,
											kinds: [1],
											limit: threadTargetIds.length,
										}],
									}),
									{ kinds: [1] }
								).map((targetEvent) => [targetEvent.id, targetEvent] as const))
									threadTargetsByEventId.set(targetEventId, targetEvent)
							} catch {
							}
						}
						return nostrNoteFieldValuesWithThreadTargets(note, {
							replyToEvent: (
								note.replyToEventId == null ?
									undefined
								:
									threadTargetsByEventId.get(note.replyToEventId)
							),
							rootEvent: (
								note.rootEventId == null ?
									undefined
								:
									threadTargetsByEventId.get(note.rootEventId)
							),
						})
					},
				},
			},
		})({
				eventId: (note) => note.eventId,
				kind: (note) => note.kind,
				pubkey: (note) => note.pubkey,
				content: (note) => note.content,
				sensitive: (note) => note.sensitive,
				contentWarning: (note) => note.contentWarning,
				createdAt: (note) => note.createdAt,
				tags: (note) => note.tags,
				$author: (note) => note.$author,
				replyToEventId: (note) => note.replyToEventId,
				rootEventId: (note) => note.rootEventId,
				$replyToNote: (note) => note.$replyToNote,
				$rootNote: (note) => note.$rootNote,
			}),

		defineResolver({
			entityType: EntityType.NostrRepost,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }) => {
						const event = validatedNostrEvents(
							await listNostrRelayEvents({
								filters: [{
									ids: [eventIdSelector],
									kinds: [6, 16],
									limit: 1,
								}],
							}),
							{
								eventId: eventIdSelector,
								kinds: [6, 16],
							}
						).at(0)
						if (event == null || !isNostrRepostKind(event.kind))
							throw new Error('NostrRelay_WebSocket: repost not found')
						const eventId = normalizeNostrEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrRelay_WebSocket: repost event id mismatch')
						const values = nostrRepostFieldValues(event)
						if (values.kind === 6) return values
						const embeddedTargetEvent = validatedNostrEventFromContent(event.content)
						const targetEventId = values.repostedEventId ?? embeddedTargetEvent?.id
						if (targetEventId == null) return values
						const valuesWithTargetIdentity = values.repostedEventId == null ?
							{
								...values,
								repostedEventId: targetEventId,
							}
						:
							values
						let targetEvent
						try {
							targetEvent = validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										ids: [targetEventId],
										limit: 1,
									}],
								}),
								{ eventId: targetEventId }
							).at(0)
						} catch {
							targetEvent = embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						}
						targetEvent ??= embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						return nostrRepostFieldValuesWithTarget(
							valuesWithTargetIdentity,
							targetEvent
						)
					},
				},
			},
		})({
				eventId: (repost) => repost.eventId,
				kind: (repost) => repost.kind,
				pubkey: (repost) => repost.pubkey,
				createdAt: (repost) => repost.createdAt,
				tags: (repost) => repost.tags,
				repostedEventId: (repost) => repost.repostedEventId,
				$author: (repost) => repost.$author,
				$repostedNote: (repost) => repost.$repostedNote,
				$repostedArticle: (repost) => repost.$repostedArticle,
			}),

		defineResolver({
			entityType: EntityType.NostrReaction,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }) => {
						const event = validatedNostrEvents(
							await listNostrRelayEvents({
								filters: [{
									ids: [eventIdSelector],
									kinds: [7],
									limit: 1,
								}],
							}),
							{
								eventId: eventIdSelector,
								kinds: [7],
							}
						).at(0)
						if (event == null || event.kind !== 7)
							throw new Error('NostrRelay_WebSocket: reaction not found')
						const eventId = normalizeNostrEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrRelay_WebSocket: reaction event id mismatch')
						const values = nostrReactionFieldValues(event)
						const targetEventId = nostrReactionTargetEventId(event.tags)
						if (targetEventId == null) return values
						let targetEvent
						try {
							targetEvent = validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										ids: [targetEventId],
										limit: 1,
									}],
								}),
								{ eventId: targetEventId }
							).at(0)
						} catch {
							targetEvent = undefined
						}
						return nostrReactionFieldValuesWithTarget(
							values,
							targetEvent
						)
					},
				}
			},
		})({
				eventId: (reaction) => reaction.eventId,
				kind: (reaction) => reaction.kind,
				pubkey: (reaction) => reaction.pubkey,
				createdAt: (reaction) => reaction.createdAt,
				tags: (reaction) => reaction.tags,
				$author: (reaction) => reaction.$author,
				$targetNote: (reaction) => reaction.$targetNote,
				$targetArticle: (reaction) => reaction.$targetArticle,
				content: (reaction) => reaction.content,
			}),

		defineResolver({
			entityType: EntityType.NostrArticle,
			resolve: {
				CanonicalCoordinate: {
					resolve: async ({ identifier: identifierSelector, kind, pubkey: pubkeySelector }) => {
						const pubkey = normalizeNostrPubkey(pubkeySelector)
						const identifier = identifierSelector
						if (pubkey == null || identifier === '' || kind !== 30023)
							throw new Error('NostrRelay_WebSocket: article id invalid')

						const events = nostrEventsNewestFirst(
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										'#d': [identifier],
										authors: [pubkey],
										kinds: [30_023],
										limit: 1,
									}],
								}),
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.filter((event) => nostrTagValue(event.tags, 'd') === identifier)
						)
						if (events.length === 0)
							throw new Error('NostrRelay_WebSocket: article not found')
						return {
							kind: 30_023,
							pubkey,
							identifier,
							$latestEvent: nostrArticleEventReference(events[0]),
						}
					},
				}
			},
		})({
			pubkey: (article) => article.pubkey,
			identifier: (article) => article.identifier,
			kind: (article) => article.kind,
			$latestEvent: (article) => article.$latestEvent,
		}),

		defineResolver({
			entityType: EntityType.NostrArticleEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const event = validatedNostrEvents(
							await listNostrRelayEvents({
								filters: [{
									ids: [eventId],
									kinds: [30_023],
									limit: 1,
								}],
							}),
							{
								eventId,
								kinds: [30_023],
							}
						).at(0)
						if (event == null)
							throw new Error('NostrRelay_WebSocket: article event not found')
						return nostrArticleEventFieldValues(event)
					},
				},
			},
		})({
			eventId: (event) => event.eventId,
			$article: (event) => event.$article,
			pubkey: (event) => event.pubkey,
			identifier: (event) => event.identifier,
			kind: (event) => event.kind,
			createdAt: (event) => event.createdAt,
			signature: (event) => event.signature,
			tags: (event) => event.tags,
			title: (event) => event.title,
			summary: (event) => event.summary,
			imageUrl: (event) => event.imageUrl,
			$image: (event) => event.$image,
			content: (event) => event.content,
			sensitive: (event) => event.sensitive,
			contentWarning: (event) => event.contentWarning,
			publishedAt: (event) => event.publishedAt,
			$author: (event) => event.$author,
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										authors: [pubkey],
										kinds: [1],
										limit,
									}],
								}),
								{
									pubkey,
									kinds: [1],
								}
							)
								.map(nostrNoteReference)
						)
					},
				}
			},
		})({
				$$notes: (notes) => notes,
			}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										authors: [pubkey],
										kinds: [30_023],
										limit,
									}],
								}),
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.flatMap((event) => nostrArticleReferencesFromEvent(event))
						)
					},
				}
			},
		})({
				$$articles: (articles) => articles,
			}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										authors: [pubkey],
										kinds: [6, 16],
										limit,
									}],
								}),
								{
									pubkey,
									kinds: [6, 16],
								}
							)
								.map(nostrRepostReference)
						)
					},
				}
			},
		})({
				$$reposts: (reposts) => reposts,
			}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										'#e': [eventId],
										kinds: [1],
										limit,
									}],
								}),
								{ kinds: [1] }
							)
								.filter((event) => nostrReplyToEventId(event.tags) === eventId)
								.map(nostrNoteReference)
						)
					},
				},
			},
			resolveLive: {
				replies: {
					facetPath: [],
					publishes: {
						'$$replies': true,
					},
					start: startNoteReplies,
				},
			},
		})({
				$$replies: (replies) => replies,
			}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								await listNostrRelayEvents({
									filters: [{
										'#e': [eventId],
										kinds: [7],
										limit,
									}],
								}),
								{ kinds: [7] }
							)
								.filter((event) => nostrReactionTargetEventId(event.tags) === eventId)
								.map((event) => nostrReactionReference(event, eventId))
						)
					},
				},
			},
			resolveLive: {
				reactions: {
					facetPath: [],
					publishes: {
						'$$reactions': true,
					},
					start: startNoteReactions,
				},
			},
		})({
				$$reactions: (reactions) => reactions,
			}),
	],
} satisfies RegisteredSourceResolverModule
