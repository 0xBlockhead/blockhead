import { nostrNetworkSeedRelays } from '$/constants/Social/Nostr.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	NostrEvent,
	NostrProfileMetadata,
	NostrBandRelayStats,
} from '$/sources/NostrBand/Rest/types.ts'
import type { JsonObject } from '$/typescript/JsonValue.ts'

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

const normalizeRelayUrl = (value: string | undefined) => {
	const trimmed = value?.trim()
	if (trimmed == null || trimmed === '') return undefined
	try {
		const url = new URL(
			trimmed.includes('://') ?
				trimmed
			:	`wss://${trimmed}`,
		)
		if (url.protocol !== 'wss:' && url.protocol !== 'ws:') return undefined
		const pathname = url.pathname.replace(/\/$/, '')
		return `wss://${url.host}${pathname}`
	} catch {
		return undefined
	}
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

const profileMetadataFromContent = (content: string | undefined): NostrProfileMetadata | undefined => {
	const trimmed = content?.trim()
	if (trimmed == null || trimmed === '') return undefined
	try {
		const parsed: NostrProfileMetadata = JSON.parse(trimmed)
		return parsed
	} catch {
		return undefined
	}
}

const tagValueFromTags = (
	tags: NostrEvent['tags'],
	tagName: string,
) => (
	tags?.flatMap((tag) => (
		tag[0] === tagName
		&& tag[1] != null
		&& tag[1].trim() !== '' ?
			[tag[1].trim()]
		:		[]
	))[0]
)

const eTagEventIdsFromTags = (tags: NostrEvent['tags']) => (
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

const eventIdFromETags = (tags: NostrEvent['tags']) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e' && tag[1] != null ?
			[normalizeEventId(tag[1])]
		:		[]
	))
		.flatMap((eventId) => (
			eventId == null ?
				[]
			:		[eventId]
		))[0]
)

const reactionTargetEventIdFromTags = (tags: NostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	if (eventIds.length === 0) {
		throw new Error('NostrBand_Rest: no event IDs found in tags')
	}
	return eventIds[eventIds.length - 1]
}

const replyToEventIdFromTags = (tags: NostrEvent['tags']) => {
	const eventIds = eTagEventIdsFromTags(tags)
	const markedReply = tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& tag[1] != null
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		:	[]
	))[0]
	if (markedReply != null) {
		return markedReply
	}
	if (eventIds.length === 0) {
		throw new Error('NostrBand_Rest: no event IDs found in tags for reply')
	}
	if (eventIds.length === 1) {
		return eventIds[0]
	}
	return eventIds[eventIds.length - 1]
}

const rootEventIdFromTags = (tags: NostrEvent['tags']) => (
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
		:		[]
	))[0])
)

const isNostrRepostKind = (kind: number | undefined): kind is 6 | 16 => (
	kind === 6 || kind === 16
)

const articleRefFromAddressableCoordinate = (coordinate: string | undefined) => (
	((parts) => (
		parts == null || parts[0] !== '30023' ?
			undefined
		:		(
				(pubkey, identifier) => (
					pubkey == null || identifier == null || identifier === '' ?
						undefined
					:		{
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

const articleRefFromEvent = (event: NostrEvent) => (
	event.kind !== 30023 ?
		[]
	:		(
			(pubkey, identifier) => (
				pubkey == null || identifier == null ?
					[]
				:		[
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
	metadata: NostrProfileMetadata | undefined,
	profileEvent: NostrEvent | undefined,
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

const noteFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Nostr: invalid event pubkey')
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
			:				{
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

const repostFieldValuesFromEvent = (event: NostrEvent) => {
	const kind = event.kind
	if (!isNostrRepostKind(kind)) throw new Error('Nostr: not a repost event')
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Nostr: invalid event pubkey')
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
			:				{
						[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
					}
		))(normalizePubkey(event.pubkey)),
			...(repostedEventId != null && {
				repostedEventId,
				$repostedNote: {
					[EntityMetaKey.Id]: { eventId: repostedEventId },
				},
			}),
		}))(eventIdFromETags(event.tags))
	)
}

const reactionFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Nostr: invalid event pubkey')
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
			:				{
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
	targetEvent: NostrEvent | undefined,
) => (
	reactionValues.$targetArticle != null || targetEvent == null ?
		reactionValues
	: targetEvent.kind === 30023 ?
		((targetArticle) => (
			targetArticle == null ?
				reactionValues
			:		{
						...reactionValues,
						$targetArticle: targetArticle,
						$targetNote: undefined,
					}
		))(articleRefFromEvent(targetEvent)[0])
	:
		reactionValues
)

const articlePublishedAtMs = (event: NostrEvent) => (
	((publishedAtTag) => (
		publishedAtTag == null ?
			nostrCreatedAtMs(event.created_at)
		:		(
				Number.isFinite(Number(publishedAtTag)) ?
					Number(publishedAtTag) * 1000
				:			optionalTimestampMs(publishedAtTag)
			)
	))(tagValueFromTags(event.tags, 'published_at'))
)

const articleFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('Nostr: invalid event pubkey')
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
				:					{
							[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
						}
			))(normalizePubkey(event.pubkey)),
		}))(articlePublishedAtMs(event))
	)
}

const eventFromJsonObject = (wire: JsonObject | undefined): NostrEvent | undefined => {
	if (wire == null) return undefined
	if (typeof wire.id !== 'string') return undefined
	if (typeof wire.pubkey !== 'string') return undefined
	if (typeof wire.created_at !== 'number') return undefined
	if (typeof wire.kind !== 'number') return undefined
	if (typeof wire.content !== 'string' && wire.content !== null) return undefined
	if (typeof wire.sig !== 'string' && wire.sig !== null) return undefined

	const tags = (
		wire.tags == null ?
			undefined
		:	(
				wire.tags
					.flatMap((tag) => (
						Array.isArray(tag) ?
							[
								tag
									.flatMap((value) => (
										typeof value === 'string' && value !== '' ?
											[value]
										:
											[]
									)),
							]
						:
							[]
					))
					.filter((tag) => tag.length > 0)
			)
	)

	return {
		id: wire.id,
		pubkey: wire.pubkey,
		created_at: wire.created_at,
		kind: wire.kind,
		tags,
		content: wire.content,
		sig: wire.sig,
	}
}

const eventFromWire = (wire: {
	event?: JsonObject
	events?: JsonObject[]
	profile?: JsonObject
} | undefined) => (
	eventFromJsonObject(
		wire?.event
		?? wire?.events?.[0]
		?? wire?.profile,
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
			:		`wss://${relay.domain}`
		),
	)
)

const profileMetadataFromProfileWire = (wire: {
	metadata?: JsonObject
	profile?: JsonObject
} | undefined) => (
	((metadata) => (
		metadata == null ?
			undefined
		:		{
				name: typeof metadata.name === 'string' ? metadata.name : undefined,
				display_name: typeof metadata.display_name === 'string' ? metadata.display_name : undefined,
				about: typeof metadata.about === 'string' ? metadata.about : undefined,
				picture: typeof metadata.picture === 'string' ? metadata.picture : undefined,
				banner: typeof metadata.banner === 'string' ? metadata.banner : undefined,
				website: typeof metadata.website === 'string' ? metadata.website : undefined,
				nip05: typeof metadata.nip05 === 'string' ? metadata.nip05 : undefined,
				lud16: typeof metadata.lud16 === 'string' ? metadata.lud16 : undefined,
				lud06: typeof metadata.lud06 === 'string' ? metadata.lud06 : undefined,
			}
	))(wire?.metadata)
	?? (
		wire?.profile?.kind != null && wire.profile.kind !== 0 ?
			undefined
		:	profileMetadataFromContent(
				typeof wire?.profile?.content === 'string' ?
					wire.profile.content
				:		undefined,
			)
	)
)

const relayFieldValuesFromWire = (relay: NostrBandRelayStats) => ({
	name: optionalTrimmedString(relay.name),
	description: optionalTrimmedString(relay.description),
	software: optionalTrimmedString(relay.software),
	version: optionalTrimmedString(relay.version),
	...(
		relay.nips?.length != null && Number.isFinite(relay.nips.length) ?
			{ supportedNipCount: relay.nips.length }
		:		{}
	),
	...(relay.is_paid === true || relay.paid === true ?
		{ isPaid: true }
	:		relay.is_paid === false || relay.paid === false ?
			{ isPaid: false }
		:		{}),
	...(
		relay.limit != null && Number.isFinite(relay.limit) ?
			{ limit: relay.limit }
		:		{}
	),
})

export default {
	source: Source.NostrBand_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NostrProfile,
			resolve: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				const d = await singleFlight(getProfileByPubkey)(entityId.pubkey)
				const metadata = profileMetadataFromProfileWire(d)
				if (metadata == null && d.profile == null) {
					throw new Error('NostrBand_Rest: profile not found')
				}
				return profileFieldValuesFromMetadata(
					metadata,
					eventFromWire(d),
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrNote,
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('NostrBand_Rest: note not found')
				}
				const eventId = normalizeEventId(String(event.id))
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('NostrBand_Rest: note event id mismatch')
				}
				return noteFieldValuesFromEvent(event)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrRelay,
			resolve: async (entityId, context) => {
				const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
				const relayUrl = normalizeRelayUrl(entityId.relayUrl)
				if (relayUrl == null) {
					throw new Error('NostrBand_Rest: relay url invalid')
				}
				const relay = (
					((await singleFlight(listTopRelays)(100)).relays ?? [])
						.find((row) => relayUrlFromWire(row) === relayUrl)
				)
				if (relay != null) {
					return relayFieldValuesFromWire(relay)
				}
				if (
					nostrNetworkSeedRelays.some((seedRelay) => (
						normalizeRelayUrl(seedRelay.relayUrl) === relayUrl
					))
				) {
					return {
						name: relayUrl.replace(/^wss:\/\//i, ''),
					}
				}
				throw new Error('NostrBand_Rest: relay not found')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrRepost,
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || !isNostrRepostKind(event.kind)) {
					throw new Error('NostrBand_Rest: repost not found')
				}
				const eventId = normalizeEventId(String(event.id))
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('NostrBand_Rest: repost event id mismatch')
				}
				return repostFieldValuesFromEvent(event)
			},
		}),

			defineEntityResolver({
				entityType: EntityType.NostrReaction,
				resolve: async (entityId, context) => {
					const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
					const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
					if (event == null || event.kind !== 7) {
						throw new Error('NostrBand_Rest: reaction not found')
					}
					const eventId = normalizeEventId(String(event.id))
					if (eventId == null || eventId !== entityId.eventId) {
						throw new Error('NostrBand_Rest: reaction event id mismatch')
					}
				const values = reactionFieldValuesFromEvent(event)
				if (values.$targetNote == null) return values
				const targetEventId = values.$targetNote[EntityMetaKey.Id].eventId
				return reactionFieldValuesFromTargetEvent(
					values,
					eventFromWire(await singleFlight(getEventById)(targetEventId)),
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrArticle,
			resolve: async (entityId, context) => {
				const { listAuthorArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const pubkey = normalizePubkey(entityId.pubkey)
				const identifier = entityId.identifier.trim()
				if (pubkey == null || identifier === '') {
					throw new Error('NostrBand_Rest: article id invalid')
				}
				const limit = resolverLoadSubsetRowLimit(context)
				const event = (
					((await singleFlight(listAuthorArticles)(pubkey, limit)).events ?? [])
						.find((row) => (
							row.kind === 30023
							&& normalizePubkey(row.pubkey) === pubkey
                            && (
                                (
                                    Array.isArray(row.tags)
                                    && row.tags.find((tag) => (
                                        Array.isArray(tag)
                                        && tag[0] === 'd'
                                        && tag[1] === identifier
                                    ))
                                )
                                ?? false
                            )
						))
				)
				if (event == null) {
					throw new Error('NostrBand_Rest: article not found')
				}
				return articleFieldValuesFromEvent(event)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrProfiles',
			resolve: async (_entityId, context) => {
				const { listTopProfiles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listTopProfiles)(limit)).profiles ?? [])
						.flatMap((row) => {
							const pubkey = normalizePubkey(row.pubkey ?? (
								typeof row.profile?.pubkey === 'string' ?
									row.profile.pubkey
								:			undefined
							))
							if (pubkey == null) return []
							return [{
								[EntityMetaKey.Id]: { pubkey },
							}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrNotes',
			resolve: async (_entityId, context) => {
				const { listRecentTextNotes } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listRecentTextNotes)(limit)).events ?? [])
						.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:						[
														{
															[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
														},
													]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrRelays',
			resolve: async (_entityId, context) => {
				const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listTopRelays)(limit)).relays ?? [])
						.flatMap((row) => {
							const rowRelayUrl = relayUrlFromWire(row)
							if (rowRelayUrl == null) return []
							return [{
								[EntityMetaKey.Id]: { relayUrl: rowRelayUrl },
							}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrReposts',
			resolve: async (_entityId, context) => {
				const { listRecentReposts } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listRecentReposts)(limit)).events ?? [])
						.flatMap((event) => (
							!isNostrRepostKind(event.kind) || normalizeEventId(event.id) == null ?
								[]
							:						[
														{
															[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
														},
													]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrArticles',
			resolve: async (_entityId, context) => {
				const { listRecentArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listRecentArticles)(limit)).events ?? [])
						.flatMap((event) => articleRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$$notes',
			resolve: async (entityId, context) => {
				const { listAuthorTextNotes } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listAuthorTextNotes)(entityId.pubkey, limit)).events ?? [])
						.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:						[
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
				const { listAuthorArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listAuthorArticles)(entityId.pubkey, limit)).events ?? [])
						.flatMap((event) => articleRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$$reposts',
			resolve: async (entityId, context) => {
				const { listAuthorReposts } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listAuthorReposts)(entityId.pubkey, limit)).events ?? [])
						.flatMap((event) => (
							!isNostrRepostKind(event.kind) || normalizeEventId(event.id) == null ?
								[]
							:						[
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
			fieldName: 'website',
			resolve: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				const metadata = profileMetadataFromProfileWire(
					await singleFlight(getProfileByPubkey)(entityId.pubkey),
				)
			return optionalTrimmedString(
				metadata?.website,
			)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$banner',
			resolve: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				const metadata = profileMetadataFromProfileWire(
					await singleFlight(getProfileByPubkey)(entityId.pubkey),
				)
			return mediaFromUrl(
				optionalTrimmedString(
					metadata?.banner,
				),
				MediaType.Image,
			)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { listNoteReplies } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listNoteReplies)(entityId.eventId, limit)).events ?? [])
						.flatMap((event) => (
							event.kind !== 1 || normalizeEventId(event.id) == null ?
								[]
							:						[
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
				const { listNoteReactions } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listNoteReactions)(entityId.eventId, limit)).events ?? [])
						.flatMap((event) => (
							event.kind !== 7 || normalizeEventId(event.id) == null ?
								[]
							:		[
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
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('NostrBand_Rest: note not found for reply target')
				}
				const normalizedReplyTo = replyToEventIdFromTags(event.tags)
				return (
					normalizedReplyTo == null ?
						undefined
					:			{
								[EntityMetaKey.Id]: { eventId: normalizedReplyTo },
							}
				)
			},
		}),
	],
}
