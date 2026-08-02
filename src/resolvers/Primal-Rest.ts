import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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
import type {
	PrimalNostrEvent,
} from '$/sources/Primal/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import {
	isJsonObject,
	isJsonString,
} from '$/typescript/JsonValue.ts'
import {
	type NostrEventExpectation,
	validateNostrEvent,
	validatedNostrEventFromContent,
} from '$/sources/NostrRelay/Nip01/event.ts'

const profileEventsFromResponse = (
	response: JsonValue | undefined,
	pubkey: string
) => nostrEventsNewestFirst(
	(
		response != null && isJsonObject(response) && Array.isArray(response.events) ?
			[response, ...response.events]
		:
			[response]
	).flatMap((wire) => {
		try {
			const event = profileEventFromWire(wire)
			return event == null ? [] : [validateNostrEvent(event, {
				pubkey,
				kinds: [0],
			})]
		} catch {
			return []
		}
	})
)

const profileEventFromWire = (wire: JsonValue | undefined): PrimalNostrEvent | undefined => {
	if (wire == null || !isJsonObject(wire)) return undefined
	if (
		isJsonString(wire.id)
		&& wire.kind === 0
	) return validateNostrEvent(wire, { kinds: [0] })
	if (wire.metadata != null) return profileEventFromWire(wire.metadata)
	if (wire.profile != null) return profileEventFromWire(wire.profile)
	if (wire.user != null) return profileEventFromWire(wire.user)
	return undefined
}

const noteEventFromWire = (wire: JsonValue | undefined): PrimalNostrEvent | undefined => {
	if (wire == null || !isJsonObject(wire)) return undefined
	if (!isJsonString(wire.id)) return undefined
	if (wire.event != null) return noteEventFromWire(wire.event)
	if (wire.note != null) return noteEventFromWire(wire.note)
	return validateNostrEvent(wire)
}

const eventFromWire = (
	wire: JsonValue | undefined,
	expectation: NostrEventExpectation = {}
) => (
	((nostrEventWire) => (
		nostrEventWire == null ?
			undefined
		:
			((event) => event == null ? undefined : validateNostrEvent(event, expectation))(
				noteEventFromWire(isJsonObject(nostrEventWire) ? nostrEventWire.event ?? nostrEventWire : undefined)
			)
	))(wire)
)

const eventsFromTimelineResponse = (
	response: JsonValue | undefined,
	expectation: NostrEventExpectation = {}
) => {
	if (Array.isArray(response))
		return response.flatMap((noteEvent) => {
			try {
				const event = noteEventFromWire(noteEvent)
				return event == null ? [] : [validateNostrEvent(event, expectation)]
			} catch {
				return []
			}
		})
	if (response == null || !isJsonObject(response)) return []
	for (const key of [
		'notes',
		'posts',
		'events',
		'items',
		'reposts',
		'articles',
		'actions',
	] as const) {
		const noteEvents = response[key]
		if (!Array.isArray(noteEvents)) continue
		return noteEvents.flatMap((noteEvent) => {
			try {
				const event = noteEventFromWire(noteEvent)
				return event == null ? [] : [validateNostrEvent(event, expectation)]
			} catch {
				return []
			}
		})
	}
	return []
}

export default {
	source: Source.Primal_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [1],
						})
						if (event == null || event.kind !== 1)
							throw new Error('Primal_Rest: note not found')
						const eventId = normalizeNostrEventId(event.id)
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('Primal_Rest: note event id mismatch')
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
				tags: (note) => note.tags,
				createdAt: (note) => note.createdAt,
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
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [6, 16],
						})
						if (event == null || !isNostrRepostKind(event.kind))
							throw new Error('Primal_Rest: repost not found')
						const eventId = normalizeNostrEventId(event.id)
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('Primal_Rest: repost event id mismatch')
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
				tags: (repost) => repost.tags,
				createdAt: (repost) => repost.createdAt,
				$author: (repost) => repost.$author,
				repostedEventId: (repost) => repost.repostedEventId,
				$repostedNote: (repost) => repost.$repostedNote,
				$repostedArticle: (repost) => repost.$repostedArticle,
			}),

		defineResolver({
			entityType: EntityType.NostrReaction,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [7],
						})
						if (event == null || event.kind !== 7)
							throw new Error('Primal_Rest: reaction not found')
						const eventId = normalizeNostrEventId(event.id)
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('Primal_Rest: reaction event id mismatch')
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
				tags: (reaction) => reaction.tags,
				createdAt: (reaction) => reaction.createdAt,
				$author: (reaction) => reaction.$author,
				$targetArticle: (reaction) => reaction.$targetArticle,
				$targetNote: (reaction) => reaction.$targetNote,
				content: (reaction) => reaction.content,
			}),

		defineResolver({
			entityType: EntityType.NostrArticleEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventId), {
							eventId,
							kinds: [30_023],
						})
						if (event == null)
							throw new Error('Primal_Rest: article event not found')
						return nostrArticleEventFieldValues(event)
					},
				}
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
			entityType: EntityType.NostrArticle,
			resolve: {
				CanonicalCoordinate: {
					resolve: async ({ identifier: identifierSelector, kind, pubkey: pubkeySelector }, context) => {
						const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
						const pubkey = normalizeNostrPubkey(pubkeySelector)
						const identifier = identifierSelector
						if (pubkey == null || identifier === '' || kind !== 30023)
							throw new Error('Primal_Rest: article id invalid')
						const limit = resolverContextRowLimit(context)
						const events = nostrEventsNewestFirst(
							eventsFromTimelineResponse(
								await getProfileArticles(pubkey, limit),
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.filter((noteEvent) => (
								noteEvent.kind === 30023
								&& normalizeNostrPubkey(noteEvent.pubkey) === pubkey
								&& nostrTagValue(noteEvent.tags, 'd') === identifier
								))
						)
						if (events.length === 0)
							throw new Error('Primal_Rest: article not found')
						return {
							kind,
							pubkey,
							identifier,
							$latestEvent: nostrArticleEventReference(events[0]),
							$$events: events.map(nostrArticleEventReference),
						}
					},
				}
			},
		})({
				kind: (article) => article.kind,
				pubkey: (article) => article.pubkey,
				identifier: (article) => article.identifier,
				$latestEvent: (article) => article.$latestEvent,
				$$events: (article) => article.$$events,
			}),

		defineResolver({
			entityType: EntityType.NostrProfileMetadataEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(eventId), {
							eventId,
							kinds: [0],
						})
						if (event == null)
							throw new Error('Primal_Rest: profile metadata event not found')
						return nostrProfileMetadataEventFieldValues(event)
					},
				}
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
				bannerUrl: (event) => event.bannerUrl,
			}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey: pubkeySelector }) => {
						const { getProfile } = await import('$/sources/Primal/Rest/queries.ts')
						const pubkey = normalizeNostrPubkey(pubkeySelector)
						if (pubkey == null)
							throw new Error('Primal_Rest: profile pubkey invalid')
						const events = profileEventsFromResponse(
							await getProfile(pubkey),
							pubkey
						)
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
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { getProfileNotes } = await import('$/sources/Primal/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getProfileNotes(pubkey, limit),
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
				$$notes: (profile) => profile,
			}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { getProfileReposts } = await import('$/sources/Primal/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getProfileReposts(pubkey, limit),
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
				$$reposts: (profile) => profile,
			}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getProfileArticles(pubkey, limit),
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
				$$articles: (profile) => profile,
			}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getNoteActions } = await import('$/sources/Primal/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getNoteActions(eventId, 1, limit),
								{
									kinds: [1],
								}
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
				$$replies: (note) => note,
			}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getNoteActions } = await import('$/sources/Primal/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getNoteActions(eventId, 7, limit),
								{
									kinds: [7],
								}
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
				$$reactions: (note) => note,
			}),

	],
} satisfies RegisteredSourceResolverModule
