import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type {
	Entity,
	EntityFieldValues,
	EntityId,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/$schema.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import {
	getCastByHash,
	getBulkUsers,
	getFeed,
	pickUserByFid,
} from '$/sources/Neynar/Rest/queries.ts'
import type {
	NeynarCastEmbedWire,
	NeynarCastWire,
	NeynarUserWire,
} from '$/sources/Neynar/Rest/types.ts'
import { Source } from '$/sources/$Sources.ts'

const stringValue = (value: unknown) => (
	typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
)

const normalizeCastHash = (hash: string): CastHash => {
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

const userFieldsFromWire = (user: NeynarUserWire) => ({
	username: stringValue(user.username),
	displayName: stringValue(user.display_name),
	pfpUrl: stringValue(user.pfp_url),
	bio: stringValue(
		typeof user.profile?.bio === 'string' ? user.profile.bio : user.profile?.bio?.text,
	),
	verifiedAddress: stringValue(
		user.verified_addresses?.primary?.eth_address
		?? user.verified_addresses?.eth_addresses?.[0]
		?? user.verified_addresses?.primary?.sol_address
		?? user.verified_addresses?.sol_addresses?.[0],
	),
})

const castIdFromWire = (fid: number, hash: string) => ({
	fid,
	hash: normalizeCastHash(hash),
})

const userRefFromFid = (
	fid: number,
): Entity<typeof schema, EntityType.FarcasterUser> => ({
	[EntityMetaKey.Id]: {
		fid,
	},
} as Entity<typeof schema, EntityType.FarcasterUser>)

const castRefFromWire = (
	fid: number | undefined,
	hash: string | undefined,
): Entity<typeof schema, EntityType.FarcasterCast> | undefined => (
	fid == null || hash == null || String(hash).trim() === '' ?
		undefined
	:	{
			[EntityMetaKey.Id]: castIdFromWire(fid, String(hash)),
		} as Entity<typeof schema, EntityType.FarcasterCast>
)

const castRefsFromFeedCasts = (
	casts: NeynarCastWire[],
): Entity<typeof schema, EntityType.FarcasterCast>[] => (
	casts
		.map((cast) => (
			castRefFromWire(cast.author?.fid, cast.hash)
		))
		.filter((ref): ref is Entity<typeof schema, EntityType.FarcasterCast> => ref != null)
)

const castEmbedsFromWire = (
	castId: EntityId<typeof schema, EntityType.FarcasterCast>,
	embeds: NeynarCastEmbedWire[] | undefined,
): Entity<typeof schema, EntityType.FarcasterCastEmbed>[] => (
	(embeds ?? []).map((embed, index) => ({
		[EntityMetaKey.Id]: {
			$cast: castId,
			index,
		},
		url: stringValue(embed.url),
		$embeddedCast: (
			embed.cast_id?.fid != null
			&& embed.cast_id.hash != null
		) ?
			{
				[EntityMetaKey.Id]: castIdFromWire(embed.cast_id.fid, embed.cast_id.hash),
			} as Entity<typeof schema, EntityType.FarcasterCast>
		:	undefined,
	}) as Entity<typeof schema, EntityType.FarcasterCastEmbed>)
)

const castFieldsFromWire = (
	castId: EntityId<typeof schema, EntityType.FarcasterCast>,
	cast: NeynarCastWire,
) => {
	const timestamp = cast.timestamp == null ? undefined : Date.parse(cast.timestamp)
	return {
		$author: cast.author?.fid == null ? undefined : userRefFromFid(cast.author.fid),
		text: stringValue(cast.text),
		$parentCast: castRefFromWire(cast.parent_author?.fid, cast.parent_hash),
		parentUrl: stringValue(cast.parent_url ?? cast.root_parent_url),
		timestamp: Number.isNaN(timestamp) ? undefined : timestamp,
		mentions: Array.isArray(cast.mentions) ? cast.mentions : undefined,
		$$embeds: castEmbedsFromWire(castId, cast.embeds),
		likeCount: cast.likes ?? cast.reactions?.likes_count,
		recastCount: cast.recasts ?? cast.reactions?.recasts_count,
	} as Partial<EntityFieldValues<typeof schema, EntityType.FarcasterCast>>
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.FarcasterUser,
			source: Source.Neynar,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const user = pickUserByFid(
					(await singleFlight(getBulkUsers)({
						fids: [entityId.fid],
					}))?.users ?? [],
					entityId.fid,
				)
				if (user == null) return {}
				return {
					[EntityMetaKey.Id]: entityId,
					...userFieldsFromWire(user),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.FarcasterCast,
			source: Source.Neynar,
			resolve: async (entityId) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const cast = await singleFlight(getCastByHash)(entityId.hash)
				if (
					cast == null
					|| normalizeCastHash(cast.hash) !== entityId.hash
				) return {}
				return {
					[EntityMetaKey.Id]: entityId,
					...castFieldsFromWire(entityId, cast),
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterNetwork,
			fieldName: '$$casts',
			source: Source.Neynar,
			resolve: async (_entityId, context) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const page = await singleFlight(getFeed)({
					feedType: 'filter',
					filterType: 'global_trending',
					limit: context?.limit ?? 25,
				})
				return castRefsFromFeedCasts(page?.casts ?? [])
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterUser,
			fieldName: '$$casts',
			source: Source.Neynar,
			resolve: async (entityId, context) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const page = await singleFlight(getFeed)({
					feedType: 'filter',
					filterType: 'fids',
					fids: [entityId.fid],
					limit: context?.limit ?? 25,
				})
				return castRefsFromFeedCasts(page?.casts ?? [])
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.FarcasterChannel,
			fieldName: '$$casts',
			source: Source.Neynar,
			resolve: async (entityId, context) => {
				const { singleFlight } = await import('$/lib/singleFlight.ts')
				const page = await singleFlight(getFeed)({
					feedType: 'filter',
					filterType: 'channel_id',
					channelId: entityId.id,
					limit: context?.limit ?? 25,
				})
				return castRefsFromFeedCasts(page?.casts ?? [])
			},
		}),
	],
}
