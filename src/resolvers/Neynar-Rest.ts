import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const normalizeFarcasterCastHash = (hash: string): CastHash => {
	const t = hash.trim()
	const hex = (
		t.startsWith('0x')
		|| t.startsWith('0X') ?
			t.slice(2)
		:
			t
	)
	return `0x${hex.toLowerCase()}` as CastHash
}

type NeynarCastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
type NeynarUserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
type NeynarChannelEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterChannel>
type NeynarCastWire = import('$/sources/Neynar/Rest/types.ts').NeynarCastWire

const neynarNonEmptyString = (value: string | undefined | null) => (
	value?.trim() ? value.trim() : undefined
)

const neynarCastEntityRef = (
	fid: number | undefined,
	hash: string | undefined,
): NeynarCastEntity | undefined => (
	fid == null || hash == null || String(hash).trim() === '' ?
		undefined
	: {
			[EntityMetaKey.Id]: {
				fid,
				hash: normalizeFarcasterCastHash(String(hash)),
			},
		} satisfies NeynarCastEntity
)

const neynarCastRefsFromFeed = (casts: NeynarCastWire[]) => (
	casts
		.map((cast) => neynarCastEntityRef(cast.author?.fid, cast.hash))
		.filter((ref): ref is NeynarCastEntity => ref != null)
)

export default {
	source: Source.Neynar_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			resolve: async (entityId, context) => {
				const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const bulkUsers = await singleFlight(getBulkUsers)({
					publicEnv,
					fids: [entityId.fid],
				})
				const user = bulkUsers?.users?.find((neynarUser) => neynarUser.fid === entityId.fid)
				if (user == null) throw new Error('Neynar_Rest: user not found')
				const bioRaw = user.profile?.bio
				return {
					[EntityMetaKey.Id]: entityId,
					username: neynarNonEmptyString(user.username),
					displayName: neynarNonEmptyString(user.display_name),
					pfpUrl: neynarNonEmptyString(user.pfp_url),
					bio: neynarNonEmptyString(
						typeof bioRaw === 'string' ? bioRaw : bioRaw?.text,
					),
					verifiedAddress: neynarNonEmptyString(
						user.verified_addresses?.primary?.eth_address
						?? user.verified_addresses?.eth_addresses?.[0]
						?? user.verified_addresses?.primary?.sol_address
						?? user.verified_addresses?.sol_addresses?.[0],
					),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.FarcasterCast,
			resolve: async (entityId, context) => {
				const { getCastByHash } = await import('$/sources/Neynar/Rest/queries.ts')
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type EntityIdCast = import('$/schema/$schema.ts').EntityId<typeof schema, EntityType.FarcasterCast>
				type FieldValuesCast = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const cast = await singleFlight(getCastByHash)(publicEnv, entityId.hash)
				if (cast == null || normalizeFarcasterCastHash(cast.hash) !== entityId.hash) {
					throw new Error('Neynar_Rest: cast not found')
				}
				const castId: EntityIdCast = entityId
				const timestamp = Date.parse(cast.timestamp ?? '')
				const mentionFids = (
					(cast.mentioned_profiles ?? [])
						.map((u) => u?.fid)
						.filter((fidValue): fidValue is number => fidValue != null)
				)
				const mentionChIds = (
					(cast.mentioned_channels ?? [])
						.map((ch) => neynarNonEmptyString(ch?.id))
						.filter((idValue): idValue is string => idValue != null)
				)
				const channelId = neynarNonEmptyString(cast.channel?.id)
				return {
					[EntityMetaKey.Id]: entityId,
					$author: (
						cast.author?.fid == null ?
							undefined
						:	({
								[EntityMetaKey.Id]: { fid: cast.author.fid },
							} satisfies NeynarUserEntity)
					),
					$postedViaApp: (
						cast.app?.fid == null ?
							undefined
						:	({
								[EntityMetaKey.Id]: { fid: cast.app.fid },
							} satisfies NeynarUserEntity)
					),
					text: neynarNonEmptyString(cast.text),
					$parentCast: neynarCastEntityRef(cast.parent_author?.fid, cast.parent_hash),
					parentUrl: neynarNonEmptyString(cast.parent_url ?? cast.root_parent_url),
					timestamp: Number.isFinite(timestamp) ? timestamp : undefined,
					mentions: cast.mentions,
					mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
					mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
					$$embeds: (cast.embeds ?? []).map((embed, index) => {
						const ogImages = embed.metadata?.html?.ogImage
						return (({
							[EntityMetaKey.Id]: {
								$cast: castId,
								index,
							},
							url: neynarNonEmptyString(embed.url),
							$embeddedCast: (
								embed.cast?.hash != null && embed.cast.author?.fid != null ?
									neynarCastEntityRef(embed.cast.author.fid, embed.cast.hash)
								: embed.cast_id?.fid != null && embed.cast_id.hash != null ?
									neynarCastEntityRef(embed.cast_id.fid, embed.cast_id.hash)
								:	undefined
							),
							title: neynarNonEmptyString(embed.metadata?.html?.ogTitle),
							description: neynarNonEmptyString(embed.metadata?.html?.ogDescription),
							imageUrl: neynarNonEmptyString(ogImages?.[0]?.url),
							quotedPreviewText: neynarNonEmptyString(embed.cast?.text),
						}) satisfies CastEmbedEntity)
					}),
					likeCount: cast.likes ?? cast.reactions?.likes_count,
					recastCount: cast.recasts ?? cast.reactions?.recasts_count,
					replyCount: cast.replies?.count,
					threadHash: neynarNonEmptyString(cast.thread_hash),
					$channel: (
						channelId == null ? undefined : {
							[EntityMetaKey.Id]: {
								id: channelId,
							},
						} satisfies NeynarChannelEntity
					),
				} satisfies Partial<FieldValuesCast>
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterFeed,
			fieldName: '$$entries',
			resolve: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				if (entityId.variant === 'trending') {
					const page = await singleFlight(getFeed)(
						publicEnv,
						{
							feedType: 'filter',
							filterType: 'global_trending',
							limit,
						},
					)
					return neynarCastRefsFromFeed(page?.casts ?? [])
				}
				if (entityId.variant === 'byUser') {
					const page = await singleFlight(getFeed)(
						publicEnv,
						{
							feedType: 'filter',
							filterType: 'fids',
							fids: [entityId.fid],
							limit,
						},
					)
					return neynarCastRefsFromFeed(page?.casts ?? [])
				}
				if (entityId.variant === 'byChannel') {
					const page = await singleFlight(getFeed)(
						publicEnv,
						{
							feedType: 'filter',
							filterType: 'channel_id',
							channelId: entityId.channelId,
							limit,
						},
					)
					return neynarCastRefsFromFeed(page?.casts ?? [])
				}
				return []
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterUser,
			fieldName: '$$casts',
			resolve: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const page = await singleFlight(getFeed)(
					publicEnv,
					{
						feedType: 'filter',
						filterType: 'fids',
						fids: [entityId.fid],
						limit: resolverLoadSubsetRowLimit(context),
					},
				)
				return neynarCastRefsFromFeed(page?.casts ?? [])
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: '$$casts',
			resolve: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const page = await singleFlight(getFeed)(
					publicEnv,
					{
						feedType: 'filter',
						filterType: 'channel_id',
						channelId: entityId.id,
						limit: resolverLoadSubsetRowLimit(context),
					},
				)
				return neynarCastRefsFromFeed(page?.casts ?? [])
			},
		}),
	],
}
