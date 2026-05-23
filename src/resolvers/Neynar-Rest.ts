import { type as arktype } from 'arktype'

import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const zeroXLowerHexCastHash = (hash: string): CastHash => {
	const t = hash.trim()
	const hex = (
		t.startsWith('0x')
		|| t.startsWith('0X') ?
			t.slice(2)
		:
			t
	)
	return `0x${hex.toLowerCase()}`
}

type NeynarCastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
type NeynarUserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
type NeynarChannelEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterChannel>
const neynarPfpHttpUrl = (
	value: string | null | undefined,
	options?: { pageBaseUrl?: string },
) => {
	const raw = value?.trim() ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(
		raw.startsWith('/') && options?.pageBaseUrl != null ?
			new URL(raw, options.pageBaseUrl).toString()
		:
			raw,
	)?.url
}

const optionalTrimmedString = (value: string | undefined | null) => (
	value?.trim() ? value.trim() : undefined
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
				const ethVerifiedCand = optionalTrimmedString(
					user.verified_addresses?.primary?.eth_address
					?? user.verified_addresses?.eth_addresses?.[0],
				)
				const ethVerifiedParsed = (
					ethVerifiedCand == null ?
						arktype.errors
					:
						EvmAddress(ethVerifiedCand)
				)
				const verifiedPart = (
					!(ethVerifiedParsed instanceof arktype.errors) && {
						verifiedAddress: ethVerifiedParsed,
					}
				)
				return {
					username: optionalTrimmedString(user.username),
					displayName: optionalTrimmedString(user.display_name),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(neynarPfpHttpUrl(user.pfp_url), MediaType.Image)),
					bio: optionalTrimmedString(
						bioRaw != null && typeof bioRaw === 'object' ? bioRaw.text : bioRaw ?? undefined,
					),
					...(user.follower_count != null && {
						followerCount: user.follower_count,
					}),
					...(user.following_count != null && {
						followingCount: user.following_count,
					}),
					...verifiedPart,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: async (entityId, context) => {
				const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const bulkUsers = await singleFlight(getBulkUsers)({
					publicEnv,
					fids: [entityId.fid],
				})
				const user = bulkUsers?.users?.find((neynarUser) => neynarUser.fid === entityId.fid)
				if (user == null) throw new Error('Neynar_Rest: Blockhead Farcaster connection user not found')
				const bioRaw = user.profile?.bio
				const ethList = (
					[
						...(user.verified_addresses?.eth_addresses ?? []),
						...(user.verified_addresses?.primary?.eth_address != null ?
							[user.verified_addresses.primary.eth_address]
						:
							[]),
					]
						.map(optionalTrimmedString)
						.filter((v): v is string => v != null)
				)
				return {
					username: optionalTrimmedString(user.username),
					displayName: optionalTrimmedString(user.display_name),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(neynarPfpHttpUrl(user.pfp_url), MediaType.Image)),
					bio: optionalTrimmedString(
						bioRaw != null && typeof bioRaw === 'object' ? bioRaw.text : bioRaw ?? undefined,
					),
					...(ethList.length > 0 && { verifications: ethList }),
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
				if (cast == null || zeroXLowerHexCastHash(cast.hash) !== entityId.hash) {
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
						.map((ch) => optionalTrimmedString(ch?.id))
						.filter((idValue): idValue is string => idValue != null)
				)
				const channelId = optionalTrimmedString(cast.channel?.id)
				return {
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
					text: optionalTrimmedString(cast.text),
					$parentCast: (
						cast.parent_author?.fid == null
						|| cast.parent_hash == null
						|| String(cast.parent_hash).trim() === '' ?
							undefined
						:	{
								[EntityMetaKey.Id]: {
									fid: cast.parent_author.fid,
									hash: zeroXLowerHexCastHash(String(cast.parent_hash)),
								},
							} satisfies NeynarCastEntity
					),
					parentUrl: optionalTrimmedString(cast.parent_url ?? cast.root_parent_url),
					timestamp: Number.isFinite(timestamp) ? timestamp : undefined,
					mentions: cast.mentions,
					mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
					mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
					$$embeds: (cast.embeds ?? []).map((embed, index) => {
						const ogImages = embed.metadata?.html?.ogImage
						const og0 = ogImages?.[0]?.url
						return (({
							[EntityMetaKey.Id]: {
								$cast: castId,
								index,
							},
							url: optionalTrimmedString(embed.url),
							$embeddedCast: (
								embed.cast?.hash != null && embed.cast.author?.fid != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast.author.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast.hash)),
										},
									} satisfies NeynarCastEntity
								: embed.cast_id?.fid != null && embed.cast_id.hash != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast_id.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast_id.hash)),
										},
									} satisfies NeynarCastEntity
								:	undefined
							),
							title: optionalTrimmedString(embed.metadata?.html?.ogTitle),
							description: optionalTrimmedString(embed.metadata?.html?.ogDescription),
							...((
								iconMedia,
							) => (
								iconMedia != null && {
									$icon: iconMedia,
								}
							))(mediaFromUrl(neynarPfpHttpUrl(
								og0 ?? undefined,
								{ pageBaseUrl: optionalTrimmedString(embed.url) },
							), MediaType.Image)),
							quotedPreviewText: optionalTrimmedString(embed.cast?.text),
						}) satisfies CastEmbedEntity)
					}),
					likeCount: cast.likes ?? cast.reactions?.likes_count,
					recastCount: cast.recasts ?? cast.reactions?.recasts_count,
					replyCount: cast.replies?.count,
					threadHash: optionalTrimmedString(cast.thread_hash),
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
					if (page == null) throw new Error('Neynar_Rest: feed response missing')
					return (
						(page.casts ?? [])
							.flatMap((cast) => (
								cast.author?.fid == null
								|| cast.hash == null
								|| String(cast.hash).trim() === '' ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies NeynarCastEntity]
							))
					)
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
					if (page == null) throw new Error('Neynar_Rest: feed response missing')
					return (
						(page.casts ?? [])
							.flatMap((cast) => (
								cast.author?.fid == null
								|| cast.hash == null
								|| String(cast.hash).trim() === '' ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies NeynarCastEntity]
							))
					)
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
					if (page == null) throw new Error('Neynar_Rest: feed response missing')
					return (
						(page.casts ?? [])
							.flatMap((cast) => (
								cast.author?.fid == null
								|| cast.hash == null
								|| String(cast.hash).trim() === '' ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies NeynarCastEntity]
							))
					)
				}
				if (entityId.variant === 'following') {
					const page = await singleFlight(getFeed)(
						publicEnv,
						{
							feedType: 'following',
							fid: entityId.viewerFid,
							limit,
						},
					)
					if (page == null) throw new Error('Neynar_Rest: feed response missing')
					return (
						(page.casts ?? [])
							.flatMap((cast) => (
								cast.author?.fid == null
								|| cast.hash == null
								|| String(cast.hash).trim() === '' ?
									[]
								:	[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies NeynarCastEntity]
							))
					)
				}
				throw new Error(`Neynar_Rest: unsupported FarcasterFeed variant ${JSON.stringify(entityId)}`)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FarcasterUser,
			fieldName: '$$casts',
			resolve: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const page = await singleFlight(getFeed)(
					publicEnv,
					{
						feedType: 'filter',
						filterType: 'fids',
						fids: [entityId.fid],
						limit,
					},
				)
				if (page == null) throw new Error('Neynar_Rest: feed response missing')
				return (
					(page.casts ?? [])
						.flatMap((cast) => (
							cast.author?.fid == null
							|| cast.hash == null
							|| String(cast.hash).trim() === '' ?
								[]
							:	[{
									[EntityMetaKey.Id]: {
										fid: cast.author.fid,
										hash: zeroXLowerHexCastHash(String(cast.hash)),
									},
								} satisfies NeynarCastEntity]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: '$$casts',
			resolve: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Neynar_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const page = await singleFlight(getFeed)(
					publicEnv,
					{
						feedType: 'filter',
						filterType: 'channel_id',
						channelId: entityId.id,
						limit,
					},
				)
				if (page == null) throw new Error('Neynar_Rest: feed response missing')
				return (
					(page.casts ?? [])
						.flatMap((cast) => (
							cast.author?.fid == null
							|| cast.hash == null
							|| String(cast.hash).trim() === '' ?
								[]
							:	[{
									[EntityMetaKey.Id]: {
										fid: cast.author.fid,
										hash: zeroXLowerHexCastHash(String(cast.hash)),
									},
								} satisfies NeynarCastEntity]
						))
				)
			},
		}),

	],
}



