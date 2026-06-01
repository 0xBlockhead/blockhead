import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { nostrNetworkSeedProfiles } from '$/constants/Social/Nostr.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	PrimalNostrEvent,
	PrimalNostrProfileMetadata,
} from '$/sources/Primal/Rest/types.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import { isJsonObject } from '$/typescript/JsonValue.ts'

const optionalTrimmedString = (value: string | undefined | null) => (
	value?.trim() || undefined
)

const normalizePubkey = (value: string | undefined | null) => {
	const normalized = value?.trim().toLowerCase()
	return (
		normalized != null && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const normalizeEventId = (value: string | undefined | null) => {
	const normalized = value?.trim().toLowerCase()
	return (
		normalized != null && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const nostrCreatedAtMs = (createdAt: number | undefined) => (
	createdAt != null && Number.isFinite(createdAt) ?
		createdAt * 1000
	:
		undefined
)

const optionalTimestampMs = (value: string | undefined) => (
	((parsed) => (
		Number.isFinite(parsed) ? parsed : undefined
	))(Date.parse(value ?? ''))
)

const profileMetadataFromContent = (content: string | undefined): PrimalNostrProfileMetadata | undefined => {
	const trimmed = content?.trim()
	if (trimmed == null || trimmed === '') return undefined
	try {
		const parsed: PrimalNostrProfileMetadata = JSON.parse(trimmed)
		return parsed
	} catch {
		return undefined
	}
}

const tagValueFromTags = (
	tags: PrimalNostrEvent['tags'],
	tagName: string,
) => (
	tags?.flatMap((tag) => (
		tag[0] === tagName
		&& tag[1] != null
		&& tag[1].trim() !== '' ?
			[tag[1].trim()]
		:
			[]
	))[0]
)

const eTagEventIdsFromTags = (tags: PrimalNostrEvent['tags']) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e' && tag[1] != null ?
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
		tag[0] === 'e' && tag[1] != null ?
			[normalizeEventId(tag[1])]
		:
			[]
	))
		.flatMap((eventId) => (
			eventId == null ?
				[]
			:
				[eventId]
		))[0]
)

const reactionTargetEventIdFromTags = (tags: PrimalNostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	if (eventIds.length === 0) {
		throw new Error('Primal_Rest: no event IDs found in tags')
	}
	return eventIds[eventIds.length - 1]
}

const replyToEventIdFromTags = (tags: PrimalNostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	const markedReply = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[1] != null
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		:
			[]
	))[0]
	if (markedReply != null) {
		return markedReply
	}
	if (eventIds.length === 0) {
		throw new Error('Primal_Rest: no event IDs found in tags for reply')
	}
	if (eventIds.length === 1) {
		return eventIds[0]
	}
	return eventIds[eventIds.length - 1]
}

const rootEventIdFromTags = (tags: PrimalNostrEvent['tags']) => (
	(
		(markedRoot) => (
			markedRoot
			?? eTagEventIdsFromTags(tags)[0]
		)
	)(tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[1] != null
		&& tag[3] === 'root' ?
			[normalizeEventId(tag[1])]
		:
			[]
	))[0])
)

const isNostrRepostKind = (kind: number | undefined): kind is 6 | 16 => (
	kind === 6 || kind === 16
)

const articleRefFromAddressableCoordinate = (coordinate: string | undefined) => (
	((parts) => (
		parts == null || parts[0] !== '30023' ?
			undefined
		:
			(
				(pubkey, identifier) => (
					pubkey == null || identifier == null || identifier === '' ?
						undefined
					:
						{
								[EntityMetaKey.Id]: {
									pubkey,
									identifier,
								},
							}
				)
			)(
				normalizePubkey(parts[1]),
				parts[2]?.trim(),
			)
	))(coordinate?.trim().split(':'))
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
								[EntityMetaKey.Id]: {
									pubkey,
									identifier,
								},
							},
						]
			)
		)(
			normalizePubkey(event.pubkey),
			tagValueFromTags(event.tags, 'd'),
		)
)

const profileFieldValuesFromMetadata = (
	metadata: PrimalNostrProfileMetadata | undefined,
	profileEvent: PrimalNostrEvent | undefined,
) => ({
	displayName: optionalTrimmedString(metadata?.display_name ?? metadata?.name),
	about: optionalTrimmedString(metadata?.about),
	nip05: optionalTrimmedString(metadata?.nip05),
	lud16: optionalTrimmedString(metadata?.lud16),
	lud06: optionalTrimmedString(metadata?.lud06),
	website: optionalTrimmedString(metadata?.website),
	...(nostrCreatedAtMs(profileEvent?.created_at) != null && {
		metadataUpdatedAt: nostrCreatedAtMs(profileEvent?.created_at),
	}),
	...((
		iconMedia,
	) => (
		iconMedia != null && {
			$icon: iconMedia,
		}
	))(mediaFromUrl(optionalTrimmedString(metadata?.picture), MediaType.Image)),
	...((
		bannerMedia,
	) => (
		bannerMedia != null && {
			$banner: bannerMedia,
		}
	))(mediaFromUrl(optionalTrimmedString(metadata?.banner), MediaType.Image)),
})

const noteFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Primal_Rest: invalid event pubkey')
	return (
		((replyToEventId, rootEventId) => ({
			kind: 1,
			pubkey: eventPubkey,
			content: optionalTrimmedString(event.content),
			...(event.tags != null && { tags: event.tags }),
			...(nostrCreatedAtMs(event.created_at) != null && {
				createdAt: nostrCreatedAtMs(event.created_at),
			}),
			$author: ((normalizedPubkey) => (
			normalizedPubkey == null ?
				undefined
			:
				{
						[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
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
					[EntityMetaKey.Id]: { eventId: replyToEventId },
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
	const repostedArticle = articleRefFromAddressableCoordinate(tagValueFromTags(event.tags, 'a'))
	return (
		((repostedEventId) => ({
			kind,
			pubkey: eventPubkey,
			...(event.tags != null && { tags: event.tags }),
			...(nostrCreatedAtMs(event.created_at) != null && {
				createdAt: nostrCreatedAtMs(event.created_at),
			}),
			$author: ((normalizedPubkey) => (
			normalizedPubkey == null ?
				undefined
			:
				{
						[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
					}
		))(normalizePubkey(event.pubkey)),
			...(repostedEventId != null && {
				repostedEventId,
				...(repostedArticle == null && {
					$repostedNote: {
						[EntityMetaKey.Id]: { eventId: repostedEventId },
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
	targetEvent: PrimalNostrEvent | undefined,
) => (
	repostValues.$repostedArticle != null || targetEvent == null ?
		repostValues
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
		))(articleRefFromEvent(targetEvent)[0])
	:
		repostValues
)

const reactionFieldValuesFromEvent = (event: PrimalNostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Primal_Rest: invalid event pubkey')
	const targetArticle = articleRefFromAddressableCoordinate(tagValueFromTags(event.tags, 'a'))
	const targetEventId = reactionTargetEventIdFromTags(event.tags)
	return {
		kind: 7,
		pubkey: eventPubkey,
		...(event.tags != null && { tags: event.tags }),
		...(nostrCreatedAtMs(event.created_at) != null && {
			createdAt: nostrCreatedAtMs(event.created_at),
		}),
		$author: ((normalizedPubkey) => (
			normalizedPubkey == null ?
				undefined
			:
				{
						[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
					}
		))(normalizePubkey(event.pubkey)),
		...(targetArticle != null && {
			$targetArticle: targetArticle,
		}),
		...(targetEventId != null && targetArticle == null && {
			$targetNote: {
				[EntityMetaKey.Id]: { eventId: targetEventId },
			},
		}),
		content: optionalTrimmedString(event.content),
	}
}

const reactionFieldValuesFromTargetEvent = (
	reactionValues: ReturnType<typeof reactionFieldValuesFromEvent>,
	targetEvent: PrimalNostrEvent | undefined,
) => (
	reactionValues.$targetArticle != null || targetEvent == null ?
		reactionValues
	: targetEvent.kind === 30023 ?
		((targetArticle) => (
			targetArticle == null ?
				reactionValues
			:
				{
						...reactionValues,
						$targetArticle: targetArticle,
						$targetNote: undefined,
					}
		))(articleRefFromEvent(targetEvent)[0])
	:
		reactionValues
)

const articlePublishedAtMs = (event: PrimalNostrEvent) => (
	((publishedAtTag) => (
		publishedAtTag == null ?
			nostrCreatedAtMs(event.created_at)
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
	return (
		((publishedAt) => ({
			kind: 30023,
			pubkey: eventPubkey,
			title: optionalTrimmedString(tagValueFromTags(event.tags, 'title')),
			summary: optionalTrimmedString(tagValueFromTags(event.tags, 'summary')),
			imageUrl: optionalTrimmedString(tagValueFromTags(event.tags, 'image')),
			content: optionalTrimmedString(event.content),
			...(event.tags != null && { tags: event.tags }),
			...(publishedAt != null && { publishedAt }),
			$author: ((normalizedPubkey) => (
				normalizedPubkey == null ?
					undefined
				:
					{
							[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
						}
			))(normalizePubkey(event.pubkey)),
		}))(articlePublishedAtMs(event))
	)
}

const parseKind0Metadata = (content: string | undefined) => {
	if (content == null || content.trim() === '') return {}
	try {
		const parsed: JsonValue = JSON.parse(content)
		if (!isJsonObject(parsed)) return {}
		return {
			displayName: optionalTrimmedString(
				typeof parsed.display_name === 'string' ?
					parsed.display_name
				:					typeof parsed.name === 'string' ?
						parsed.name
						:
							undefined,
			),
			about: optionalTrimmedString(
				typeof parsed.about === 'string' ?
					parsed.about
				:
					undefined,
			),
			picture: optionalTrimmedString(
				typeof parsed.picture === 'string' ?
					parsed.picture
				:
					undefined,
			),
			banner: optionalTrimmedString(
				typeof parsed.banner === 'string' ?
					parsed.banner
				:
					undefined,
			),
			website: optionalTrimmedString(
				typeof parsed.website === 'string' ?
					parsed.website
				:
					undefined,
			),
			nip05: optionalTrimmedString(
				typeof parsed.nip05 === 'string' ?
					parsed.nip05
				:
					undefined,
			),
			lud16: optionalTrimmedString(
				typeof parsed.lud16 === 'string' ?
					parsed.lud16
				:
					undefined,
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
				Array.isArray(tag) ? tag.map((t) => String(t))
				:
					[]
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
			Array.isArray(tag) ? tag.map((t) => String(t))
			:
				[]
		))
		:
			undefined,
		sig: typeof wire.sig === 'string' ? wire.sig : undefined,
	}
	return event
}

const eventFromWire = (wire: JsonValue | undefined) => (
	((record) => (
		record == null ?
			undefined
		:
			noteEventFromWire(isJsonObject(record) ? record.event ?? record : undefined)
	))(wire)
)

const eventsFromTimelineResponse = (response: JsonValue | undefined): PrimalNostrEvent[] => {
	if (Array.isArray(response)) {
		return response.flatMap((noteEvent) => (
			((event) => (
				event == null ?
					[]
				:
					[event]
			))(noteEventFromWire(noteEvent))
		))
	}
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NostrProfile,
			resolve: async (entityId, context) => {
				const { getProfile } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const wire = await singleFlight(getProfile)(publicEnv, entityId.pubkey)
				const event = profileEventFromWire(wire)
				if (event == null) throw new Error('Primal_Rest: profile not found')
				const pubkey = normalizePubkey(event.pubkey ?? entityId.pubkey)
				if (pubkey == null || pubkey !== entityId.pubkey) {
					throw new Error('Primal_Rest: profile pubkey mismatch')
				}
				const metadata = profileMetadataFromContent(event.content)
				return profileFieldValuesFromMetadata(
					metadata,
					event,
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrNote,
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(publicEnv, entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('Primal_Rest: note not found')
				}
				const eventId = normalizeEventId(event.id)
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('Primal_Rest: note event id mismatch')
				}
				return noteFieldValuesFromEvent(event)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrRelay,
			resolve: async () => {
				throw new Error('Primal_Rest: NostrRelay is unsupported')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrRepost,
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(publicEnv, entityId.eventId))
				if (event == null || !isNostrRepostKind(event.kind)) {
					throw new Error('Primal_Rest: repost not found')
				}
				const eventId = normalizeEventId(event.id)
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('Primal_Rest: repost event id mismatch')
				}
				const values = repostFieldValuesFromEvent(event)
				if (values.$repostedNote == null) return values
				const targetEventId = values.$repostedNote[EntityMetaKey.Id].eventId
				return repostFieldValuesFromTargetEvent(
					values,
					eventFromWire(await singleFlight(getEventById)(publicEnv, targetEventId)),
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrReaction,
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(publicEnv, entityId.eventId))
				if (event == null || event.kind !== 7) {
					throw new Error('Primal_Rest: reaction not found')
				}
				const eventId = normalizeEventId(event.id)
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('Primal_Rest: reaction event id mismatch')
				}
				const values = reactionFieldValuesFromEvent(event)
				if (values.$targetNote != null && values.$targetArticle == null) {
					const targetEvent = eventFromWire(
						await singleFlight(getEventById)(
							publicEnv,
							values.$targetNote[EntityMetaKey.Id].eventId,
						),
					)
					return reactionFieldValuesFromTargetEvent(values, targetEvent)
				}
				return values
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrArticle,
			resolve: async (entityId, context) => {
				const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const pubkey = normalizePubkey(entityId.pubkey)
				const identifier = entityId.identifier.trim()
				if (pubkey == null || identifier === '') {
					throw new Error('Primal_Rest: article id invalid')
				}
				const limit = resolverLoadSubsetRowLimit(context)
				const event = (
					eventsFromTimelineResponse(
						await singleFlight(getProfileArticles)(publicEnv, pubkey, limit),
					)
						.find((noteEvent) => (
							noteEvent.kind === 30023
							&& normalizePubkey(noteEvent.pubkey) === pubkey
							&& tagValueFromTags(noteEvent.tags, 'd') === identifier
						))
				)
				if (event == null) {
					throw new Error('Primal_Rest: article not found')
				}
				return articleFieldValuesFromEvent(event)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrProfiles',
			resolve: async () => (
				nostrNetworkSeedProfiles.map((seedProfile) => ({
					[EntityMetaKey.Id]: seedProfile,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrNotes',
			resolve: async () => {
				throw new Error('Primal_Rest: $$nostrNotes is unsupported; use NostrProfile.$$notes')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrReposts',
			resolve: async () => {
				throw new Error('Primal_Rest: $$nostrReposts is unsupported; use NostrProfile.$$reposts')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrArticles',
			resolve: async () => {
				throw new Error('Primal_Rest: $$nostrArticles is unsupported; use NostrProfile.$$articles')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$$notes',
			resolve: async (entityId, context) => {
				const { getProfileNotes } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					eventsFromTimelineResponse(
						await singleFlight(getProfileNotes)(publicEnv, entityId.pubkey, limit),
					)
						.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:
								[
														{
															[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
														},
													]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$$reposts',
			resolve: async (entityId, context) => {
				const { getProfileReposts } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					eventsFromTimelineResponse(
						await singleFlight(getProfileReposts)(publicEnv, entityId.pubkey, limit),
					)
						.flatMap((event) => (
							!isNostrRepostKind(event.kind) || normalizeEventId(event.id) == null ?
								[]
							:
								[
														{
															[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
														},
													]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$$articles',
			resolve: async (entityId, context) => {
				const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					eventsFromTimelineResponse(
						await singleFlight(getProfileArticles)(publicEnv, entityId.pubkey, limit),
					)
						.flatMap((event) => articleRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { getNoteReplies } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					eventsFromTimelineResponse(
						await singleFlight(getNoteReplies)(publicEnv, entityId.eventId, limit),
					)
						.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:
								[
														{
															[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
														},
													]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$$reactions',
			resolve: async (entityId, context) => {
				const { getNoteReactions } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					eventsFromTimelineResponse(
						await singleFlight(getNoteReactions)(publicEnv, entityId.eventId, limit),
					)
						.flatMap((event) => (
							event.kind !== 7 || normalizeEventId(event.id) == null ?
								[]
							:
								[
										{
											[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
										},
									]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$replyToNote',
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(publicEnv, entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('Primal_Rest: note not found for reply target')
				}
				const normalizedReplyTo = replyToEventIdFromTags(event.tags)
				return (
					normalizedReplyTo == null ?
						undefined
					:
						{
							[EntityMetaKey.Id]: { eventId: normalizedReplyTo },
						}
				)
			},
		}),
	],
}
