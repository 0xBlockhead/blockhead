import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { FarcasterUserSelector } from '$/schema/FarcasterUser.ts'
import { BlockheadFarcasterAccountConnectionSelector } from '$/schema/BlockheadFarcasterAccountConnection.ts'
import { FarcasterCastSelector } from '$/schema/FarcasterCast.ts'
import { FarcasterFeedSelector } from '$/schema/FarcasterFeed.ts'
import { FarcasterChannelSelector } from '$/schema/FarcasterChannel.ts'

type CastHash = `0x${string}`

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
	options?: { pageBaseUrl?: string }
) => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(
		raw.startsWith('/') && options?.pageBaseUrl != null ?
			new URL(raw, options.pageBaseUrl).toString()
		:
			raw
		)?.url
}


export default {
	source: Source.Neynar_Rest,

	resolvers: [
		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: async ({ fid }, context) => {
					const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
					const bulkUsers = await getBulkUsers({
						publicEnv: context.publicEnv,
						fids: [fid],
					})
					const user = bulkUsers?.users.find((neynarUser) => neynarUser.fid === fid)
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
									[EntityMetaKey.Selector]: {
										address: EvmAddress.assert(ethAddresses.at(0)),
									},
								},
							}
					)
					const username = optionalNonemptyString(user.username)
					const displayName = optionalNonemptyString(user.display_name)
					const bio = optionalNonemptyString(
						bioRaw != null && typeof bioRaw === 'object' ? bioRaw.text : bioRaw ?? undefined
					)
					const iconUrl = neynarPfpHttpUrl(user.pfp_url)
					const iconMedia = iconUrl == null ? undefined : mediaFromUrl(iconUrl, MediaType.Image)
					return {
						...(username != null && { username }),
						...(displayName != null && { displayName }),
						...(iconUrl != null && { iconUrl }),
						...(iconMedia != null && { $icon: iconMedia }),
						...(bio != null && { bio }),
						...verifiedPart,
						$$verifiedAddresses: [
							...ethAddresses.map((address) => (
							((evmAddress) => ({
								[EntityMetaKey.Selector]: {
									fid: fid,
									protocol: 'ethereum' as const,
									address: evmAddress,
								},
								$user: {
									[EntityMetaKey.Selector]: { fid },
								},
								$evmAccount: {
									[EntityMetaKey.Selector]: {
										address: evmAddress,
									},
								},
								protocol: 'ethereum' as const,
								address: evmAddress,
							}))(EvmAddress.assert(address))
							)),
							...solAddresses.map((address) => ({
								[EntityMetaKey.Selector]: {
									fid: fid,
									protocol: 'solana' as const,
									address,
								},
								$user: {
									[EntityMetaKey.Selector]: { fid },
								},
								$solanaAccount: {
									[EntityMetaKey.Selector]: {
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
				iconUrl: (user) => user.iconUrl,
				$icon: (user) => user.$icon,
				bio: (user) => user.bio,
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses,
			},
		}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[BlockheadFarcasterAccountConnectionSelector.Fid]: async ({ fid }, context) => {
					const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
					const bulkUsers = await getBulkUsers({
						publicEnv: context.publicEnv,
						fids: [fid],
					})
					const user = bulkUsers?.users.find((neynarUser) => neynarUser.fid === fid)
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
						bioRaw != null && typeof bioRaw === 'object' ? bioRaw.text : bioRaw ?? undefined
					)
					const iconUrl = neynarPfpHttpUrl(user.pfp_url)
					const iconMedia = iconUrl == null ? undefined : mediaFromUrl(iconUrl, MediaType.Image)
					return {
						...(username != null && { username }),
						...(displayName != null && { displayName }),
						...(iconUrl != null && { iconUrl }),
						...(iconMedia != null && { $icon: iconMedia }),
						...(bio != null && { bio }),
						...(ethList.length > 0 && { verifications: ethList }),
					}
				}
			},
		})({
			fields: {
				username: (connection) => connection.username,
				displayName: (connection) => connection.displayName,
				iconUrl: (connection) => connection.iconUrl,
				$icon: (connection) => connection.$icon,
				bio: (connection) => connection.bio,
				verifications: (connection) => connection.verifications,
			},
		}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.FidHash]: async ({ fid, hash }, context) => {
					const {
						getCastByHash,
					} = await import('$/sources/Neynar/Rest/queries.ts')
					const cast = await getCastByHash(
						context.publicEnv,
						zeroXLowerHexCastHash(hash)
					)
					if (cast == null)
						throw new Error('Neynar_Rest: cast not found')
					const castHash = zeroXLowerHexCastHash(cast.hash)
					const timestamp = Date.parse(cast.timestamp ?? '')
					if (cast.author?.fid == null)
						throw new Error('Neynar_Rest: cast missing author fid')
					if (
					castHash !== zeroXLowerHexCastHash(hash)
					) {
						throw new Error('Neynar_Rest: cast hash mismatch')
					}
					if (
					cast.author.fid !== fid
					) {
						throw new Error('Neynar_Rest: cast author mismatch')
					}
					if (!Number.isFinite(timestamp))
						throw new Error('Neynar_Rest: cast missing timestamp')
					const castId = {
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
					return {
						fid: cast.author.fid,
						hash: castHash,
						clientUrl: undefined,
						...(cast.author.username != null && cast.author.username !== '' && {
							username: cast.author.username,
						}),
						$author: {
							[EntityMetaKey.Selector]: { fid: cast.author.fid },
						},
						$postedViaApp: (
							cast.app?.fid == null ?
								undefined
							:
								({
									[EntityMetaKey.Selector]: { fid: cast.app.fid },
								})
						),
						text: optionalNonemptyString(cast.text) ?? '',
						$parentCast: (
							cast.parent_author?.fid == null
						|| cast.parent_hash == null
						|| cast.parent_hash === '' ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
										fid: cast.parent_author.fid,
										hash: zeroXLowerHexCastHash(String(cast.parent_hash)),
									},
								}
						),
						...(parentUrl != null && { parentUrl }),
						timestamp,
						mentions: cast.mentions,
						mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
						mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
						$$embeds: (cast.embeds ?? []).map((embed, indexInCast) => {
							const ogImages = embed.metadata?.html?.ogImage
							const og0 = ogImages?.[0]?.url
							return (({
								[EntityMetaKey.Selector]: {
									$cast: castId,
									indexInCast,
								},
								url: optionalNonemptyString(embed.url),
								$embeddedCast: (
									embed.cast?.hash != null && embed.cast.author?.fid != null ?
										{
											[EntityMetaKey.Selector]: {
												fid: embed.cast.author.fid,
												hash: zeroXLowerHexCastHash(String(embed.cast.hash)),
											},
										}
									:
										embed.cast_id?.fid != null && embed.cast_id.hash != null ?
											{
												[EntityMetaKey.Selector]: {
													fid: embed.cast_id.fid,
													hash: zeroXLowerHexCastHash(String(embed.cast_id.hash)),
												},
											}
										:
											undefined
								),
								title: optionalNonemptyString(embed.metadata?.html?.ogTitle),
								description: optionalNonemptyString(embed.metadata?.html?.ogDescription),
								...((iconUrl) => (
									iconUrl == null ?
										{}
									:
										{
											iconUrl,
											...((iconMedia) => iconMedia != null && { $icon: iconMedia })(mediaFromUrl(iconUrl, MediaType.Image)),
										}
								))(neynarPfpHttpUrl(
									og0 ?? undefined,
									{ pageBaseUrl: optionalNonemptyString(embed.url) }
								)),
								quotedPreviewText: optionalNonemptyString(embed.cast?.text),
							}))
						}),
						...(cast.thread_hash != null && cast.thread_hash !== '' && {
							threadHash: zeroXLowerHexCastHash(String(cast.thread_hash)),
						}),
						$channel: (
							channelId == null ? undefined : {
								[EntityMetaKey.Selector]: {
									id: channelId,
								},
							}
						),
					}
				},
				[FarcasterCastSelector.ClientUrl]: async ({ clientUrl }, context) => {
					const {
						getCastByClientUrl,
					} = await import('$/sources/Neynar/Rest/queries.ts')
					const cast = await getCastByClientUrl(context.publicEnv, clientUrl)
					if (cast == null)
						throw new Error('Neynar_Rest: cast not found')
					const castHash = zeroXLowerHexCastHash(cast.hash)
					const timestamp = Date.parse(cast.timestamp ?? '')
					if (cast.author?.fid == null)
						throw new Error('Neynar_Rest: cast missing author fid')
					if (!Number.isFinite(timestamp))
						throw new Error('Neynar_Rest: cast missing timestamp')
					const castId = {
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
					return {
						fid: cast.author.fid,
						hash: castHash,
						...(cast.author.username != null && cast.author.username !== '' && {
							username: cast.author.username,
						}),
						clientUrl,
						$author: {
							[EntityMetaKey.Selector]: { fid: cast.author.fid },
						},
						$postedViaApp: (
							cast.app?.fid == null ?
								undefined
							:
								({
									[EntityMetaKey.Selector]: { fid: cast.app.fid },
								})
						),
						text: optionalNonemptyString(cast.text) ?? '',
						$parentCast: (
							cast.parent_author?.fid == null
						|| cast.parent_hash == null
						|| cast.parent_hash === '' ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: {
										fid: cast.parent_author.fid,
										hash: zeroXLowerHexCastHash(String(cast.parent_hash)),
									},
								}
						),
						...(parentUrl != null && { parentUrl }),
						timestamp,
						mentions: cast.mentions,
						mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
						mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
						$$embeds: (cast.embeds ?? []).map((embed, indexInCast) => {
							const ogImages = embed.metadata?.html?.ogImage
							const og0 = ogImages?.[0]?.url
							return (({
								[EntityMetaKey.Selector]: {
									$cast: castId,
									indexInCast,
								},
								url: optionalNonemptyString(embed.url),
								$embeddedCast: (
									embed.cast?.hash != null && embed.cast.author?.fid != null ?
										{
											[EntityMetaKey.Selector]: {
												fid: embed.cast.author.fid,
												hash: zeroXLowerHexCastHash(String(embed.cast.hash)),
											},
										}
									:
										embed.cast_id?.fid != null && embed.cast_id.hash != null ?
											{
												[EntityMetaKey.Selector]: {
													fid: embed.cast_id.fid,
													hash: zeroXLowerHexCastHash(String(embed.cast_id.hash)),
												},
											}
										:
											undefined
								),
								title: optionalNonemptyString(embed.metadata?.html?.ogTitle),
								description: optionalNonemptyString(embed.metadata?.html?.ogDescription),
								...((iconUrl) => (
									iconUrl == null ?
										{}
									:
										{
											iconUrl,
											...((iconMedia) => iconMedia != null && { $icon: iconMedia })(mediaFromUrl(iconUrl, MediaType.Image)),
										}
								))(neynarPfpHttpUrl(
									og0 ?? undefined,
									{ pageBaseUrl: optionalNonemptyString(embed.url) }
								)),
								quotedPreviewText: optionalNonemptyString(embed.cast?.text),
							}))
						}),
						...(cast.thread_hash != null && cast.thread_hash !== '' && {
							threadHash: zeroXLowerHexCastHash(String(cast.thread_hash)),
						}),
						$channel: (
							channelId == null ? undefined : {
								[EntityMetaKey.Selector]: {
									id: channelId,
								},
							}
						),
					}
				},
			},
		})({
			fields: {
				fid: (cast) => cast.fid,
				hash: (cast) => cast.hash,
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
				threadHash: (cast) => cast.threadHash,
				$channel: (cast) => cast.$channel,
			},
		}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[FarcasterFeedSelector.Variant]: async ({ variant }, context) => {
					const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
					if (variant !== 'trending') throw new Error(`Neynar_Rest: unsupported feed variant ${variant}`)
					const limit = resolverContextRowLimit(context)
					const page = await getFeed(
						context.publicEnv,
						{
							feedType: 'filter',
							filterType: 'global_trending',
							limit,
						}
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
										[EntityMetaKey.Selector]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									}]
							))
					)
				},
				[FarcasterFeedSelector.ByUser]: async ({ fid }, context) => {
					const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const page = await getFeed(
						context.publicEnv,
						{
							feedType: 'filter',
							filterType: 'fids',
							fids: [fid],
							limit,
						}
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
										[EntityMetaKey.Selector]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									}]
							))
					)
				},
				[FarcasterFeedSelector.ByChannel]: async ({ channelId }, context) => {
					const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const page = await getFeed(
						context.publicEnv,
						{
							feedType: 'filter',
							filterType: 'channel_id',
							channelId: channelId,
							limit,
						}
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
										[EntityMetaKey.Selector]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									}]
							))
					)
				},
				[FarcasterFeedSelector.Following]: async ({ viewerFid }, context) => {
					const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const page = await getFeed(
						context.publicEnv,
						{
							feedType: 'following',
							fid: viewerFid,
							limit,
						}
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
										[EntityMetaKey.Selector]: {
											fid: cast.author.fid,
											hash: zeroXLowerHexCastHash(String(cast.hash)),
										},
									}]
							))
					)
				},
			},
		})({
			fields: {
				$$entries: (entries) => entries,
			},
		}),

		defineResolver(Source.Neynar_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: async ({ fid }, context) => {
					const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const page = await getFeed(
						context.publicEnv,
						{
							feedType: 'filter',
							filterType: 'fids',
							fids: [fid],
							limit,
						}
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
									[EntityMetaKey.Selector]: {
										fid: cast.author.fid,
										hash: zeroXLowerHexCastHash(String(cast.hash)),
									},
								}]
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
				[FarcasterChannelSelector.Id]: async ({ id }, context) => {
					const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const page = await getFeed(
						context.publicEnv,
						{
							feedType: 'filter',
							filterType: 'channel_id',
							channelId: id,
							limit,
						}
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
									[EntityMetaKey.Selector]: {
										fid: cast.author.fid,
										hash: zeroXLowerHexCastHash(String(cast.hash)),
									},
								}]
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
