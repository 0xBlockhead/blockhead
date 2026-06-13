import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import type { CastHash } from '$/schema/FarcasterCast.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const zeroXLowerHexCastHash = (hash: string): CastHash => {
	const hex = (
		hash.startsWith('0x')
		|| hash.startsWith('0X') ?
			hash.slice(2)
		:
			hash
	)
	return `0x${hex.toLowerCase()}`
}

const neynarPfpHttpUrl = (
	value: string | null | undefined,
	options?: { pageBaseUrl?: string },
) => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(
		raw.startsWith('/') && options?.pageBaseUrl != null ?
			new URL(raw, options.pageBaseUrl).toString()
		:
			raw,
	)?.url
}


export default {
	source: Source.Neynar_Rest,

	resolvers: [
		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
				const bulkUsers = await singleFlight(getBulkUsers)({
					publicEnv: context.publicEnv,
					fids: [entityId.fid],
				})
				const user = bulkUsers?.users.find((neynarUser) => neynarUser.fid === entityId.fid)
				if (user == null) throw new Error('Neynar_Rest: user not found')
				const bioRaw = user.profile?.bio
				const ethAddresses = (
					[
						...(user.verified_addresses?.primary?.eth_address != null ?
							[user.verified_addresses.primary.eth_address]
						:
							[]),
						...(user.verified_addresses?.eth_addresses ?? []),
					]
						.map(optionalNonemptyString)
						.filter((address): address is string => address != null)
						.filter((address, index, addresses) => addresses.indexOf(address) === index)
				)
				const solAddresses = (
					[
						...(user.verified_addresses?.primary?.sol_address != null ?
							[user.verified_addresses.primary.sol_address]
						:
							[]),
						...(user.verified_addresses?.sol_addresses ?? []),
					]
						.map(optionalNonemptyString)
						.filter((address): address is string => address != null)
						.filter((address, index, addresses) => addresses.indexOf(address) === index)
				)
				const verifiedPart = (
					ethAddresses.at(0) == null ?
						{}
					:
						{
							$primaryEvmAccount: {
								[EntityMetaKey.Id]: {
									address: EvmAddress.assert(ethAddresses.at(0)),
								},
							},
						}
				)
				const username = optionalNonemptyString(user.username)
				const displayName = optionalNonemptyString(user.display_name)
				const bio = optionalNonemptyString(
					bioRaw != null && typeof bioRaw === 'object' ? bioRaw.text : bioRaw ?? undefined,
				)
				return {
					...(username != null && { username }),
					...(displayName != null && { displayName }),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(neynarPfpHttpUrl(user.pfp_url), MediaType.Image)),
					...(bio != null && { bio }),
					...(user.follower_count != null && {
						followerCount: user.follower_count,
					}),
					...(user.following_count != null && {
						followingCount: user.following_count,
					}),
					...verifiedPart,
					$$verifiedAddresses: [
						...ethAddresses.map((address) => (
							((evmAddress) => ({
								[EntityMetaKey.Id]: {
									fid: entityId.fid,
									protocol: 'ethereum' as const,
									address: evmAddress,
								},
								$user: {
									[EntityMetaKey.Id]: entityId,
								},
								$evmAccount: {
									[EntityMetaKey.Id]: {
										address: evmAddress,
									},
								},
								protocol: 'ethereum' as const,
								address: evmAddress,
							}))(EvmAddress.assert(address))
						)),
						...solAddresses.map((address) => ({
								[EntityMetaKey.Id]: {
									fid: entityId.fid,
									protocol: 'solana' as const,
									address,
								},
							$user: {
								[EntityMetaKey.Id]: entityId,
							},
							$solanaAccount: {
								[EntityMetaKey.Id]: {
									$network: {
										caip2: {
											namespace: 'solana',
											reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
										},
									},
									pubkey: address,
								},
							},
								protocol: 'solana' as const,
								address,
						})),
					],
				}
			}
			},
		})({
				fields: {
				username: (user) => user.username,
				displayName: (user) => user.displayName,
				$icon: (user) => user.$icon,
				bio: (user) => user.bio,
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses,
				followerCount: (user) => user.followerCount,
				followingCount: (user) => user.followingCount,
			},
			}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
				const bulkUsers = await singleFlight(getBulkUsers)({
					publicEnv: context.publicEnv,
					fids: [entityId.fid],
				})
				const user = bulkUsers?.users.find((neynarUser) => neynarUser.fid === entityId.fid)
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
						.map(optionalNonemptyString)
						.filter((v): v is string => v != null)
				)
				const username = optionalNonemptyString(user.username)
				const displayName = optionalNonemptyString(user.display_name)
				const bio = optionalNonemptyString(
					bioRaw != null && typeof bioRaw === 'object' ? bioRaw.text : bioRaw ?? undefined,
				)
				return {
					...(username != null && { username }),
					...(displayName != null && { displayName }),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(neynarPfpHttpUrl(user.pfp_url), MediaType.Image)),
					...(bio != null && { bio }),
					...(ethList.length > 0 && { verifications: ethList }),
				}
			}
			},
		})({
				fields: {
				username: (connection) => connection.username,
				displayName: (connection) => connection.displayName,
				$icon: (connection) => connection.$icon,
				bio: (connection) => connection.bio,
				verifications: (connection) => connection.verifications,
			},
			}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					getCastByClientUrl,
					getCastByHash,
				} = await import('$/sources/Neynar/Rest/queries.ts')
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type EntityIdCast = import('$/schema/$schema.ts').EntityId<typeof schema, EntityType.FarcasterCast>
				type FieldValuesCast = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				const cast = await (
					'hash' in entityId ?
						singleFlight(getCastByHash)(
							context.publicEnv,
							zeroXLowerHexCastHash(entityId.hash),
						)
					: 'clientUrl' in entityId ?
						singleFlight(getCastByClientUrl)(context.publicEnv, entityId.clientUrl)
					:
						undefined
				)
				if (cast == null) {
					throw new Error('Neynar_Rest: cast not found')
				}
				const castHash = zeroXLowerHexCastHash(cast.hash)
				const timestamp = Date.parse(cast.timestamp ?? '')
				if (cast.author?.fid == null) {
					throw new Error('Neynar_Rest: cast missing author fid')
				}
				if (
					'hash' in entityId
					&& castHash !== zeroXLowerHexCastHash(entityId.hash)
				) {
					throw new Error('Neynar_Rest: cast hash mismatch')
				}
				if (
					'fid' in entityId
					&& cast.author.fid !== entityId.fid
				) {
					throw new Error('Neynar_Rest: cast author mismatch')
				}
				if (!Number.isFinite(timestamp)) {
					throw new Error('Neynar_Rest: cast missing timestamp')
				}
				const castId: EntityIdCast = {
					fid: cast.author.fid,
					hash: castHash,
				}
				const mentionFids = (
					(cast.mentioned_profiles ?? [])
						.map((u) => u.fid)
						.filter((fidValue): fidValue is number => fidValue != null)
				)
				const mentionChIds = (
					(cast.mentioned_channels ?? [])
						.map((ch) => optionalNonemptyString(ch.id))
						.filter((idValue): idValue is string => idValue != null)
				)
				const channelId = optionalNonemptyString(cast.channel?.id)
				const parentUrl = optionalNonemptyString(cast.parent_url ?? cast.root_parent_url)
				const likeCount = cast.likes ?? cast.reactions?.likes_count
				const recastCount = cast.recasts ?? cast.reactions?.recasts_count
				const replyCount = cast.replies?.count
				return {
					fid: cast.author.fid,
					hash: castHash,
					...(cast.author.username != null && cast.author.username !== '' && {
						username: cast.author.username,
					}),
					...('clientUrl' in entityId && {
						clientUrl: entityId.clientUrl,
					}),
					$author: {
						[EntityMetaKey.Id]: { fid: cast.author.fid },
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					$postedViaApp: (
						cast.app?.fid == null ?
							undefined
						:
							({
								[EntityMetaKey.Id]: { fid: cast.app.fid },
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>)
					),
					text: optionalNonemptyString(cast.text) ?? '',
					$parentCast: (
						cast.parent_author?.fid == null
						|| cast.parent_hash == null
						|| cast.parent_hash === '' ?
							undefined
						:
							{
								[EntityMetaKey.Id]: {
									fid: cast.parent_author.fid,
									hash: zeroXLowerHexCastHash(String(cast.parent_hash)),
								},
							} satisfies Entity<typeof schema, EntityType.FarcasterCast>
					),
					...(parentUrl != null && { parentUrl }),
					timestamp,
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
							url: optionalNonemptyString(embed.url),
							$embeddedCast: (
								embed.cast?.hash != null && embed.cast.author?.fid != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast.author.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>
								: embed.cast_id?.fid != null && embed.cast_id.hash != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast_id.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast_id.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>
								:
									undefined
							),
							title: optionalNonemptyString(embed.metadata?.html?.ogTitle),
							description: optionalNonemptyString(embed.metadata?.html?.ogDescription),
							...((
								iconMedia,
							) => (
								iconMedia != null && {
									$icon: iconMedia,
								}
							))(mediaFromUrl(neynarPfpHttpUrl(
								og0 ?? undefined,
								{ pageBaseUrl: optionalNonemptyString(embed.url) },
							), MediaType.Image)),
							quotedPreviewText: optionalNonemptyString(embed.cast?.text),
						}) satisfies CastEmbedEntity)
					}),
					...(likeCount != null && { likeCount }),
					...(recastCount != null && { recastCount }),
					...(replyCount != null && { replyCount }),
					...(cast.thread_hash != null && cast.thread_hash !== '' && {
						threadHash: zeroXLowerHexCastHash(String(cast.thread_hash)),
					}),
					$channel: (
						channelId == null ? undefined : {
							[EntityMetaKey.Id]: {
								id: channelId,
							},
						} satisfies Entity<typeof schema, EntityType.FarcasterChannel>
					),
				} satisfies Partial<FieldValuesCast>
			},
				['usernameHashPrefix']: async (entityId, context) => {
				const {
					getCastByClientUrl,
					getCastByHash,
				} = await import('$/sources/Neynar/Rest/queries.ts')
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type EntityIdCast = import('$/schema/$schema.ts').EntityId<typeof schema, EntityType.FarcasterCast>
				type FieldValuesCast = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				const cast = await (
					'hash' in entityId ?
						singleFlight(getCastByHash)(
							context.publicEnv,
							zeroXLowerHexCastHash(entityId.hash),
						)
					: 'clientUrl' in entityId ?
						singleFlight(getCastByClientUrl)(context.publicEnv, entityId.clientUrl)
					:
						undefined
				)
				if (cast == null) {
					throw new Error('Neynar_Rest: cast not found')
				}
				const castHash = zeroXLowerHexCastHash(cast.hash)
				const timestamp = Date.parse(cast.timestamp ?? '')
				if (cast.author?.fid == null) {
					throw new Error('Neynar_Rest: cast missing author fid')
				}
				if (
					'hash' in entityId
					&& castHash !== zeroXLowerHexCastHash(entityId.hash)
				) {
					throw new Error('Neynar_Rest: cast hash mismatch')
				}
				if (
					'fid' in entityId
					&& cast.author.fid !== entityId.fid
				) {
					throw new Error('Neynar_Rest: cast author mismatch')
				}
				if (!Number.isFinite(timestamp)) {
					throw new Error('Neynar_Rest: cast missing timestamp')
				}
				const castId: EntityIdCast = {
					fid: cast.author.fid,
					hash: castHash,
				}
				const mentionFids = (
					(cast.mentioned_profiles ?? [])
						.map((u) => u.fid)
						.filter((fidValue): fidValue is number => fidValue != null)
				)
				const mentionChIds = (
					(cast.mentioned_channels ?? [])
						.map((ch) => optionalNonemptyString(ch.id))
						.filter((idValue): idValue is string => idValue != null)
				)
				const channelId = optionalNonemptyString(cast.channel?.id)
				const parentUrl = optionalNonemptyString(cast.parent_url ?? cast.root_parent_url)
				const likeCount = cast.likes ?? cast.reactions?.likes_count
				const recastCount = cast.recasts ?? cast.reactions?.recasts_count
				const replyCount = cast.replies?.count
				return {
					fid: cast.author.fid,
					hash: castHash,
					...(cast.author.username != null && cast.author.username !== '' && {
						username: cast.author.username,
					}),
					...('clientUrl' in entityId && {
						clientUrl: entityId.clientUrl,
					}),
					$author: {
						[EntityMetaKey.Id]: { fid: cast.author.fid },
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					$postedViaApp: (
						cast.app?.fid == null ?
							undefined
						:
							({
								[EntityMetaKey.Id]: { fid: cast.app.fid },
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>)
					),
					text: optionalNonemptyString(cast.text) ?? '',
					$parentCast: (
						cast.parent_author?.fid == null
						|| cast.parent_hash == null
						|| cast.parent_hash === '' ?
							undefined
						:
							{
								[EntityMetaKey.Id]: {
									fid: cast.parent_author.fid,
									hash: zeroXLowerHexCastHash(String(cast.parent_hash)),
								},
							} satisfies Entity<typeof schema, EntityType.FarcasterCast>
					),
					...(parentUrl != null && { parentUrl }),
					timestamp,
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
							url: optionalNonemptyString(embed.url),
							$embeddedCast: (
								embed.cast?.hash != null && embed.cast.author?.fid != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast.author.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>
								: embed.cast_id?.fid != null && embed.cast_id.hash != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast_id.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast_id.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>
								:
									undefined
							),
							title: optionalNonemptyString(embed.metadata?.html?.ogTitle),
							description: optionalNonemptyString(embed.metadata?.html?.ogDescription),
							...((
								iconMedia,
							) => (
								iconMedia != null && {
									$icon: iconMedia,
								}
							))(mediaFromUrl(neynarPfpHttpUrl(
								og0 ?? undefined,
								{ pageBaseUrl: optionalNonemptyString(embed.url) },
							), MediaType.Image)),
							quotedPreviewText: optionalNonemptyString(embed.cast?.text),
						}) satisfies CastEmbedEntity)
					}),
					...(likeCount != null && { likeCount }),
					...(recastCount != null && { recastCount }),
					...(replyCount != null && { replyCount }),
					...(cast.thread_hash != null && cast.thread_hash !== '' && {
						threadHash: zeroXLowerHexCastHash(String(cast.thread_hash)),
					}),
					$channel: (
						channelId == null ? undefined : {
							[EntityMetaKey.Id]: {
								id: channelId,
							},
						} satisfies Entity<typeof schema, EntityType.FarcasterChannel>
					),
				} satisfies Partial<FieldValuesCast>
			},
				['clientUrl']: async (entityId, context) => {
				const {
					getCastByClientUrl,
					getCastByHash,
				} = await import('$/sources/Neynar/Rest/queries.ts')
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type EntityIdCast = import('$/schema/$schema.ts').EntityId<typeof schema, EntityType.FarcasterCast>
				type FieldValuesCast = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				const cast = await (
					'hash' in entityId ?
						singleFlight(getCastByHash)(
							context.publicEnv,
							zeroXLowerHexCastHash(entityId.hash),
						)
					: 'clientUrl' in entityId ?
						singleFlight(getCastByClientUrl)(context.publicEnv, entityId.clientUrl)
					:
						undefined
				)
				if (cast == null) {
					throw new Error('Neynar_Rest: cast not found')
				}
				const castHash = zeroXLowerHexCastHash(cast.hash)
				const timestamp = Date.parse(cast.timestamp ?? '')
				if (cast.author?.fid == null) {
					throw new Error('Neynar_Rest: cast missing author fid')
				}
				if (
					'hash' in entityId
					&& castHash !== zeroXLowerHexCastHash(entityId.hash)
				) {
					throw new Error('Neynar_Rest: cast hash mismatch')
				}
				if (
					'fid' in entityId
					&& cast.author.fid !== entityId.fid
				) {
					throw new Error('Neynar_Rest: cast author mismatch')
				}
				if (!Number.isFinite(timestamp)) {
					throw new Error('Neynar_Rest: cast missing timestamp')
				}
				const castId: EntityIdCast = {
					fid: cast.author.fid,
					hash: castHash,
				}
				const mentionFids = (
					(cast.mentioned_profiles ?? [])
						.map((u) => u.fid)
						.filter((fidValue): fidValue is number => fidValue != null)
				)
				const mentionChIds = (
					(cast.mentioned_channels ?? [])
						.map((ch) => optionalNonemptyString(ch.id))
						.filter((idValue): idValue is string => idValue != null)
				)
				const channelId = optionalNonemptyString(cast.channel?.id)
				const parentUrl = optionalNonemptyString(cast.parent_url ?? cast.root_parent_url)
				const likeCount = cast.likes ?? cast.reactions?.likes_count
				const recastCount = cast.recasts ?? cast.reactions?.recasts_count
				const replyCount = cast.replies?.count
				return {
					fid: cast.author.fid,
					hash: castHash,
					...(cast.author.username != null && cast.author.username !== '' && {
						username: cast.author.username,
					}),
					...('clientUrl' in entityId && {
						clientUrl: entityId.clientUrl,
					}),
					$author: {
						[EntityMetaKey.Id]: { fid: cast.author.fid },
					} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
					$postedViaApp: (
						cast.app?.fid == null ?
							undefined
						:
							({
								[EntityMetaKey.Id]: { fid: cast.app.fid },
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>)
					),
					text: optionalNonemptyString(cast.text) ?? '',
					$parentCast: (
						cast.parent_author?.fid == null
						|| cast.parent_hash == null
						|| cast.parent_hash === '' ?
							undefined
						:
							{
								[EntityMetaKey.Id]: {
									fid: cast.parent_author.fid,
									hash: zeroXLowerHexCastHash(String(cast.parent_hash)),
								},
							} satisfies Entity<typeof schema, EntityType.FarcasterCast>
					),
					...(parentUrl != null && { parentUrl }),
					timestamp,
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
							url: optionalNonemptyString(embed.url),
							$embeddedCast: (
								embed.cast?.hash != null && embed.cast.author?.fid != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast.author.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>
								: embed.cast_id?.fid != null && embed.cast_id.hash != null ?
									{
										[EntityMetaKey.Id]: {
											fid: embed.cast_id.fid,
											hash: zeroXLowerHexCastHash(String(embed.cast_id.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>
								:
									undefined
							),
							title: optionalNonemptyString(embed.metadata?.html?.ogTitle),
							description: optionalNonemptyString(embed.metadata?.html?.ogDescription),
							...((
								iconMedia,
							) => (
								iconMedia != null && {
									$icon: iconMedia,
								}
							))(mediaFromUrl(neynarPfpHttpUrl(
								og0 ?? undefined,
								{ pageBaseUrl: optionalNonemptyString(embed.url) },
							), MediaType.Image)),
							quotedPreviewText: optionalNonemptyString(embed.cast?.text),
						}) satisfies CastEmbedEntity)
					}),
					...(likeCount != null && { likeCount }),
					...(recastCount != null && { recastCount }),
					...(replyCount != null && { replyCount }),
					...(cast.thread_hash != null && cast.thread_hash !== '' && {
						threadHash: zeroXLowerHexCastHash(String(cast.thread_hash)),
					}),
					$channel: (
						channelId == null ? undefined : {
							[EntityMetaKey.Id]: {
								id: channelId,
							},
						} satisfies Entity<typeof schema, EntityType.FarcasterChannel>
					),
				} satisfies Partial<FieldValuesCast>
			}
			},
		})({
				fields: {
				fid: (cast) => cast.fid,
				hash: (cast) => cast.hash,
				username: (cast) => cast.username,
				clientUrl: (cast) => cast.clientUrl,
				$author: (cast) => cast.$author,
				$postedViaApp: (cast) => cast.$postedViaApp,
				text: (cast) => cast.text,
				$parentCast: (cast) => cast.$parentCast,
				parentUrl: (cast) => cast.parentUrl,
				timestamp: (cast) => cast.timestamp,
				mentions: (cast) => cast.mentions,
				mentionedProfileFids: (cast) => cast.mentionedProfileFids,
				mentionedChannelIds: (cast) => cast.mentionedChannelIds,
				$$embeds: (cast) => cast.$$embeds,
				likeCount: (cast) => cast.likeCount,
				recastCount: (cast) => cast.recastCount,
				replyCount: (cast) => cast.replyCount,
				threadHash: (cast) => cast.threadHash,
				$channel: (cast) => cast.$channel,
			},
			}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				if (entityId.variant === 'trending') {
					const page = await singleFlight(getFeed)(
						context.publicEnv,
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
								|| cast.hash === '' ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>]
							))
					)
				}
				if (entityId.variant === 'byUser') {
					const page = await singleFlight(getFeed)(
						context.publicEnv,
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
								|| cast.hash === '' ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>]
							))
					)
				}
				if (entityId.variant === 'byChannel') {
					const page = await singleFlight(getFeed)(
						context.publicEnv,
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
								|| cast.hash === '' ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>]
							))
					)
				}
					const page = await singleFlight(getFeed)(
						context.publicEnv,
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
							|| cast.hash === '' ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterCast>]
							))
					)
			}
			},
		})({
				fields: {
				$$entries: (entries) => entries,
			},
			}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(getFeed)(
					context.publicEnv,
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
							|| cast.hash === '' ?
								[]
							:
								[{
									[EntityMetaKey.Id]: {
										fid: cast.author.fid,
										hash: zeroXLowerHexCastHash(String(cast.hash)),
									},
								} satisfies Entity<typeof schema, EntityType.FarcasterCast>]
						))
				)
			}
			},
		})({
				fields: {
				$$casts: (casts) => casts,
			},
			}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const page = await singleFlight(getFeed)(
					context.publicEnv,
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
							|| cast.hash === '' ?
								[]
							:
								[{
									[EntityMetaKey.Id]: {
										fid: cast.author.fid,
										hash: zeroXLowerHexCastHash(String(cast.hash)),
									},
								} satisfies Entity<typeof schema, EntityType.FarcasterCast>]
						))
				)
			}
			},
		})({
				fields: {
				$$casts: (casts) => casts,
			},
			}),

	],
}
