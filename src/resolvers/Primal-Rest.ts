import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	nostrNetworkSeedNotes,
	nostrNetworkSeedProfiles,
} from '$/constants/Social/Nostr.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	optionalTimestampMs,
	timestampMsFromUnixSeconds,
} from '$/lib/time.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	PrimalNostrEvent,
} from '$/sources/Primal/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { isJsonObject } from '$/typescript/JsonValue.ts'
import { NostrProfileSelector } from '$/schema/NostrProfile.ts'
import { NostrNoteSelector } from '$/schema/NostrNote.ts'
import { NostrRelaySelector } from '$/schema/NostrRelay.ts'
import { NostrRepostSelector } from '$/schema/NostrRepost.ts'
import { NostrReactionSelector } from '$/schema/NostrReaction.ts'
import { NostrArticleSelector } from '$/schema/NostrArticle.ts'
import { _GlobalNostrNetworkSelector } from '$/schema/_GlobalNostrNetwork.ts'


const normalizePubkey = (value: string | undefined | null) => {
	const normalized = value?.toLowerCase()
	return (
		normalized != null && normalized !== '' && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const normalizeEventId = (value: string | undefined | null) => {
	const normalized = value?.toLowerCase()
	return (
		normalized != null && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const tagValueFromTags = (
	tags: PrimalNostrEvent['tags'],
	tagName: string
) => (
	tags?.flatMap((tag) => (
		tag[0] === tagName
		&& tag[1] !== '' ?
			[tag[1]]
		:
			[]
	)).at(0)
)

const eTagEventIdsFromTags = (tags: PrimalNostrEvent['tags']) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e' ?
			(
				((eventId) => (
					eventId != null ?
						[eventId]
					:
						[]
				))(normalizeEventId(tag[1]))
			)
		:
			[]
	))
	?? []
)

const eventIdFromETags = (tags: PrimalNostrEvent['tags']) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e' ?
			[normalizeEventId(tag[1])]
		:
			[]
	))
		.flatMap((eventId) => (
			eventId == null ?
				[]
			:
				[eventId]
		)).at(0)
)

const reactionTargetEventIdFromTags = (tags: PrimalNostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	if (eventIds.length === 0)
		throw new Error('Primal_Rest: no event IDs found in tags')
	return eventIds[eventIds.length - 1]
}

const replyToEventIdFromTags = (tags: PrimalNostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	const markedReply = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).at(0)
	if (markedReply != null)
		return markedReply
	if (eventIds.length === 0)
		return undefined
	if (eventIds.length === 1)
		return eventIds.at(0)
	return eventIds.at(-1)
}

const rootEventIdFromTags = (tags: PrimalNostrEvent['tags']) => (
	(
		(markedRoot) => (
				markedRoot
				?? eTagEventIdsFromTags(tags).at(0)
		)
	)(tags?.flatMap((tag) => (
			tag[0] === 'e'
			&& tag[3] === 'root' ?
				[normalizeEventId(tag[1])]
			:
				[]
	)).at(0))
)

const isNostrRepostKind = (kind: number | undefined): kind is 6 | 16 => (
	kind === 6 || kind === 16
)

const articleRefFromAddressableCoordinate = (coordinate: string | undefined) => (
	((parts) => (
		parts == null || parts.at(0) !== '30023' ?
			undefined
		:
			(
			(pubkey, identifier) => (
					pubkey == null || identifier == null || identifier === '' ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: {
								kind: 30023,
								pubkey,
								identifier,
							},
						}
			)
			)(
				normalizePubkey(parts.at(1)),
				parts.at(2)
		)
	))(coordinate?.split(':'))
)

const articleRefFromEvent = (event: PrimalNostrEvent) => (
	event.kind !== 30023 ?
		[]
	:
		(
		(pubkey, identifier) => (
				pubkey == null || identifier == null ?
					[]
				:
					[
						{
							[EntityMetaKey.Selector]: {
								kind: 30023,
								pubkey,
								identifier,
							},
						},
					]
		)
		)(
			normalizePubkey(event.pubkey),
			tagValueFromTags(event.tags, 'd')
		)
)

const noteFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	const eventId = normalizeEventId(String(event.id))
	if (eventPubkey == null) throw new Error('Primal_Rest: invalid event pubkey')
	if (eventId == null) throw new Error('Primal_Rest: invalid note event id')
	return (
		((replyToEventId, rootEventId) => ({
			eventId,
			kind: 1,
			pubkey: eventPubkey,
			content: optionalNonemptyString(event.content),
			...(event.tags != null && { tags: event.tags }),
			...(timestampMsFromUnixSeconds(event.created_at) != null && {
				createdAt: timestampMsFromUnixSeconds(event.created_at),
			}),
			$author: ((normalizedPubkey) => (
				normalizedPubkey == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: { pubkey: normalizedPubkey },
					}
			))(normalizePubkey(event.pubkey)),
			...(replyToEventId != null && {
				replyToEventId,
			}),
			...(rootEventId != null && {
				rootEventId,
			}),
			...(replyToEventId != null && {
				$replyToNote: {
					[EntityMetaKey.Selector]: { eventId: replyToEventId },
				},
			}),
		}))(replyToEventIdFromTags(event.tags), rootEventIdFromTags(event.tags))
	)
}

const repostFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const kind = event.kind
	if (!isNostrRepostKind(kind)) throw new Error('Primal_Rest: not a repost event')
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Primal_Rest: invalid event pubkey')
	const eventId = normalizeEventId(String(event.id))
	if (eventId == null) throw new Error('Primal_Rest: invalid repost event id')
	const repostedArticle = articleRefFromAddressableCoordinate(tagValueFromTags(event.tags, 'a'))
	return (
		((repostedEventId) => ({
			eventId,
			kind,
			pubkey: eventPubkey,
			...(event.tags != null && { tags: event.tags }),
			...(timestampMsFromUnixSeconds(event.created_at) != null && {
				createdAt: timestampMsFromUnixSeconds(event.created_at),
			}),
			$author: ((normalizedPubkey) => (
				normalizedPubkey == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: { pubkey: normalizedPubkey },
					}
			))(normalizePubkey(event.pubkey)),
			...(repostedEventId != null && {
				repostedEventId,
				...(repostedArticle == null && {
					$repostedNote: {
						[EntityMetaKey.Selector]: { eventId: repostedEventId },
					},
				}),
			}),
			...(repostedArticle != null && {
				$repostedArticle: repostedArticle,
			}),
		}))(eventIdFromETags(event.tags))
	)
}

const repostFieldValuesFromTargetEvent = (
	repostValues: ReturnType<typeof repostFieldValuesFromEvent>,
	targetEvent: PrimalNostrEvent | undefined
) => (
	repostValues.$repostedArticle != null || targetEvent == null ?
		repostValues
	:
		targetEvent.kind === 30023 ?
			((repostedArticle) => (
			repostedArticle == null ?
				repostValues
			:
				{
					...repostValues,
					$repostedArticle: repostedArticle,
					$repostedNote: undefined,
				}
			))(articleRefFromEvent(targetEvent).at(0))
		:
			repostValues
)

const reactionFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Primal_Rest: invalid event pubkey')
	const eventId = normalizeEventId(String(event.id))
	if (eventId == null) throw new Error('Primal_Rest: invalid reaction event id')
	const targetArticle = articleRefFromAddressableCoordinate(tagValueFromTags(event.tags, 'a'))
	const targetEventId = reactionTargetEventIdFromTags(event.tags)

	return {
		eventId,
		kind: 7,
		pubkey: eventPubkey,
		...(event.tags != null && { tags: event.tags }),
		...(timestampMsFromUnixSeconds(event.created_at) != null && {
			createdAt: timestampMsFromUnixSeconds(event.created_at),
		}),
		$author: ((normalizedPubkey) => (
			normalizedPubkey == null ?
				undefined
			:
				{
					[EntityMetaKey.Selector]: { pubkey: normalizedPubkey },
				}
		))(normalizePubkey(event.pubkey)),
		...(targetArticle != null && {
			$targetArticle: targetArticle,
		}),
		...(targetArticle == null && {
			$targetNote: {
				[EntityMetaKey.Selector]: { eventId: targetEventId },
			},
		}),
		content: optionalNonemptyString(event.content),
	}
}

const articlePublishedAtMs = (event: PrimalNostrEvent) => (
	((publishedAtTag) => (
		publishedAtTag == null ?
			timestampMsFromUnixSeconds(event.created_at)
		:
			(
				Number.isFinite(Number(publishedAtTag)) ?
					Number(publishedAtTag) * 1000
				:
					optionalTimestampMs(publishedAtTag)
			)
	))(tagValueFromTags(event.tags, 'published_at'))
)

const articleFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Primal_Rest: invalid event pubkey')
	const identifier = tagValueFromTags(event.tags, 'd')
	if (identifier == null)
		throw new Error('Primal_Rest: article missing identifier')

	return (
		((publishedAt) => ({
			kind: 30023,
			pubkey: eventPubkey,
			identifier,
			title: optionalNonemptyString(tagValueFromTags(event.tags, 'title')),
			summary: optionalNonemptyString(tagValueFromTags(event.tags, 'summary')),
			imageUrl: optionalNonemptyString(tagValueFromTags(event.tags, 'image')),
			content: optionalNonemptyString(event.content),
			...(event.tags != null && { tags: event.tags }),
			...(publishedAt != null && { publishedAt }),
			$author: ((normalizedPubkey) => (
				normalizedPubkey == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: { pubkey: normalizedPubkey },
					}
			))(normalizePubkey(event.pubkey)),
		}))(articlePublishedAtMs(event))
	)
}

const parseKind0Metadata = (content: string | undefined) => {
	if (content == null || content === '') return {}
	try {
		const parsed: JsonValue = JSON.parse(content)
		if (!isJsonObject(parsed)) return {}
		return {
			displayName: optionalNonemptyString(
				typeof parsed.display_name === 'string' ?
					parsed.display_name
				:
					typeof parsed.name === 'string' ?
						parsed.name
					:
						undefined
			),
			about: optionalNonemptyString(
				typeof parsed.about === 'string' ?
					parsed.about
				:
					undefined
			),
			picture: optionalNonemptyString(
				typeof parsed.picture === 'string' ?
					parsed.picture
				:
					undefined
			),
			banner: optionalNonemptyString(
				typeof parsed.banner === 'string' ?
					parsed.banner
				:
					undefined
			),
			website: optionalNonemptyString(
				typeof parsed.website === 'string' ?
					parsed.website
				:
					undefined
			),
			nip05: optionalNonemptyString(
				typeof parsed.nip05 === 'string' ?
					parsed.nip05
				:
					undefined
			),
			lud16: optionalNonemptyString(
				typeof parsed.lud16 === 'string' ?
					parsed.lud16
				:
					undefined
			),
		}
	} catch {
		return {}
	}
}

const profileEventFromWire = (wire: JsonValue | undefined): PrimalNostrEvent | undefined => {
	if (wire == null || !isJsonObject(wire)) return undefined
	if (
		typeof wire.id === 'string'
		&& wire.kind === 0
	) {
		const event: PrimalNostrEvent = {
			id: wire.id,
			pubkey: typeof wire.pubkey === 'string' ? wire.pubkey : undefined,
			kind: 0,
			content: typeof wire.content === 'string' ? wire.content : undefined,
			created_at: typeof wire.created_at === 'number' ? wire.created_at : undefined,
			tags: Array.isArray(wire.tags) ? wire.tags.map((tag) => (
				Array.isArray(tag) ? tag.map((t) => String(t)) : []
			))
			:
				undefined,
			sig: typeof wire.sig === 'string' ? wire.sig : undefined,
		}
		return event
	}
	if (wire.metadata != null) return profileEventFromWire(wire.metadata)
	if (wire.profile != null) return profileEventFromWire(wire.profile)
	if (wire.user != null) return profileEventFromWire(wire.user)
	return undefined
}

const noteEventFromWire = (wire: JsonValue | undefined): PrimalNostrEvent | undefined => {
	if (wire == null || !isJsonObject(wire)) return undefined
	if (typeof wire.id !== 'string') return undefined
	if (wire.event != null) return noteEventFromWire(wire.event)
	if (wire.note != null) return noteEventFromWire(wire.note)
	const event: PrimalNostrEvent = {
		id: wire.id,
		pubkey: typeof wire.pubkey === 'string' ? wire.pubkey : undefined,
		kind: typeof wire.kind === 'number' ? wire.kind : undefined,
		content: typeof wire.content === 'string' ? wire.content : undefined,
		created_at: typeof wire.created_at === 'number' ? wire.created_at : undefined,
		tags: Array.isArray(wire.tags) ? wire.tags.map((tag) => (
			Array.isArray(tag) ? tag.map((t) => String(t)) : []
		))
		:
			undefined,
		sig: typeof wire.sig === 'string' ? wire.sig : undefined,
	}
	return event
}

const eventFromWire = (wire: JsonValue | undefined) => (
	((nostrEventWire) => (
		nostrEventWire == null ?
			undefined
		:
			noteEventFromWire(isJsonObject(nostrEventWire) ? nostrEventWire.event ?? nostrEventWire : undefined)
	))(wire)
)

const eventsFromTimelineResponse = (response: JsonValue | undefined): PrimalNostrEvent[] => {
	if (Array.isArray(response))
		return response.flatMap((noteEvent) => (
			((event) => (
				event == null ?
					[]
				:
					[event]
			))(noteEventFromWire(noteEvent))
		))
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
		return noteEvents.flatMap((noteEvent) => (
			((event) => (
				event == null ?
					[]
				:
					[event]
			))(noteEventFromWire(noteEvent))
		))
	}
	return []
}

export default {
	source: Source.Primal_Rest,

	resolvers: [
		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				[NostrNoteSelector.CanonicalEventId]: async ({ eventId: eventIdSelector }, context) => {
					const seedNote = nostrNetworkSeedNotes.find((note) => note.eventId === eventIdSelector)
					if (seedNote != null)
						return {
							eventId: seedNote.eventId,
							kind: 1,
							pubkey: seedNote.pubkey,
							content: seedNote.content,
							createdAt: seedNote.createdAt,
							tags: [],
							$author: {
								[EntityMetaKey.Selector]: {
									pubkey: seedNote.pubkey,
								},
							},
							replyToEventId: undefined,
							rootEventId: undefined,
							$replyToNote: undefined,
						}

					const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const event = eventFromWire(await getEventById(publicEnv, eventIdSelector))
					if (event == null || event.kind !== 1)
						throw new Error('Primal_Rest: note not found')
					const eventId = normalizeEventId(event.id)
					if (eventId == null || eventId !== eventIdSelector)
						throw new Error('Primal_Rest: note event id mismatch')
					return noteFieldValuesFromEvent(event)
				}
			},
		})({
				eventId: (note) => note.eventId,
				kind: (note) => note.kind,
				pubkey: (note) => note.pubkey,
				content: (note) => note.content,
				tags: (note) => note.tags,
				createdAt: (note) => note.createdAt,
				$author: (note) => note.$author,
				replyToEventId: (note) => note.replyToEventId,
				rootEventId: (note) => note.rootEventId,
				$replyToNote: (note) => note.$replyToNote,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrRepost,
			resolve: {
				[NostrRepostSelector.CanonicalEventId]: async ({ eventId: eventIdSelector }, context) => {
					const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const event = eventFromWire(await getEventById(publicEnv, eventIdSelector))
					if (event == null || !isNostrRepostKind(event.kind))
						throw new Error('Primal_Rest: repost not found')
					const eventId = normalizeEventId(event.id)
					if (eventId == null || eventId !== eventIdSelector)
						throw new Error('Primal_Rest: repost event id mismatch')
					const values = repostFieldValuesFromEvent(event)
					if (values.$repostedNote == null) return values
					const targetEventId = values.$repostedNote[EntityMetaKey.Selector].eventId
					return repostFieldValuesFromTargetEvent(
						values,
						eventFromWire(await getEventById(publicEnv, targetEventId))
					)
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrReaction,
			resolve: {
				[NostrReactionSelector.CanonicalEventId]: async ({ eventId: eventIdSelector }, context) => {
					const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const event = eventFromWire(await getEventById(publicEnv, eventIdSelector))
					if (event == null || event.kind !== 7)
						throw new Error('Primal_Rest: reaction not found')
					const eventId = normalizeEventId(event.id)
					if (eventId == null || eventId !== eventIdSelector)
						throw new Error('Primal_Rest: reaction event id mismatch')
					return reactionFieldValuesFromEvent(event)
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrArticle,
			resolve: {
				[NostrArticleSelector.CanonicalCoordinate]: async ({ identifier: identifierSelector, kind, pubkey: pubkeySelector }, context) => {
					const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const pubkey = normalizePubkey(pubkeySelector)
					const identifier = identifierSelector
					if (pubkey == null || identifier === '' || kind !== 30023)
						throw new Error('Primal_Rest: article id invalid')
					const limit = resolverContextRowLimit(context)
					const event = (
						eventsFromTimelineResponse(
							await getProfileArticles(publicEnv, pubkey, limit)
					)
							.find((noteEvent) => (
							noteEvent.kind === 30023
							&& normalizePubkey(noteEvent.pubkey) === pubkey
							&& tagValueFromTags(noteEvent.tags, 'd') === identifier
							))
					)
					if (event == null)
						throw new Error('Primal_Rest: article not found')
					return articleFieldValuesFromEvent(event)
				}
			},
		})({
				kind: (article) => article.kind,
				pubkey: (article) => article.pubkey,
				identifier: (article) => article.identifier,
				title: (article) => article.title,
				summary: (article) => article.summary,
				imageUrl: (article) => article.imageUrl,
				content: (article) => article.content,
				tags: (article) => article.tags,
				publishedAt: (article) => article.publishedAt,
				$author: (article) => article.$author,
			}),
		defineResolver(Source.Primal_Rest, {
			entityType: EntityType._GlobalNostrNetwork,
			resolve: {
				[_GlobalNostrNetworkSelector.Scope]: async () => (
					nostrNetworkSeedProfiles.map((seedProfile) => ({
						[EntityMetaKey.Selector]: seedProfile,
					}))
				)
			},
		})({
				$$observedProfiles: (network) => network,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				[NostrProfileSelector.CanonicalPubkey]: async ({ pubkey }, context) => {
					const { getProfileNotes } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						eventsFromTimelineResponse(
							await getProfileNotes(publicEnv, pubkey, limit)
					)
							.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: { eventId: normalizeEventId(event.id)! },
									},
								]
							))
					)
				}
			},
		})({
				$$notes: (profile) => profile,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				[NostrProfileSelector.CanonicalPubkey]: async ({ pubkey }, context) => {
					const { getProfileReposts } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						eventsFromTimelineResponse(
							await getProfileReposts(publicEnv, pubkey, limit)
					)
							.flatMap((event) => (
							!isNostrRepostKind(event.kind) || normalizeEventId(event.id) == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: { eventId: normalizeEventId(event.id)! },
									},
								]
							))
					)
				}
			},
		})({
				$$reposts: (profile) => profile,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				[NostrProfileSelector.CanonicalPubkey]: async ({ pubkey }, context) => {
					const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						eventsFromTimelineResponse(
							await getProfileArticles(publicEnv, pubkey, limit)
					)
							.flatMap((event) => articleRefFromEvent(event))
					)
				}
			},
		})({
				$$articles: (profile) => profile,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				[NostrNoteSelector.CanonicalEventId]: async ({ eventId }, context) => {
					if (nostrNetworkSeedNotes.some((note) => note.eventId === eventId))
						return []

					const { getNoteReplies } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						eventsFromTimelineResponse(
							await getNoteReplies(publicEnv, eventId, limit)
					)
							.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: { eventId: normalizeEventId(event.id)! },
									},
								]
							))
					)
				}
			},
		})({
				$$replies: (note) => note,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				[NostrNoteSelector.CanonicalEventId]: async ({ eventId }, context) => {
					if (nostrNetworkSeedNotes.some((note) => note.eventId === eventId))
						return []

					const { getNoteReactions } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						eventsFromTimelineResponse(
							await getNoteReactions(publicEnv, eventId, limit)
					)
							.flatMap((event) => (
							event.kind !== 7 || normalizeEventId(event.id) == null ?
								[]
							:
								[
									{
										[EntityMetaKey.Selector]: { eventId: normalizeEventId(event.id)! },
									},
								]
							))
					)
				}
			},
		})({
				$$reactions: (note) => note,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				[NostrNoteSelector.CanonicalEventId]: async ({ eventId }, context) => {
					if (nostrNetworkSeedNotes.some((note) => note.eventId === eventId))
						return undefined

					const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const event = eventFromWire(await getEventById(publicEnv, eventId))
					if (event == null || event.kind !== 1)
						throw new Error('Primal_Rest: note not found for reply target')
					const normalizedReplyTo = replyToEventIdFromTags(event.tags)
					return (
						normalizedReplyTo == null ?
							undefined
						:
							{
								[EntityMetaKey.Selector]: { eventId: normalizedReplyTo },
							}
					)
				}
			},
		})({
				$replyToNote: (note) => note,
			}),
	],
}
