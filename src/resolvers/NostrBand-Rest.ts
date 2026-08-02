import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	isNostrRepostKind,
	normalizeNostrEventId,
	normalizeNostrPubkey,
	nostrArticleEventFieldValues,
	nostrArticleEventReference,
	nostrArticleReferencesFromEvent,
	nostrEventsNewestFirst,
	nostrNoteFieldValues,
	nostrProfileMetadataEventFieldValues,
	nostrProfileMetadataEventReference,
	nostrReactionFieldValues,
	nostrReactionFieldValuesWithTarget,
	nostrReactionTargetEventId,
	nostrReplyToEventId,
	nostrRepostFieldValues,
	nostrRepostFieldValuesWithTarget,
	nostrTagValue,
} from '$/resolvers/Nostr.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { NostrBandRelayStats } from '$/sources/NostrBand/Rest/types.ts'
import type { JsonObject } from '$/typescript/JsonValue.ts'
import {
	type NostrEventExpectation,
	validateNostrEvent,
	validatedNostrEventFromContent,
} from '$/sources/NostrRelay/Nip01/event.ts'

const normalizeRelayUrl = (value: string | undefined) => {
	if (value == null || value === '') return undefined
	try {
		const url = new URL(
			value.includes('://') ?
				value
			:
				`wss://${value}`
		)
		if (url.protocol !== 'wss:' && url.protocol !== 'ws:') return undefined
		const pathname = url.pathname.replace(/\/$/, '')
		return `wss://${url.host}${pathname}`
	} catch {
		return undefined
	}
}

const eventFromWire = (wire: {
	event?: JsonObject
	events?: JsonObject[]
	profile?: JsonObject
} | undefined, expectation: NostrEventExpectation = {}) => (
	((event) => event == null ? undefined : validateNostrEvent(event, expectation))(
		wire?.event
		?? wire?.events?.[0]
		?? wire?.profile
	)
)

const relayUrlFromWire = (relay: NostrBandRelayStats) => (
	normalizeRelayUrl(
		relay.url
		?? relay.relay_url
		?? relay.relay
		?? (
			relay.domain == null ?
				undefined
			:
				`wss://${relay.domain}`
		)
	)
)

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

export default {
	source: Source.NostrBand_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.NostrSearchQuery,
			resolve: {
				Query: {
					resolve: async ({ query }, context) => {
						const {
							normalizeNostrBandProfileSearchQuery,
							searchProfiles,
						} = await import('$/sources/NostrBand/Rest/queries.ts')
						const normalizedQuery = normalizeNostrBandProfileSearchQuery(query)
						const profiles = [...new Map(
							validatedNostrEvents(
								(await searchProfiles(normalizedQuery, resolverContextRowLimit(context))).events ?? [],
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
							completed: true,
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
					target: 'api',
					terminal: true,
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const events = nostrEventsNewestFirst([...new Map(
							validatedNostrEvents(
								(await listAuthorEvents(pubkey, resolverContextRowLimit(context), [0])).events ?? [],
								{
									kinds: [0],
									pubkey,
								}
							).map((event) => [event.id, event])
						).values()])
						return {
							pubkey,
							$latestMetadataEvent: (
								events.length === 0 ?
									undefined
								:
									nostrProfileMetadataEventReference(events[0])
							),
							$$metadataEvents: events.map(nostrProfileMetadataEventReference),
						}
					},
				}
			},
		})({
			pubkey: (profile) => profile.pubkey,
			$latestMetadataEvent: (profile) => profile.$latestMetadataEvent,
			$$metadataEvents: (profile) => profile.$$metadataEvents,
		}),

		defineResolver({
			entityType: EntityType.NostrProfileMetadataEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventId), {
							eventId,
							kinds: [0],
						})
						if (event == null)
							throw new Error('NostrBand_Rest: profile metadata event not found')
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
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [1],
						})
						if (event == null || event.kind !== 1)
							throw new Error('NostrBand_Rest: note not found')
						const eventId = normalizeNostrEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrBand_Rest: note event id mismatch')
						return nostrNoteFieldValues(event)
					},
				}
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
			entityType: EntityType.NostrRelay,
			resolve: {
				RelayUrl: {
					resolve: ({ relayUrl: relayUrlSelector }) => {
						const relayUrl = normalizeRelayUrl(relayUrlSelector)
						if (relayUrl == null)
							throw new Error('NostrBand_Rest: relay url invalid')

						return {
							relayUrl,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$relay: { relayUrl },
									timestampMs: Date.now(),
									source: Source.NostrBand_Rest,
								},
							}],
						}
					},
				}
			},
		})({
			relayUrl: (relay) => relay.relayUrl,
			$$timestamps: (relay) => relay.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.NostrRelay_Timestamp,
			resolve: {
				RelayTimestampMsSource: {
					appliesTo: [{
						source: Source.NostrBand_Rest,
					}],
					resolve: async ({
						$relay,
						timestampMs,
						source,
					}) => {
						if (source !== Source.NostrBand_Rest)
							throw new Error(`NostrBand_Rest: unsupported source ${source}`)

						const relayUrl = normalizeRelayUrl($relay.relayUrl)
						if (relayUrl == null)
							throw new Error('NostrBand_Rest: relay url invalid')

						try {
							const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
							const relays = (await listTopRelays(100)).relays ?? []
							const relayIndex = relays.findIndex((relay) => relayUrlFromWire(relay) === relayUrl)
							if (relayIndex < 0)
								return {
									$relay: { [EntityMetaKey.Selector]: { relayUrl } },
									timestampMs,
									source,
									reachable: false,
									error: 'NostrBand_Rest: relay not found',
								}

							const relay = relays[relayIndex]
							return {
								$relay: { [EntityMetaKey.Selector]: { relayUrl } },
								timestampMs,
								source,
								reachable: true,
								name: optionalNonemptyString(relay.name),
								description: optionalNonemptyString(relay.description),
								software: optionalNonemptyString(relay.software),
								version: optionalNonemptyString(relay.version),
								...(relay.nips != null && { supportedNips: relay.nips }),
								...(relay.is_paid != null && { isPaid: relay.is_paid }),
								...(relay.is_paid == null && relay.paid != null && { isPaid: relay.paid }),
								...(relay.limit != null && { limitation: { maxLimit: relay.limit } }),
								...(relay.users != null && { activeUsers: relay.users }),
								...(relay.users == null && relay.users_count != null && { activeUsers: relay.users_count }),
								...(relay.events != null && { eventsPerDay: relay.events }),
								...(relay.events == null && relay.events_count != null && { eventsPerDay: relay.events_count }),
								rank: relayIndex + 1,
							}
						} catch (error) {
							return {
								$relay: { [EntityMetaKey.Selector]: { relayUrl } },
								timestampMs,
								source,
								name: undefined,
								description: undefined,
								software: undefined,
								version: undefined,
								supportedNips: undefined,
								limitation: undefined,
								isPaid: undefined,
								activeUsers: undefined,
								eventsPerDay: undefined,
								rank: undefined,
								reachable: false,
								error: error instanceof Error ? error.message : String(error),
							}
						}
					},
				},
			},
		})({
			$relay: (observation) => observation.$relay,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			name: (observation) => observation.name,
			description: (observation) => observation.description,
			software: (observation) => observation.software,
			version: (observation) => observation.version,
			supportedNips: (observation) => observation.supportedNips,
			limitation: (observation) => observation.limitation,
			isPaid: (observation) => observation.isPaid,
			activeUsers: (observation) => observation.activeUsers,
			eventsPerDay: (observation) => observation.eventsPerDay,
			rank: (observation) => observation.rank,
			reachable: (observation) => observation.reachable,
			error: (observation) => observation.error,
		}),

		defineResolver({
			entityType: EntityType.NostrRepost,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [6, 16],
						})
						if (event == null || !isNostrRepostKind(event.kind))
							throw new Error('NostrBand_Rest: repost not found')
						const eventId = normalizeNostrEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrBand_Rest: repost event id mismatch')
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
							targetEvent = eventFromWire(await getEventById(targetEventId), {
								eventId: targetEventId,
							})
						} catch {
							targetEvent = embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						}
						targetEvent ??= embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						return nostrRepostFieldValuesWithTarget(
							valuesWithTargetIdentity,
							targetEvent
						)
					},
				}
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
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [7],
						})
						if (event == null || event.kind !== 7)
							throw new Error('NostrBand_Rest: reaction not found')
						const eventId = normalizeNostrEventId(String(event.id))
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('NostrBand_Rest: reaction event id mismatch')
						const values = nostrReactionFieldValues(event)
						const targetEventId = nostrReactionTargetEventId(event.tags)
						if (targetEventId == null) return values
						let targetEvent
						try {
							targetEvent = eventFromWire(await getEventById(targetEventId), {
								eventId: targetEventId,
							})
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
					resolve: async ({ identifier: identifierSelector, kind, pubkey: pubkeySelector }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const pubkey = normalizeNostrPubkey(pubkeySelector)
						const identifier = identifierSelector
						if (pubkey == null || identifier === '' || kind !== 30023)
							throw new Error('NostrBand_Rest: article id invalid')
						const events = nostrEventsNewestFirst([...new Map(
							validatedNostrEvents(
								(await listAuthorEvents(pubkey, resolverContextRowLimit(context), [30_023])).events ?? [],
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.filter((event) => nostrTagValue(event.tags, 'd') === identifier)
								.map((event) => [event.id, event])
						).values()])
						if (events.length === 0)
							throw new Error('NostrBand_Rest: article not found')
						return {
							kind: 30_023,
							pubkey,
							identifier,
							$latestEvent: nostrArticleEventReference(events[0]),
							$$events: events.map(nostrArticleEventReference),
						}
					},
				}
			},
		})({
			pubkey: (article) => article.pubkey,
			identifier: (article) => article.identifier,
			kind: (article) => article.kind,
			$latestEvent: (article) => article.$latestEvent,
			$$events: (article) => article.$$events,
		}),

		defineResolver({
			entityType: EntityType.NostrArticleEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventId), {
							eventId,
							kinds: [30_023],
						})
						if (event == null)
							throw new Error('NostrBand_Rest: article event not found')
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
			content: (event) => event.content,
			sensitive: (event) => event.sensitive,
			contentWarning: (event) => event.contentWarning,
			publishedAt: (event) => event.publishedAt,
			$author: (event) => event.$author,
		}),

		defineResolver({
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listTopProfiles } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await listTopProfiles(limit)).profiles ?? [])
								.flatMap((topProfile) => {
									if (topProfile.profile == null) return []
									const event = validatedNostrEvents([topProfile.profile], { kinds: [0] }).at(0)
									if (event == null) return []
									const pubkey = normalizeNostrPubkey(topProfile.pubkey ?? event.pubkey)
									if (pubkey == null || event.pubkey !== pubkey) return []
									return [{
										[EntityMetaKey.Selector]: { pubkey },
									}]
								})
						)
					},
				},
			},
		})({
			$$observedProfiles: (profiles) => profiles,
		}),

		defineResolver({
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listRecentEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listRecentEvents(limit, [1])).events ?? [],
								{ kinds: [1] }
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				},
			},
		})({
			$$observedNotes: (notes) => notes,
		}),

		defineResolver({
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await listTopRelays(limit)).relays ?? [])
								.flatMap((relay) => {
									const relayUrl = relayUrlFromWire(relay)
									if (relayUrl == null) return []
									return [{
										[EntityMetaKey.Selector]: { relayUrl },
									}]
								})
						)
					},
				},
			},
		})({
			$$observedRelays: (relays) => relays,
		}),

		defineResolver({
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listRecentEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listRecentEvents(limit, [6, 16])).events ?? [],
								{ kinds: [6, 16] }
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				},
			},
		})({
			$$observedReposts: (reposts) => reposts,
		}),

		defineResolver({
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listRecentEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listRecentEvents(limit, [30_023])).events ?? [],
								{ kinds: [30_023] }
							)
								.flatMap((event) => nostrArticleReferencesFromEvent(event))
						)
					},
				},
			},
		})({
			$$observedArticles: (articles) => articles,
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listAuthorEvents(pubkey, limit, [1])).events ?? [],
								{
									pubkey,
									kinds: [1],
								}
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
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
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listAuthorEvents(pubkey, limit, [30_023])).events ?? [],
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
						const { listAuthorEvents } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listAuthorEvents(pubkey, limit, [6, 16])).events ?? [],
								{
									pubkey,
									kinds: [6, 16],
								}
							)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
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
						const { listNoteReplies } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listNoteReplies(eventId, limit)).events ?? [],
								{ kinds: [1] }
							)
								.filter((event) => nostrReplyToEventId(event.tags) === eventId)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				}
			},
		})({
				$$replies: (replies) => replies,
			}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { listNoteReactions } = await import('$/sources/NostrBand/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							validatedNostrEvents(
								(await listNoteReactions(eventId, limit)).events ?? [],
								{ kinds: [7] }
							)
								.filter((event) => nostrReactionTargetEventId(event.tags) === eventId)
								.map((event) => ({
									[EntityMetaKey.Selector]: { eventId: event.id },
								}))
						)
					},
				}
			},
		})({
				$$reactions: (reactions) => reactions,
			}),

	],
} satisfies RegisteredSourceResolverModule
