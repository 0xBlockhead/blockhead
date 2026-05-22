import { nostrNetworkSeedRelays } from '$/constants/Social/Nostr.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	NostrBandEventWire,
	NostrBandProfileMetadataWire,
	NostrBandRelayWire,
} from '$/sources/NostrBand/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const optionalFiniteNumber = (value: number | undefined) => (
	value != null && Number.isFinite(value) ?
		value
	:
		undefined
)

const normalizePubkey = (value: string | undefined) => {
	const normalized = value?.trim().toLowerCase()
	return (
		normalized != null && /^[0-9a-f]{64}$/.test(normalized) ?
			normalized
		:
			undefined
	)
}

const normalizeEventId = (value: string | undefined) => {
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

const profileMetadataFromContent = (content: string | undefined): NostrBandProfileMetadataWire | undefined => {
	const trimmed = content?.trim()
	if (trimmed == null || trimmed === '') return undefined
	try {
		return JSON.parse(trimmed) as NostrBandProfileMetadataWire
	} catch {
		return undefined
	}
}

const eventFromWire = (wire: { event?: NostrBandEventWire, events?: NostrBandEventWire[] } | undefined) => (
	wire?.event ?? wire?.events?.[0]
)

const tagValueFromTags = (tags: string[][] | undefined, tagName: string) => (
	tags?.flatMap((tag) => (
		tag[0] === tagName
		&& typeof tag[1] === 'string'
		&& tag[1].trim() !== '' ?
			[tag[1].trim()]
		: []
	))[0]
)

const eventIdFromETags = (tags: string[][] | undefined) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e' && typeof tag[1] === 'string' ?
			[normalizeEventId(tag[1])]
		: []
	))
		.flatMap((eventId) => (
			eventId == null ?
				[]
			:	[eventId]
		))[0]
)

const replyToEventIdFromTags = (tags: string[][] | undefined) => (
	tags?.flatMap((tag) => (
		tag[0] === 'e'
		&& typeof tag[1] === 'string'
		&& tag[3] === 'reply' ?
			[normalizeEventId(tag[1])]
		: []
	))[0]
)

const profileRefFromPubkey = (pubkey: string | undefined) => (
	((normalizedPubkey) => (
		normalizedPubkey == null ?
			undefined
		:	{
				[EntityMetaKey.Id]: { pubkey: normalizedPubkey },
			}
	))(normalizePubkey(pubkey))
)

const noteRefFromEvent = (event: NostrBandEventWire) => (
	event.kind !== 1 || normalizeEventId(event.id) == null ?
		[]
	:	[
			{
				[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
			},
		]
)

const repostRefFromEvent = (event: NostrBandEventWire) => (
	event.kind !== 6 || normalizeEventId(event.id) == null ?
		[]
	:	[
			{
				[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
			},
		]
)

const reactionRefFromEvent = (event: NostrBandEventWire) => (
	event.kind !== 7 || normalizeEventId(event.id) == null ?
		[]
	:	[
			{
				[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
			},
		]
)

const articleRefFromEvent = (event: NostrBandEventWire) => (
	event.kind !== 30023 ?
		[]
	:	(
			(pubkey, identifier) => (
				pubkey == null || identifier == null ?
					[]
				:	[
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

const relayUrlFromWire = (relay: NostrBandRelayWire) => (
	normalizeRelayUrl(
		relay.url
		?? relay.relay
		?? (
			relay.domain == null ?
				undefined
			:	`wss://${relay.domain}`
		),
	)
)

const relayRefFromWire = (relay: NostrBandRelayWire) => (
	((relayUrl) => (
		relayUrl == null ?
			[]
		:	[
				{
					[EntityMetaKey.Id]: { relayUrl },
				},
			]
	))(relayUrlFromWire(relay))
)

const profileMetadataFromProfileWire = (wire: {
	metadata?: NostrBandProfileMetadataWire
	profile?: NostrBandEventWire
} | undefined) => (
	wire?.metadata
	?? profileMetadataFromContent(wire?.profile?.content)
)

const profileFieldValuesFromMetadata = (
	metadata: NostrBandProfileMetadataWire | undefined,
	profileEvent: NostrBandEventWire | undefined,
) => ({
	displayName: optionalTrimmedString(metadata?.display_name ?? metadata?.name),
	about: optionalTrimmedString(metadata?.about),
	nip05: optionalTrimmedString(metadata?.nip05),
	lud16: optionalTrimmedString(metadata?.lud16),
	website: optionalTrimmedString(metadata?.website),
	...(nostrCreatedAtMs(profileEvent?.created_at) != null && {
		createdAt: nostrCreatedAtMs(profileEvent?.created_at),
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

const noteFieldValuesFromEvent = (event: NostrBandEventWire) => (
	((replyToEventId) => ({
		content: optionalTrimmedString(event.content),
		...(nostrCreatedAtMs(event.created_at) != null && {
			createdAt: nostrCreatedAtMs(event.created_at),
		}),
		$author: profileRefFromPubkey(event.pubkey),
		...(replyToEventId != null && {
			replyToEventId,
		}),
		...(replyToEventId != null && {
			$replyToNote: {
				[EntityMetaKey.Id]: { eventId: replyToEventId },
			},
		}),
	}))(replyToEventIdFromTags(event.tags))
)

const repostFieldValuesFromEvent = (event: NostrBandEventWire) => (
	((repostedEventId) => ({
		...(nostrCreatedAtMs(event.created_at) != null && {
			createdAt: nostrCreatedAtMs(event.created_at),
		}),
		$author: profileRefFromPubkey(event.pubkey),
		...(repostedEventId != null && {
			$repostedNote: {
				[EntityMetaKey.Id]: { eventId: repostedEventId },
			},
		}),
	}))(eventIdFromETags(event.tags))
)

const reactionFieldValuesFromEvent = (event: NostrBandEventWire) => (
	((targetEventId) => ({
		...(nostrCreatedAtMs(event.created_at) != null && {
			createdAt: nostrCreatedAtMs(event.created_at),
		}),
		$author: profileRefFromPubkey(event.pubkey),
		...(targetEventId != null && {
			$targetNote: {
				[EntityMetaKey.Id]: { eventId: targetEventId },
			},
		}),
		content: optionalTrimmedString(event.content),
	}))(eventIdFromETags(event.tags))
)

const articlePublishedAtMs = (event: NostrBandEventWire) => (
	((publishedAtTag) => (
		publishedAtTag == null ?
			nostrCreatedAtMs(event.created_at)
		: (
			Number.isFinite(Number(publishedAtTag)) ?
				Number(publishedAtTag) * (
					Number(publishedAtTag).toString().length <= 10 ?
						1000
					:	1
				)
			: optionalTimestampMs(publishedAtTag)
		)
	))(tagValueFromTags(event.tags, 'published_at'))
)

const articleFieldValuesFromEvent = (event: NostrBandEventWire) => (
	((publishedAt) => ({
		title: optionalTrimmedString(tagValueFromTags(event.tags, 'title')),
		summary: optionalTrimmedString(tagValueFromTags(event.tags, 'summary')),
		imageUrl: optionalTrimmedString(tagValueFromTags(event.tags, 'image')),
		content: optionalTrimmedString(event.content),
		...(publishedAt != null && { publishedAt }),
		$author: profileRefFromPubkey(event.pubkey),
	}))(articlePublishedAtMs(event))
)

const relayFieldValuesFromWire = (relay: NostrBandRelayWire) => ({
	name: optionalTrimmedString(relay.name),
	description: optionalTrimmedString(relay.description),
	software: optionalTrimmedString(relay.software),
	version: optionalTrimmedString(relay.version),
	nip11Name: optionalTrimmedString(relay.name),
	nip11Description: optionalTrimmedString(relay.description),
	...(optionalFiniteNumber(relay.nips?.length) != null && {
		supportedNipCount: optionalFiniteNumber(relay.nips?.length),
	}),
	...(relay.is_paid === true || relay.paid === true ?
		{ isPaid: true }
	: relay.is_paid === false || relay.paid === false ?
		{ isPaid: false }
	:	{}),
	...(optionalFiniteNumber(relay.limit) != null && {
		limit: optionalFiniteNumber(relay.limit),
	}),
})

export default {
	source: Source.NostrBand_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NostrProfile,
			resolve: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const d = await singleFlight(getProfileByPubkey)(entityId.pubkey)
				const metadata = profileMetadataFromProfileWire(d)
				if (metadata == null && d.profile == null) {
					throw new Error('NostrBand_Rest: profile not found')
				}
				return profileFieldValuesFromMetadata(metadata, d.profile)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrNote,
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('NostrBand_Rest: note not found')
				}
				const eventId = normalizeEventId(event.id)
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
				sourcePublicEnv(context, Source.NostrBand_Rest)
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
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 6) {
					throw new Error('NostrBand_Rest: repost not found')
				}
				const eventId = normalizeEventId(event.id)
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
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 7) {
					throw new Error('NostrBand_Rest: reaction not found')
				}
				const eventId = normalizeEventId(event.id)
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('NostrBand_Rest: reaction event id mismatch')
				}
				return reactionFieldValuesFromEvent(event)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrArticle,
			resolve: async (entityId, context) => {
				const { listAuthorArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
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
							&& tagValueFromTags(row.tags, 'd') === identifier
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
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const byPubkey = new Map<string, { [EntityMetaKey.Id]: { pubkey: string } }>()
				for (const row of ((await singleFlight(listTopProfiles)(limit)).profiles ?? [])) {
					const pubkey = normalizePubkey(row.pubkey ?? row.profile?.pubkey)
					if (pubkey == null) continue
					byPubkey.set(pubkey, {
						[EntityMetaKey.Id]: { pubkey },
					})
				}
				return [...byPubkey.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrNotes',
			resolve: async (_entityId, context) => {
				const { listRecentTextNotes } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listRecentTextNotes)(limit)).events ?? [])
						.flatMap((event) => noteRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrRelays',
			resolve: async (_entityId, context) => {
				const { listTopRelays } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const byRelayUrl = new Map<string, { [EntityMetaKey.Id]: { relayUrl: string } }>()
				for (const row of ((await singleFlight(listTopRelays)(limit)).relays ?? [])) {
					for (const ref of relayRefFromWire(row)) {
						byRelayUrl.set(ref[EntityMetaKey.Id].relayUrl, ref)
					}
				}
				return [...byRelayUrl.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrReposts',
			resolve: async (_entityId, context) => {
				const { listRecentReposts } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listRecentReposts)(limit)).events ?? [])
						.flatMap((event) => repostRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrArticles',
			resolve: async (_entityId, context) => {
				const { listRecentArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
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
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listAuthorTextNotes)(entityId.pubkey, limit)).events ?? [])
						.flatMap((event) => noteRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$$articles',
			resolve: async (entityId, context) => {
				const { listAuthorArticles } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
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
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listAuthorReposts)(entityId.pubkey, limit)).events ?? [])
						.flatMap((event) => repostRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: 'website',
			resolve: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const metadata = profileMetadataFromProfileWire(
					await singleFlight(getProfileByPubkey)(entityId.pubkey),
				)
				return optionalTrimmedString(metadata?.website)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$banner',
			resolve: async (entityId, context) => {
				const { getProfileByPubkey } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const metadata = profileMetadataFromProfileWire(
					await singleFlight(getProfileByPubkey)(entityId.pubkey),
				)
				return mediaFromUrl(optionalTrimmedString(metadata?.banner), MediaType.Image)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { listNoteReplies } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listNoteReplies)(entityId.eventId, limit)).events ?? [])
						.flatMap((event) => noteRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$$reactions',
			resolve: async (entityId, context) => {
				const { listNoteReactions } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listNoteReactions)(entityId.eventId, limit)).events ?? [])
						.flatMap((event) => reactionRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$replyToNote',
			resolve: async (entityId, context) => {
				const { getEventById } = await import('$/sources/NostrBand/Rest/queries.ts')
				sourcePublicEnv(context, Source.NostrBand_Rest)
				const event = eventFromWire(await singleFlight(getEventById)(entityId.eventId))
				if (event == null || event.kind !== 1) {
					throw new Error('NostrBand_Rest: note not found for reply target')
				}
				const replyToEventId = replyToEventIdFromTags(event.tags)
				return (
					replyToEventId == null ?
						undefined
					:	{
							[EntityMetaKey.Id]: { eventId: replyToEventId },
						}
				)
			},
		}),
	],
}
