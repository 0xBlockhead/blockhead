import { nostrNetworkSeedRelays } from '$/constants/Social/Nostr.ts'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
	optionalTimestampMs,
	timestampMsFromUnixSeconds,
} from '$/lib/time.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	NostrEvent,
	NostrProfileMetadata,
	NostrBandRelayStats,
} from '$/sources/NostrBand/Rest/types.ts'
import type { JsonObject } from '$/typescript/JsonValue.ts'


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

const normalizeRelayUrl = (value: string | undefined) => {
	if (value == null || value === '') return undefined
	try {
		const url = new URL(
			value.includes('://') ?
				value
			:
				`wss://${value}`,
		)
		if (url.protocol !== 'wss:' && url.protocol !== 'ws:') return undefined
		const pathname = url.pathname.replace(/\/$/, '')
		return `wss://${url.host}${pathname}`
	} catch {
		return undefined
	}
}

const profileMetadataFromContent = (content: string | undefined): NostrProfileMetadata | undefined => {
	if (content == null || content === '') return undefined
	try {
		const parsed: NostrProfileMetadata = JSON.parse(content)
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
		&& tag[1] !== '' ?
			[tag[1]]
		:
			[]
	)).at(0)
)

const eTagEventIdsFromTags = (tags: NostrEvent['tags']) => (
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

const eventIdFromETags = (tags: NostrEvent['tags']) => (
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
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		:
			[]
	)).at(0)
	if (markedReply != null) {
		return markedReply
	}
	if (eventIds.length === 0) {
		return undefined
	}
	if (eventIds.length === 1) {
		return eventIds.at(0)
	}
	return eventIds.at(-1)
}

const rootEventIdFromTags = (tags: NostrEvent['tags']) => (
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
								[EntityMetaKey.Id]: {
									pubkey,
									identifier,
								},
							}
			)
		)(
			normalizePubkey(parts.at(1)),
			parts.at(2),
		)
	))(coordinate?.split(':'))
)

const articleRefFromEvent = (event: NostrEvent) => (
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
	metadata: NostrProfileMetadata | undefined,
	profileEvent: NostrEvent | undefined,
) => ({
	...(normalizePubkey(profileEvent?.pubkey) != null && {
		pubkey: normalizePubkey(profileEvent?.pubkey),
	}),
	displayName: optionalNonemptyString(metadata?.display_name ?? metadata?.name),
	about: optionalNonemptyString(metadata?.about),
	nip05: optionalNonemptyString(metadata?.nip05),
	lud16: optionalNonemptyString(metadata?.lud16),
	lud06: optionalNonemptyString(metadata?.lud06),
	website: optionalNonemptyString(metadata?.website),
	...(timestampMsFromUnixSeconds(profileEvent?.created_at) != null && {
		metadataUpdatedAt: timestampMsFromUnixSeconds(profileEvent?.created_at),
	}),
	...((
		iconMedia,
	) => (
		iconMedia != null && {
			$icon: iconMedia,
		}
	))(mediaFromUrl(optionalNonemptyString(metadata?.picture), MediaType.Image)),
	...((
		bannerMedia,
	) => (
		bannerMedia != null && {
			$banner: bannerMedia,
		}
	))(mediaFromUrl(optionalNonemptyString(metadata?.banner), MediaType.Image)),
})

const noteFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	const eventId = normalizeEventId(String(event.id))
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	if (eventId == null) throw new Error('NostrBand_Rest: invalid note event id')
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
	if (!isNostrRepostKind(kind)) throw new Error('NostrBand_Rest: not a repost event')
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	const repostedArticle = articleRefFromAddressableCoordinate(tagValueFromTags(event.tags, 'a'))
	return (
		((repostedEventId) => ({
			...(normalizeEventId(String(event.id)) != null && {
				eventId: normalizeEventId(String(event.id)),
			}),
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
	targetEvent: NostrEvent | undefined,
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
			))(articleRefFromEvent(targetEvent).at(0))
	:
		repostValues
)

const reactionFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	const targetArticle = articleRefFromAddressableCoordinate(tagValueFromTags(event.tags, 'a'))
	const targetEventId = reactionTargetEventIdFromTags(event.tags)
	return {
		...(normalizeEventId(String(event.id)) != null && {
			eventId: normalizeEventId(String(event.id)),
		}),
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
						[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
					}
		))(normalizePubkey(event.pubkey)),
		...(targetArticle != null && {
			$targetArticle: targetArticle,
		}),
			...(targetArticle == null && {
				$targetNote: {
					[EntityMetaKey.Id]: { eventId: targetEventId },
				},
			}),
		content: optionalNonemptyString(event.content),
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
			:
				{
						...reactionValues,
						$targetArticle: targetArticle,
						$targetNote: undefined,
					}
			))(articleRefFromEvent(targetEvent).at(0))
	:
		reactionValues
)

const articlePublishedAtMs = (event: NostrEvent) => (
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

const articleFieldValuesFromEvent = (event: NostrEvent) => {
	const eventPubkey = normalizePubkey(event.pubkey)
	if (eventPubkey == null) throw new Error('NostrBand_Rest: invalid event pubkey')
	return (
		((publishedAt) => ({
			kind: 30023,
			pubkey: eventPubkey,
			...(tagValueFromTags(event.tags, 'd') != null && {
				identifier: tagValueFromTags(event.tags, 'd'),
			}),
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
		:
			(
				(wire.tags as readonly (readonly string[])[])
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
		content: wire.content ?? undefined,
		sig: wire.sig ?? undefined,
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
			:
				`wss://${relay.domain}`
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
		:
			{
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
		:
			profileMetadataFromContent(
				typeof wire?.profile?.content === 'string' ?
					wire.profile.content
				:
					undefined,
			)
	)
)

const relayFieldValuesFromWire = (relay: NostrBandRelayStats) => ({
	name: optionalNonemptyString(relay.name),
	description: optionalNonemptyString(relay.description),
	software: optionalNonemptyString(relay.software),
	version: optionalNonemptyString(relay.version),
	...(
		relay.nips?.length != null && Number.isFinite(relay.nips.length) ?
			{ supportedNipCount: relay.nips.length }
		:
			{}
	),
	...(relay.is_paid === true || relay.paid === true ?
		{ isPaid: true }
	:
		relay.is_paid === false || relay.paid === false ?
			{ isPaid: false }
		:
			{}),
	...(
		relay.limit != null && Number.isFinite(relay.limit) ?
			{ limit: relay.limit }
		:
			{}
	),
})

export default {
	source: Source.NostrBand_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				const profileWire = await singleFlight(getProfileByPubkey)(entityId.pubkey)
				const metadata = profileMetadataFromProfileWire(profileWire)
				if (metadata == null && profileWire.profile == null) {
					throw new Error('NostrBand_Rest: profile not found')
				}
				return profileFieldValuesFromMetadata(
					metadata,
					eventFromWire(profileWire),
				)
			}
			},
			fields: {
				pubkey: (profile) => profile.pubkey,
				displayName: (profile) => profile.displayName,
				about: (profile) => profile.about,
				nip05: (profile) => profile.nip05,
				lud16: (profile) => profile.lud16,
				lud06: (profile) => profile.lud06,
				website: (profile) => profile.website,
				metadataUpdatedAt: (profile) => profile.metadataUpdatedAt,
				$icon: (profile) => profile.$icon,
				$banner: (profile) => profile.$banner,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
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
			}
			},
			fields: {
				eventId: (note) => note.eventId,
				kind: (note) => note.kind,
				pubkey: (note) => note.pubkey,
				content: (note) => note.content,
				createdAt: (note) => note.createdAt,
				tags: (note) => note.tags,
				$author: (note) => note.$author,
				replyToEventId: (note) => note.replyToEventId,
				rootEventId: (note) => note.rootEventId,
				$replyToNote: (note) => note.$replyToNote,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrRelay,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
				const relayUrl = normalizeRelayUrl(entityId.relayUrl)
				if (relayUrl == null) {
					throw new Error('NostrBand_Rest: relay url invalid')
				}
				const relay = (
					((await singleFlight(listTopRelays)(100)).relays ?? [])
						.find((relay) => relayUrlFromWire(relay) === relayUrl)
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
			}
			},
			fields: {
				name: (relay) => relay.name,
				description: (relay) => relay.description,
				software: (relay) => relay.software,
				version: (relay) => relay.version,
				supportedNipCount: (relay) => relay.supportedNipCount,
				isPaid: (relay) => relay.isPaid,
				limit: (relay) => relay.limit,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrRepost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || !isNostrRepostKind(event.kind)) {
					throw new Error('NostrBand_Rest: repost not found')
				}
				const eventId = normalizeEventId(String(event.id))
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('NostrBand_Rest: repost event id mismatch')
				}
				const values = repostFieldValuesFromEvent(event)
				if (values.$repostedNote == null) return values
				const targetEventId = values.$repostedNote[EntityMetaKey.Id].eventId
				return repostFieldValuesFromTargetEvent(
					values,
					eventFromWire(await singleFlight(getEventById)(targetEventId)),
				)
			}
			},
			fields: {
				eventId: (repost) => repost.eventId,
				kind: (repost) => repost.kind,
				pubkey: (repost) => repost.pubkey,
				createdAt: (repost) => repost.createdAt,
				tags: (repost) => repost.tags,
				repostedEventId: (repost) => repost.repostedEventId,
				$author: (repost) => repost.$author,
				$repostedNote: (repost) => repost.$repostedNote,
				$repostedArticle: (repost) => repost.$repostedArticle,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrReaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
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
			}
			},
			fields: {
				eventId: (reaction) => reaction.eventId,
				kind: (reaction) => reaction.kind,
				pubkey: (reaction) => reaction.pubkey,
				createdAt: (reaction) => reaction.createdAt,
				tags: (reaction) => reaction.tags,
				$author: (reaction) => reaction.$author,
				$targetNote: (reaction) => reaction.$targetNote,
				$targetArticle: (reaction) => reaction.$targetArticle,
				content: (reaction) => reaction.content,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrArticle,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listAuthorArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const pubkey = normalizePubkey(entityId.pubkey)
				const identifier = entityId.identifier
				if (pubkey == null || identifier === '') {
					throw new Error('NostrBand_Rest: article id invalid')
				}
				const limit = resolverContextRowLimit(context)
				const event = (
					((await singleFlight(listAuthorArticles)(pubkey, limit)).events ?? [])
						.find((noteEvent) => (
								noteEvent.kind === 30023
								&& normalizePubkey(noteEvent.pubkey) === pubkey
								&& (
									(
										Array.isArray(noteEvent.tags)
										&& noteEvent.tags.find((tag) => (
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
			}
			},
			fields: {
				pubkey: (article) => article.pubkey,
				identifier: (article) => article.identifier,
				kind: (article) => article.kind,
				title: (article) => article.title,
				summary: (article) => article.summary,
				imageUrl: (article) => article.imageUrl,
				content: (article) => article.content,
				publishedAt: (article) => article.publishedAt,
				tags: (article) => article.tags,
				$author: (article) => article.$author,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listTopProfiles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listTopProfiles)(limit)).profiles ?? [])
						.flatMap((topProfile) => {
							const pubkey = normalizePubkey(topProfile.pubkey ?? (
								typeof topProfile.profile?.pubkey === 'string' ?
									topProfile.profile.pubkey
								:
									undefined
							))
							if (pubkey == null) return []
							return [{
								[EntityMetaKey.Id]: { pubkey },
							}]
						})
				)
			}
			},
			fields: {
				$$nostrProfiles: (profiles) => profiles,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listRecentTextNotes } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listRecentTextNotes)(limit)).events ?? [])
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
			}
			},
			fields: {
				$$nostrNotes: (notes) => notes,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listTopRelays)(limit)).relays ?? [])
						.flatMap((relay) => {
							const relayUrl = relayUrlFromWire(relay)
							if (relayUrl == null) return []
							return [{
								[EntityMetaKey.Id]: { relayUrl: relayUrl },
							}]
						})
				)
			}
			},
			fields: {
				$$nostrRelays: (relays) => relays,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listRecentReposts } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listRecentReposts)(limit)).events ?? [])
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
			}
			},
			fields: {
				$$nostrReposts: (reposts) => reposts,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listRecentArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listRecentArticles)(limit)).events ?? [])
						.flatMap((event) => articleRefFromEvent(event))
				)
			}
			},
			fields: {
				$$nostrArticles: (articles) => articles,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listAuthorTextNotes } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listAuthorTextNotes)(entityId.pubkey, limit)).events ?? [])
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
			}
			},
			fields: {
				$$notes: (notes) => notes,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listAuthorArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listAuthorArticles)(entityId.pubkey, limit)).events ?? [])
						.flatMap((event) => articleRefFromEvent(event))
				)
			}
			},
			fields: {
				$$articles: (articles) => articles,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listAuthorReposts } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listAuthorReposts)(entityId.pubkey, limit)).events ?? [])
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
			}
			},
			fields: {
				$$reposts: (reposts) => reposts,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				const metadata = profileMetadataFromProfileWire(
					await singleFlight(getProfileByPubkey)(entityId.pubkey),
				)
				return optionalNonemptyString(
				metadata?.website,
			)
			}
			},
			fields: {
				website: (website) => website,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrProfile,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				const metadata = profileMetadataFromProfileWire(
					await singleFlight(getProfileByPubkey)(entityId.pubkey),
				)
			return mediaFromUrl(
					optionalNonemptyString(
					metadata?.banner,
				),
				MediaType.Image,
			)
			}
			},
			fields: {
				$banner: (banner) => banner,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listNoteReplies } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listNoteReplies)(entityId.eventId, limit)).events ?? [])
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
			}
			},
			fields: {
				$$replies: (replies) => replies,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listNoteReactions } = await import('$/sources/NostrBand/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listNoteReactions)(entityId.eventId, limit)).events ?? [])
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
			}
			},
			fields: {
				$$reactions: (reactions) => reactions,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNote,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('NostrBand_Rest: note not found for reply target')
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
			}
			},
			fields: {
				$replyToNote: (replyToNote) => replyToNote,
			},
		}),
	],
}
