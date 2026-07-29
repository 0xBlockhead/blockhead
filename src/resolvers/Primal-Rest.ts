import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	optionalTimestampMs,
	timestampMsFromUnixSeconds,
} from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import type {
	PrimalNostrEvent,
} from '$/sources/Primal/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { isJsonObject } from '$/typescript/JsonValue.ts'
import {
	type NostrEventExpectation,
	validateNostrEvent,
	validatedNostrEventFromContent,
} from '$/sources/NostrRelay/Nip01/event.ts'


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

const optionalUrlString = (value: string | undefined) => (
	value != null && UrlString.allows(value) ? value : undefined
)

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
	const eventIds = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] !== 'mention' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).filter((eventId) => eventId != null) ?? []
	const markedReply = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).at(0)
	if (markedReply != null)
		return markedReply
	const markedRoot = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[3] === 'root' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).at(0)
	if (markedRoot != null)
		return markedRoot
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
				?? tags?.flatMap((tag) => (
					tag[0] === 'e'
					&& tag[3] !== 'mention' ?
						[normalizeEventId(tag[1])]
					:
						[]
				)).filter((eventId) => eventId != null).at(0)
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
			sensitive: event.tags?.some((tag) => tag[0] === 'content-warning') === true,
			contentWarning: optionalNonemptyString(tagValueFromTags(event.tags, 'content-warning')),
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
			...(rootEventId != null && {
				$rootNote: {
					[EntityMetaKey.Selector]: { eventId: rootEventId },
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
				...(kind === 6 && {
					$repostedNote: {
						[EntityMetaKey.Selector]: { eventId: repostedEventId },
					},
				}),
			}),
		}))(eventIdFromETags(event.tags))
	)
}

const repostFieldValuesFromTargetEvent = (
	repostValues: ReturnType<typeof repostFieldValuesFromEvent>,
	targetEvent: PrimalNostrEvent | undefined
) => (
	repostValues.kind === 6 || targetEvent == null ?
		repostValues
	:
		targetEvent.kind === 1 ?
			{
				...repostValues,
				$repostedNote: {
					[EntityMetaKey.Selector]: { eventId: targetEvent.id },
				},
			}
		: targetEvent.kind === 30023 ?
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
		content: optionalNonemptyString(event.content),
	}
}

const reactionFieldValuesFromTargetEvent = (
	reactionValues: ReturnType<typeof reactionFieldValuesFromEvent>,
	targetEvent: PrimalNostrEvent | undefined
) => (
	targetEvent?.kind === 1 ?
		{
			...reactionValues,
			$targetNote: {
				[EntityMetaKey.Selector]: { eventId: targetEvent.id },
			},
		}
	: targetEvent?.kind === 30023 ?
		((targetArticle) => (
			targetArticle == null ?
				reactionValues
			:
				{
					...reactionValues,
					$targetArticle: targetArticle,
				}
		))(articleRefFromEvent(targetEvent).at(0))
	:
		reactionValues
)

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
			sensitive: event.tags?.some((tag) => tag[0] === 'content-warning') === true,
			contentWarning: optionalNonemptyString(tagValueFromTags(event.tags, 'content-warning')),
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

type ValidatedNostrEvent = ReturnType<typeof validateNostrEvent>

const versionEventsNewestFirst = (events: ValidatedNostrEvent[]) => (
	[...new Map(events.map((event) => [event.id, event])).values()]
		.sort((left, right) => (
			right.created_at - left.created_at
			|| right.id.localeCompare(left.id)
		))
)

const articleEventFieldValuesFromEvent = (event: ValidatedNostrEvent) => {
	const article = articleFieldValuesFromEvent(event)
	const createdAt = timestampMsFromUnixSeconds(event.created_at)
	if (createdAt == null)
		throw new Error('Primal_Rest: incomplete article event')

	return {
		eventId: event.id,
		$article: {
			[EntityMetaKey.Selector]: {
				kind: article.kind,
				pubkey: article.pubkey,
				identifier: article.identifier,
			},
		},
		...article,
		createdAt,
		signature: event.sig,
		$author: {
			[EntityMetaKey.Selector]: { pubkey: event.pubkey },
		},
	}
}

const articleEventReference = (event: ValidatedNostrEvent) => ({
	[EntityMetaKey.Selector]: { eventId: event.id },
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(articleEventFieldValuesFromEvent(event)).map(([field, value]) => [
			entityFieldAddressKey(EntityType.NostrArticleEvent, [], field),
			value,
		])
	),
})

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
			lud06: optionalNonemptyString(
				typeof parsed.lud06 === 'string' ?
					parsed.lud06
				:
					undefined
			),
		}
	} catch {
		return {}
	}
}

const profileEventsFromResponse = (
	response: JsonValue | undefined,
	pubkey: string
) => versionEventsNewestFirst(
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

const profileMetadataEventFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const eventId = normalizeEventId(event.id)
	const pubkey = normalizePubkey(event.pubkey)
	const createdAt = timestampMsFromUnixSeconds(event.created_at)
	if (eventId == null || pubkey == null || createdAt == null || event.sig == null || event.content == null)
		throw new Error('Primal_Rest: incomplete profile metadata event')
	const metadata = parseKind0Metadata(event.content)

	return {
		eventId,
		$profile: {
			[EntityMetaKey.Selector]: { pubkey },
		},
		pubkey,
		kind: 0,
		createdAt,
		signature: event.sig,
		content: event.content,
		...(event.tags != null && { tags: event.tags }),
		...(metadata.displayName != null && { displayName: metadata.displayName }),
		...(metadata.about != null && { about: metadata.about }),
		...(metadata.nip05 != null && { nip05: metadata.nip05 }),
		...(metadata.lud16 != null && { lud16: metadata.lud16 }),
		...(metadata.lud06 != null && { lud06: metadata.lud06 }),
		...(optionalUrlString(metadata.website) != null && { website: optionalUrlString(metadata.website) }),
		...((iconUrl) => (
			iconUrl == null ?
				{}
			:
				{
					iconUrl,
					$icon: mediaFromUrl(iconUrl, MediaType.Image),
				}
		))(optionalUrlString(metadata.picture)),
		...((bannerUrl) => (
			bannerUrl == null ?
				{}
			:
				{
					bannerUrl,
					$banner: mediaFromUrl(bannerUrl, MediaType.Image),
				}
		))(optionalUrlString(metadata.banner)),
	}
}

const profileMetadataEventReference = (event: ValidatedNostrEvent) => ({
	[EntityMetaKey.Selector]: { eventId: event.id },
	[EntityMetaKey.Fields]: Object.fromEntries(
		Object.entries(profileMetadataEventFieldValuesFromEvent(event)).map(([field, value]) => [
			entityFieldAddressKey(EntityType.NostrProfileMetadataEvent, [], field),
			value,
		])
	),
})

const profileEventFromWire = (wire: JsonValue | undefined): PrimalNostrEvent | undefined => {
	if (wire == null || !isJsonObject(wire)) return undefined
	if (
		typeof wire.id === 'string'
		&& wire.kind === 0
	) return validateNostrEvent(wire, { kinds: [0] })
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
): ValidatedNostrEvent[] => {
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
		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const event = eventFromWire(await getEventById(publicEnv, eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [1],
						})
						if (event == null || event.kind !== 1)
							throw new Error('Primal_Rest: note not found')
						const eventId = normalizeEventId(event.id)
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('Primal_Rest: note event id mismatch')
						return noteFieldValuesFromEvent(event)
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrRepost,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const event = eventFromWire(await getEventById(publicEnv, eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [6, 16],
						})
						if (event == null || !isNostrRepostKind(event.kind))
							throw new Error('Primal_Rest: repost not found')
						const eventId = normalizeEventId(event.id)
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('Primal_Rest: repost event id mismatch')
						const values = repostFieldValuesFromEvent(event)
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
							targetEvent = eventFromWire(await getEventById(publicEnv, targetEventId), {
								eventId: targetEventId,
							})
						} catch {
							targetEvent = embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						}
						targetEvent ??= embeddedTargetEvent?.id === targetEventId ? embeddedTargetEvent : undefined
						return repostFieldValuesFromTargetEvent(
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrReaction,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId: eventIdSelector }, context) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const event = eventFromWire(await getEventById(publicEnv, eventIdSelector), {
							eventId: eventIdSelector,
							kinds: [7],
						})
						if (event == null || event.kind !== 7)
							throw new Error('Primal_Rest: reaction not found')
						const eventId = normalizeEventId(event.id)
						if (eventId == null || eventId !== eventIdSelector)
							throw new Error('Primal_Rest: reaction event id mismatch')
						const values = reactionFieldValuesFromEvent(event)
						const targetEventId = reactionTargetEventIdFromTags(event.tags)
						let targetEvent
						try {
							targetEvent = eventFromWire(await getEventById(publicEnv, targetEventId), {
								eventId: targetEventId,
							})
						} catch {
							targetEvent = undefined
						}
						return reactionFieldValuesFromTargetEvent(
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrArticleEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(context.publicEnv, eventId), {
							eventId,
							kinds: [30_023],
						})
						if (event == null)
							throw new Error('Primal_Rest: article event not found')
						return articleEventFieldValuesFromEvent(event)
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrArticle,
			resolve: {
				CanonicalCoordinate: {
					resolve: async ({ identifier: identifierSelector, kind, pubkey: pubkeySelector }, context) => {
						const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const pubkey = normalizePubkey(pubkeySelector)
						const identifier = identifierSelector
						if (pubkey == null || identifier === '' || kind !== 30023)
							throw new Error('Primal_Rest: article id invalid')
						const limit = resolverContextRowLimit(context)
						const events = versionEventsNewestFirst(
							eventsFromTimelineResponse(
								await getProfileArticles(publicEnv, pubkey, limit),
								{
									pubkey,
									kinds: [30_023],
								}
							)
								.filter((noteEvent) => (
								noteEvent.kind === 30023
								&& normalizePubkey(noteEvent.pubkey) === pubkey
								&& tagValueFromTags(noteEvent.tags, 'd') === identifier
								))
						)
						if (events.length === 0)
							throw new Error('Primal_Rest: article not found')
						return {
							kind,
							pubkey,
							identifier,
							$latestEvent: articleEventReference(events[0]),
							$$events: events.map(articleEventReference),
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfileMetadataEvent,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const event = eventFromWire(await getEventById(context.publicEnv, eventId), {
							eventId,
							kinds: [0],
						})
						if (event == null)
							throw new Error('Primal_Rest: profile metadata event not found')
						return profileMetadataEventFieldValuesFromEvent(event)
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

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey: pubkeySelector }, context) => {
						const { getProfile } = await import('$/sources/Primal/Rest/queries.ts')
						const pubkey = normalizePubkey(pubkeySelector)
						if (pubkey == null)
							throw new Error('Primal_Rest: profile pubkey invalid')
						const events = profileEventsFromResponse(
							await getProfile(context.publicEnv, pubkey),
							pubkey
						)
						return {
							pubkey,
							$latestMetadataEvent: (
								events.length === 0 ?
									undefined
								:
									profileMetadataEventReference(events[0])
							),
							$$metadataEvents: events.map(profileMetadataEventReference),
						}
					},
				}
			},
		})({
				pubkey: (profile) => profile.pubkey,
				$latestMetadataEvent: (profile) => profile.$latestMetadataEvent,
				$$metadataEvents: (profile) => profile.$$metadataEvents,
			}),
		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { getProfileNotes } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getProfileNotes(publicEnv, pubkey, limit),
								{
									pubkey,
									kinds: [1],
								}
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
					},
				}
			},
		})({
				$$notes: (profile) => profile,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { getProfileReposts } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getProfileReposts(publicEnv, pubkey, limit),
								{
									pubkey,
									kinds: [6, 16],
								}
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
					},
				}
			},
		})({
				$$reposts: (profile) => profile,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrProfile,
			resolve: {
				CanonicalPubkey: {
					resolve: async ({ pubkey }, context) => {
						const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getProfileArticles(publicEnv, pubkey, limit),
								{
									pubkey,
									kinds: [30_023],
								}
						)
								.flatMap((event) => articleRefFromEvent(event))
						)
					},
				}
			},
		})({
				$$articles: (profile) => profile,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getNoteReplies } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getNoteReplies(publicEnv, eventId, limit),
								{
									kinds: [1],
								}
					)
								.flatMap((event) => (
								event.kind !== 1
									|| normalizeEventId(event.id) == null
									|| replyToEventIdFromTags(event.tags) !== eventId ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: { eventId: normalizeEventId(event.id)! },
										},
									]
								))
						)
					},
				}
			},
		})({
				$$replies: (note) => note,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getNoteReactions } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const limit = resolverContextRowLimit(context)
						return (
							eventsFromTimelineResponse(
								await getNoteReactions(publicEnv, eventId, limit),
								{
									kinds: [7],
								}
					)
								.flatMap((event) => (
								event.kind !== 7
									|| normalizeEventId(event.id) == null
									|| reactionTargetEventIdFromTags(event.tags) !== eventId ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: { eventId: normalizeEventId(event.id)! },
										},
									]
								))
						)
					},
				}
			},
		})({
				$$reactions: (note) => note,
			}),

		defineResolver(Source.Primal_Rest, {
			entityType: EntityType.NostrNote,
			resolve: {
				CanonicalEventId: {
					resolve: async ({ eventId }, context) => {
						const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const event = eventFromWire(await getEventById(publicEnv, eventId), {
							eventId,
							kinds: [1],
						})
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
					},
				}
			},
		})({
				$replyToNote: (note) => note,
			}),
	],
}
