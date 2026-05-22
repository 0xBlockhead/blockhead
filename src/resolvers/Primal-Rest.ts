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
import type { PrimalNostrEventWire } from '$/sources/Primal/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined | null) => (
	value?.trim() ? value.trim() : undefined
)

const normalizePubkey = (value: string | undefined | null) => (
	((t) => (
		/^[0-9a-f]{64}$/.test(t) ?
			t
		:
			undefined
	))(value?.trim().toLowerCase() ?? '')
)

const normalizeEventId = (value: string | undefined | null) => (
	((t) => (
		/^[0-9a-f]{64}$/.test(t) ?
			t
		:
			undefined
	))(value?.trim().toLowerCase() ?? '')
)

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

const isRecord = (value: unknown): value is Record<string, unknown> => (
	value != null && typeof value === 'object'
)

const parseKind0Metadata = (content: string | undefined) => {
	if (content == null || content.trim() === '') return {}
	try {
		const parsed = JSON.parse(content) as Record<string, unknown>
		return {
			displayName: optionalTrimmedString(
				typeof parsed.display_name === 'string' ?
					parsed.display_name
				: typeof parsed.name === 'string' ?
					parsed.name
				: undefined,
			),
			about: optionalTrimmedString(
				typeof parsed.about === 'string' ?
					parsed.about
				: undefined,
			),
			picture: optionalTrimmedString(
				typeof parsed.picture === 'string' ?
					parsed.picture
				: undefined,
			),
			banner: optionalTrimmedString(
				typeof parsed.banner === 'string' ?
					parsed.banner
				: undefined,
			),
			website: optionalTrimmedString(
				typeof parsed.website === 'string' ?
					parsed.website
				: undefined,
			),
			nip05: optionalTrimmedString(
				typeof parsed.nip05 === 'string' ?
					parsed.nip05
				: undefined,
			),
			lud16: optionalTrimmedString(
				typeof parsed.lud16 === 'string' ?
					parsed.lud16
				: undefined,
			),
		}
	} catch {
		return {}
	}
}

const profileEventFromWire = (wire: unknown): PrimalNostrEventWire | undefined => {
	if (!isRecord(wire)) return undefined
	if (
		typeof wire.id === 'string'
		&& wire.kind === 0
	) {
		return wire as PrimalNostrEventWire
	}
	if (wire.metadata != null) return profileEventFromWire(wire.metadata)
	if (wire.profile != null) return profileEventFromWire(wire.profile)
	if (wire.user != null) return profileEventFromWire(wire.user)
	return undefined
}

const noteEventFromWire = (wire: unknown): PrimalNostrEventWire | undefined => {
	if (!isRecord(wire)) return undefined
	if (typeof wire.id !== 'string') return undefined
	if (wire.event != null) return noteEventFromWire(wire.event)
	if (wire.note != null) return noteEventFromWire(wire.note)
	return wire as PrimalNostrEventWire
}

const eventFromWire = (wire: unknown) => (
	((record) => (
		record == null ?
			undefined
		: noteEventFromWire(record.event ?? record)
	))(isRecord(wire) ? wire : undefined)
)

const eventsFromTimelineResponse = (response: unknown): PrimalNostrEventWire[] => {
	if (Array.isArray(response)) {
		return response.flatMap((item) => (
			((event) => (
				event == null ?
					[]
				:	[event]
			))(noteEventFromWire(item))
		))
	}
	if (!isRecord(response)) return []
	for (const key of [
		'notes',
		'posts',
		'events',
		'items',
		'reposts',
		'articles',
		'actions',
	] as const) {
		const rows = response[key]
		if (!Array.isArray(rows)) continue
		return rows.flatMap((item) => (
			((event) => (
				event == null ?
					[]
				:	[event]
			))(noteEventFromWire(item))
		))
	}
	return []
}

const tagValueFromTags = (
	tags: readonly (readonly string[])[] | undefined,
	tagName: string,
) => (
	tags?.flatMap((tag) => (
		tag[0] === tagName
		&& typeof tag[1] === 'string'
		&& tag[1].trim() !== '' ?
			[tag[1].trim()]
		: []
	))[0]
)

const eventIdFromETags = (tags: readonly (readonly string[])[] | undefined) => (
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

const replyToEventIdFromTags = (tags: readonly (readonly string[])[] | undefined) => (
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

const noteRefFromEvent = (event: PrimalNostrEventWire) => (
	event.kind !== 1 || normalizeEventId(event.id) == null ?
		[]
	:	[
			{
				[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
			},
		]
)

const repostRefFromEvent = (event: PrimalNostrEventWire) => (
	event.kind !== 6 || normalizeEventId(event.id) == null ?
		[]
	:	[
			{
				[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
			},
		]
)

const reactionRefFromEvent = (event: PrimalNostrEventWire) => (
	event.kind !== 7 || normalizeEventId(event.id) == null ?
		[]
	:	[
			{
				[EntityMetaKey.Id]: { eventId: normalizeEventId(event.id)! },
			},
		]
)

const articleRefFromEvent = (event: PrimalNostrEventWire) => (
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

const profileFieldValuesFromEvent = (event: PrimalNostrEventWire) => {
	const metadata = parseKind0Metadata(event.content)
	return {
		displayName: metadata.displayName,
		about: metadata.about,
		website: metadata.website,
		nip05: metadata.nip05,
		lud16: metadata.lud16,
		...(nostrCreatedAtMs(event.created_at) != null && {
			createdAt: nostrCreatedAtMs(event.created_at),
		}),
		...((
			iconMedia,
		) => (
			iconMedia != null && {
				$icon: iconMedia,
			}
		))(mediaFromUrl(metadata.picture, MediaType.Image)),
		...((
			bannerMedia,
		) => (
			bannerMedia != null && {
				$banner: bannerMedia,
			}
		))(mediaFromUrl(metadata.banner, MediaType.Image)),
	}
}

const noteFieldValuesFromEvent = (event: PrimalNostrEventWire) => (
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

const repostFieldValuesFromEvent = (event: PrimalNostrEventWire) => (
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

const reactionFieldValuesFromEvent = (event: PrimalNostrEventWire) => (
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

const articlePublishedAtMs = (event: PrimalNostrEventWire) => (
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

const articleFieldValuesFromEvent = (event: PrimalNostrEventWire) => (
	((publishedAt) => ({
		title: optionalTrimmedString(tagValueFromTags(event.tags, 'title')),
		summary: optionalTrimmedString(tagValueFromTags(event.tags, 'summary')),
		imageUrl: optionalTrimmedString(tagValueFromTags(event.tags, 'image')),
		content: optionalTrimmedString(event.content),
		...(publishedAt != null && { publishedAt }),
		$author: profileRefFromPubkey(event.pubkey),
	}))(articlePublishedAtMs(event))
)

const collectRefsFromSeedProfiles = async <Ref extends { [EntityMetaKey.Id]: Record<string, string> }>(
	publicEnv: ReturnType<typeof sourcePublicEnv>,
	limit: number,
	getTimeline: (
		env: ReturnType<typeof sourcePublicEnv>,
		pubkey: string,
		perProfileLimit: number,
	) => Promise<unknown>,
	refFromEvent: (event: PrimalNostrEventWire) => Ref[],
) => {
	const perProfileLimit = Math.max(1, Math.ceil(limit / nostrNetworkSeedProfiles.length))
	const byKey = new Map<string, Ref>()
	for (const seedProfile of nostrNetworkSeedProfiles) {
		for (const event of eventsFromTimelineResponse(
			await singleFlight(getTimeline)(publicEnv, seedProfile.pubkey, perProfileLimit),
		)) {
			for (const ref of refFromEvent(event)) {
				byKey.set(JSON.stringify(ref[EntityMetaKey.Id]), ref)
				if (byKey.size >= limit) break
			}
			if (byKey.size >= limit) break
		}
		if (byKey.size >= limit) break
	}
	return [...byKey.values()].slice(0, limit)
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
				return profileFieldValuesFromEvent(event)
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
				if (event == null || event.kind !== 6) {
					throw new Error('Primal_Rest: repost not found')
				}
				const eventId = normalizeEventId(event.id)
				if (eventId == null || eventId !== entityId.eventId) {
					throw new Error('Primal_Rest: repost event id mismatch')
				}
				return repostFieldValuesFromEvent(event)
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
				return reactionFieldValuesFromEvent(event)
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
						.find((row) => (
							row.kind === 30023
							&& normalizePubkey(row.pubkey) === pubkey
							&& tagValueFromTags(row.tags, 'd') === identifier
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
			resolve: async (_entityId, context) => {
				const { getProfileNotes } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const perProfileLimit = Math.max(1, Math.ceil(limit / nostrNetworkSeedProfiles.length))
				const byPubkey = new Map<string, { [EntityMetaKey.Id]: { pubkey: string } }>()
				for (const seedProfile of nostrNetworkSeedProfiles) {
					byPubkey.set(seedProfile.pubkey, {
						[EntityMetaKey.Id]: seedProfile,
					})
				}
				for (const seedProfile of nostrNetworkSeedProfiles) {
					for (const event of eventsFromTimelineResponse(
						await singleFlight(getProfileNotes)(publicEnv, seedProfile.pubkey, perProfileLimit),
					)) {
						if (event.kind !== 1) continue
						const pubkey = normalizePubkey(event.pubkey)
						if (pubkey == null) continue
						byPubkey.set(pubkey, {
							[EntityMetaKey.Id]: { pubkey },
						})
					}
				}
				return [...byPubkey.values()].slice(0, limit)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrNotes',
			resolve: async (_entityId, context) => {
				const { getProfileNotes } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return collectRefsFromSeedProfiles(
					publicEnv,
					limit,
					getProfileNotes,
					noteRefFromEvent,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrReposts',
			resolve: async (_entityId, context) => {
				const { getProfileReposts } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return collectRefsFromSeedProfiles(
					publicEnv,
					limit,
					getProfileReposts,
					repostRefFromEvent,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrArticles',
			resolve: async (_entityId, context) => {
				const { getProfileArticles } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return collectRefsFromSeedProfiles(
					publicEnv,
					limit,
					getProfileArticles,
					articleRefFromEvent,
				)
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
						.flatMap((event) => noteRefFromEvent(event))
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
						.flatMap((event) => repostRefFromEvent(event))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: 'website',
			resolve: async (entityId, context) => {
				const { getProfile } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const event = profileEventFromWire(
					await singleFlight(getProfile)(publicEnv, entityId.pubkey),
				)
				return parseKind0Metadata(event?.content).website
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrProfile,
			fieldName: '$banner',
			resolve: async (entityId, context) => {
				const { getProfile } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const event = profileEventFromWire(
					await singleFlight(getProfile)(publicEnv, entityId.pubkey),
				)
				return mediaFromUrl(parseKind0Metadata(event?.content).banner, MediaType.Image)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNote,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { getNoteThread } = await import('$/sources/Primal/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Primal_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					eventsFromTimelineResponse(
						await singleFlight(getNoteThread)(publicEnv, entityId.eventId, limit),
					)
						.flatMap((event) => noteRefFromEvent(event))
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
						.flatMap((event) => reactionRefFromEvent(event))
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
