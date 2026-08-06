import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	NeynarCast,
	NeynarChannel,
} from '$/sources/Neynar/Rest/types.ts'

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

const neynarCastTimestamps = (
	cast: NeynarCast,
	castId: {
		fid: number
		hash: CastHash
	}
) => (
	[{
		[EntityMetaKey.Selector]: {
			$cast: castId,
			timestampMs: Date.now(),
			source: Source.Neynar_Rest,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'likeCount')]:
				cast.reactions.likes_count,
			[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'recastCount')]:
				cast.reactions.recasts_count,
			[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'replyCount')]:
				cast.replies.count,
		},
	}]
)


const neynarCastSnapshot = (
	cast: NeynarCast,
	extras?: {
		clientUrl?: string
		username?: string
		hashPrefix?: CastHash
	},
) => {
	const castHash = zeroXLowerHexCastHash(cast.hash)
	const timestamp = Date.parse(cast.timestamp)
	if (!Number.isFinite(timestamp))
		throw new Error('Neynar_Rest: cast missing timestamp')
	const castId = {
		fid: cast.author.fid,
		hash: castHash,
	}
	const mentionFids = (
		cast.mentioned_profiles.map((user) => user.fid)
	)
	const mentionChIds = (
		cast.mentioned_channels
			.map((channel) => optionalNonemptyString(channel.id))
			.filter((idValue): idValue is string => idValue != null)
	)
	const channelId = optionalNonemptyString(cast.channel?.id)
	const parentUrl = optionalNonemptyString(cast.parent_url)
	const rootParentUrl = optionalNonemptyString(cast.root_parent_url)
	const username = extras?.username ?? (
		cast.author.username !== '' ? cast.author.username : undefined
	)
	return {
		fid: cast.author.fid,
		hash: castHash,
		...(extras?.clientUrl != null && { clientUrl: extras.clientUrl }),
		...(username != null && { username }),
		...(extras?.hashPrefix != null && { hashPrefix: extras.hashPrefix }),
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
			cast.parent_author.fid == null
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
		...(rootParentUrl != null && { rootParentUrl }),
		timestamp,
		mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
		mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
		$$embeds: neynarCastEmbedRows(cast, castId),
		$$timestamps: neynarCastTimestamps(cast, castId),
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
}

const neynarCastSummaryReference = (cast: NeynarCast) => {
	if (
		!Number.isSafeInteger(cast.author.fid)
		|| cast.author.fid < 0
		|| !ZeroExHex.allows(cast.hash)
		|| cast.hash === '0x'
	)
		return []

	const hash = zeroXLowerHexCastHash(String(cast.hash))
	const text = optionalNonemptyString(cast.text)
	const timestamp = optionalTimestampMs(cast.timestamp)
	const username = optionalNonemptyString(cast.author.username)
	const channelId = optionalNonemptyString(cast.channel?.id)
	return [{
		[EntityMetaKey.Selector]: {
			fid: cast.author.fid,
			hash,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]: cast.author.fid,
			[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]: hash,
			[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
				[EntityMetaKey.Selector]: { fid: cast.author.fid },
			},
			...(text != null && {
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: text,
			}),
			...(timestamp != null && {
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'timestamp')]: timestamp,
			}),
			...(username != null && {
				[entityFieldAddressKey(EntityType.FarcasterCast, [], 'username')]: username,
			}),
			...(channelId != null && {
				[entityFieldAddressKey(EntityType.FarcasterCast, [], '$channel')]: {
					[EntityMetaKey.Selector]: { id: channelId },
				},
			}),
		},
	}]
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

const neynarCastEmbedRows = (
	cast: NeynarCast,
	castId: {
		fid: number
		hash: CastHash
	}
) => cast.embeds.map((embed, indexInCast) => {
	const url = 'url' in embed ? optionalNonemptyString(embed.url) : undefined
	const metadata = 'url' in embed ? embed.metadata?.html : undefined
	const embeddedCast = 'cast' in embed ? embed.cast : undefined
	const iconUrl = neynarPfpHttpUrl(
		metadata?.ogImage?.[0]?.url,
		{ pageBaseUrl: url }
	)
	return {
		[EntityMetaKey.Selector]: {
			$cast: castId,
			indexInCast,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'url')]: url,
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], '$embeddedCast')]: (
				embeddedCast == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: {
							fid: embeddedCast.author.fid,
							hash: zeroXLowerHexCastHash(embeddedCast.hash),
						},
					}
			),
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'title')]: optionalNonemptyString(metadata?.ogTitle),
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'description')]: optionalNonemptyString(metadata?.ogDescription),
			...(iconUrl != null && {
				[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'iconUrl')]: iconUrl,
				...((iconMedia) => iconMedia != null && {
					[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], '$icon')]: iconMedia,
				})(mediaFromUrl(iconUrl, MediaType.Image)),
			}),
			[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'quotedPreviewText')]: optionalNonemptyString(embeddedCast?.text),
		},
	}
})

const neynarChannelFields = (channel: NeynarChannel) => {
	const parentUrl = optionalNonemptyString(channel.parent_url)
	if (parentUrl == null)
		throw new Error('Neynar_Rest: channel missing parent URL')

	const iconUrl = neynarPfpHttpUrl(channel.image_url)
	const moderatorFids = [
		...(channel.moderator?.fid == null ? [] : [channel.moderator.fid]),
		...(channel.moderator_fids ?? []),
	].filter((fid, index, fids) => fids.indexOf(fid) === index)
	const moderatorFid = moderatorFids.at(0)
	const timestampMs = Date.now()

	return {
		id: channel.id,
		parentUrl,
		createdAt: optionalTimestampMs(channel.created_at),
		$lead: (
			channel.lead?.fid == null ?
				undefined
			:
				{
					[EntityMetaKey.Selector]: { fid: channel.lead.fid },
				}
		),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$channel: { id: channel.id },
				timestampMs,
				source: Source.Neynar_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'name')]: optionalNonemptyString(channel.name),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'description')]: optionalNonemptyString(channel.description),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'iconUrl')]: iconUrl,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$icon')]: mediaFromUrl(iconUrl, MediaType.Image),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$moderator')]: (
					moderatorFid == null ?
						undefined
					:
						{
							[EntityMetaKey.Selector]: { fid: moderatorFid },
						}
				),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], '$$moderators')]: moderatorFids.map((fid) => ({
					[EntityMetaKey.Selector]: { fid },
				})),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'pinnedCastHash')]: optionalNonemptyString(channel.pinned_cast_hash),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'externalLinkTitle')]: optionalNonemptyString(channel.external_link?.title),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'externalLinkUrl')]: optionalNonemptyString(channel.external_link?.url),
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'followerCount')]: channel.follower_count,
				[entityFieldAddressKey(EntityType.FarcasterChannel_Timestamp, [], 'memberCount')]: channel.member_count,
			},
		}],
	}
}


export default {
	source: Source.Neynar_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }, context) => {
						const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
						const users = await getBulkUsers({
							publicEnv: context.publicEnv,
							fids: [fid],
						})
						const user = users.find((neynarUser) => neynarUser.fid === fid)
						if (user == null) throw new Error('Neynar_Rest: user not found')
						const bioRaw = user.profile.bio
						const ethAddresses = (
							[
								...(user.verified_addresses.primary.eth_address != null ?
									[user.verified_addresses.primary.eth_address]
								:
									[]),
								...user.verified_addresses.eth_addresses,
							]
								.map(optionalNonemptyString)
								.filter((address): address is string => address != null)
								.filter((address, index, addresses) => addresses.indexOf(address) === index)
						)
						const solAddresses = (
							[
								...(user.verified_addresses.primary.sol_address != null ?
									[user.verified_addresses.primary.sol_address]
								:
									[]),
								...user.verified_addresses.sol_addresses,
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
						const bio = optionalNonemptyString(bioRaw.text)
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
											fid,
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$user: { fid },
									timestampMs: Date.now(),
									source: Source.Neynar_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followerCount')]:
										user.follower_count,
									[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followingCount')]:
										user.following_count,
								},
							}],
						}
					},
				},
			},
		})({
			username: (user) => user.username,
			displayName: (user) => user.displayName,
			iconUrl: (user) => user.iconUrl,
			$icon: (user) => user.$icon,
			bio: (user) => user.bio,
			$primaryEvmAccount: (user) => user.$primaryEvmAccount,
			$$verifiedAddresses: (user) => user.$$verifiedAddresses,
			$$timestamps: (user) => user.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }, context) => {
						const {
							getChannelMembersPage,
							getUserChannelsPage,
						} = await import('$/sources/Neynar/Rest/queries.ts')
						const page = await getUserChannelsPage(context.publicEnv, {
							fid,
							limit: resolverContextRowLimit(context),
							cursor: context.providerContinuationToken,
						})
						const timestampMs = Date.now()

						return {
							rows: await Promise.all(page.channels.map(async (channel) => {
								const members = (
									await getChannelMembersPage(context.publicEnv, {
										channelId: channel.id,
										fid,
										limit: 1,
									})
								).members
								if (members.some((member) => member.user.fid !== fid))
									throw new Error('Neynar_Rest: channel member subject mismatch')
								if (members.length > 1)
									throw new Error('Neynar_Rest: duplicate channel member')

								return {
									[EntityMetaKey.Selector]: {
										$channel: { id: channel.id },
										$viewer: { fid },
										timestampMs,
										source: Source.Neynar_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'following')]: true,
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'member')]: members.length === 1,
										[entityFieldAddressKey(EntityType.FarcasterChannel_Viewer_Timestamp, [], 'role')]: members[0]?.role,
									},
								}
							})),
							nextCursor: page.next?.cursor,
						}
					},
				},
			},
		})({
			$$channelViewerTimestamps: {
				select: ({ rows }) => rows,
				continuation: ({ nextCursor }) => (
					nextCursor == null || nextCursor === '' ?
						{
							operation: 'user-channels',
							target: 'api',
							terminal: true,
						}
					:
						{
							operation: 'user-channels',
							target: 'api',
							terminal: false,
							token: nextCursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
						const { getChannel } = await import('$/sources/Neynar/Rest/queries.ts')
						const channel = await getChannel(context.publicEnv, {
							id,
							type: 'id',
						})
						if (channel.id !== id)
							throw new Error('Neynar_Rest: channel subject mismatch')

						return neynarChannelFields(channel)
					},
				},
				ParentUrl: {
					resolve: async ({ parentUrl }, context) => {
						const { getChannel } = await import('$/sources/Neynar/Rest/queries.ts')
						const channel = await getChannel(context.publicEnv, {
							id: parentUrl,
							type: 'parent_url',
						})
						if (channel.parent_url !== parentUrl)
							throw new Error('Neynar_Rest: channel subject mismatch')

						return neynarChannelFields(channel)
					},
				},
			},
		})({
			id: (channel) => channel.id,
			parentUrl: (channel) => channel.parentUrl,
			createdAt: (channel) => channel.createdAt,
			$lead: (channel) => channel.$lead,
			$$timestamps: (channel) => channel.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.FarcasterVerifiedAddress,
			resolve: {
				FidProtocolAddress: {
					resolve: async (verifiedAddress, context) => {
						const { getBulkUsers } = await import('$/sources/Neynar/Rest/queries.ts')
						const users = await getBulkUsers({
							publicEnv: context.publicEnv,
							fids: [verifiedAddress.fid],
						})
						const user = users.find((neynarUser) => neynarUser.fid === verifiedAddress.fid)
						if (user == null) throw new Error('Neynar_Rest: user not found')
						const ethAddresses = (
							[
								...(user.verified_addresses.primary.eth_address != null ?
									[user.verified_addresses.primary.eth_address]
								:
									[]),
								...user.verified_addresses.eth_addresses,
							]
								.map(optionalNonemptyString)
								.filter((address): address is string => address != null)
						)
						const solAddresses = (
							[
								...(user.verified_addresses.primary.sol_address != null ?
									[user.verified_addresses.primary.sol_address]
								:
									[]),
								...user.verified_addresses.sol_addresses,
							]
								.map(optionalNonemptyString)
								.filter((address): address is string => address != null)
						)
						const verified = (
							verifiedAddress.protocol === 'ethereum' ?
								ethAddresses.some((address) => EvmAddress.assert(address) === EvmAddress.assert(verifiedAddress.address))
							:
								solAddresses.includes(verifiedAddress.address)
						)
						if (!verified) throw new Error('Neynar_Rest: verified address not found')

						return {
							fid: verifiedAddress.fid,
							protocol: verifiedAddress.protocol,
							address: verifiedAddress.protocol === 'ethereum' ? EvmAddress.assert(verifiedAddress.address) : verifiedAddress.address,
							$user: {
								[EntityMetaKey.Selector]: {
									fid: verifiedAddress.fid,
								},
							},
							...(verifiedAddress.protocol === 'ethereum' && {
								$evmAccount: {
									[EntityMetaKey.Selector]: {
										address: EvmAddress.assert(verifiedAddress.address),
									},
								},
							}),
							...(verifiedAddress.protocol === 'solana' && {
								$solanaAccount: {
									[EntityMetaKey.Selector]: {
										$network: {
											caip2: {
												namespace: 'solana',
												reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
											},
										},
										pubkey: verifiedAddress.address,
									},
								},
							}),
						}
					},
				},
			},
		})({
			fid: (verifiedAddress) => verifiedAddress.fid,
			protocol: (verifiedAddress) => verifiedAddress.protocol,
			address: (verifiedAddress) => verifiedAddress.address,
			$user: (verifiedAddress) => verifiedAddress.$user,
			$evmAccount: (verifiedAddress) => verifiedAddress.$evmAccount,
			$solanaAccount: (verifiedAddress) => verifiedAddress.$solanaAccount,
		}),

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				FidHash: {
					resolve: async ({ fid, hash }, context) => {
						const {
							getCast,
						} = await import('$/sources/Neynar/Rest/queries.ts')
						const cast = await getCast(
							context.publicEnv,
							{
								identifier: zeroXLowerHexCastHash(hash),
								type: 'hash',
							}
						)
						if (cast == null)
							return {
								fid,
								hash: zeroXLowerHexCastHash(hash),
								$author: undefined,
								$postedViaApp: undefined,
								text: undefined,
								$parentCast: undefined,
								parentUrl: undefined,
								rootParentUrl: undefined,
								timestamp: undefined,
								mentionedProfileFids: undefined,
								mentionedChannelIds: undefined,
								$$embeds: [],
								$$timestamps: [],
								threadHash: undefined,
								$channel: undefined,
							}
						const castHash = zeroXLowerHexCastHash(cast.hash)
						const timestamp = Date.parse(cast.timestamp)
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
							cast.mentioned_profiles.map((user) => user.fid)
						)
						const mentionChIds = (
							cast.mentioned_channels
								.map((channel) => optionalNonemptyString(channel.id))
								.filter((idValue): idValue is string => idValue != null)
						)
						const channelId = optionalNonemptyString(cast.channel?.id)
						const parentUrl = optionalNonemptyString(cast.parent_url)
						const rootParentUrl = optionalNonemptyString(cast.root_parent_url)
						return {
							fid: cast.author.fid,
							hash: castHash,
							clientUrl: undefined,
							...(cast.author.username !== '' && {
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
								cast.parent_author.fid == null
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
							...(rootParentUrl != null && { rootParentUrl }),
							timestamp,
							mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
							mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
							$$embeds: neynarCastEmbedRows(cast, castId),
							$$timestamps: neynarCastTimestamps(cast, castId),
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
				ClientUrl: {
					resolve: async ({ clientUrl }, context) => {
						const {
							getCast,
						} = await import('$/sources/Neynar/Rest/queries.ts')
						const cast = await getCast(context.publicEnv, {
							identifier: clientUrl,
							type: 'url',
						})
						if (cast == null)
							throw new Error('Neynar_Rest: cast not found')
						const castHash = zeroXLowerHexCastHash(cast.hash)
						const timestamp = Date.parse(cast.timestamp)
						if (!Number.isFinite(timestamp))
							throw new Error('Neynar_Rest: cast missing timestamp')
						const castId = {
							fid: cast.author.fid,
							hash: castHash,
						}
						const mentionFids = (
							cast.mentioned_profiles.map((user) => user.fid)
						)
						const mentionChIds = (
							cast.mentioned_channels
								.map((channel) => optionalNonemptyString(channel.id))
								.filter((idValue): idValue is string => idValue != null)
						)
						const channelId = optionalNonemptyString(cast.channel?.id)
						const parentUrl = optionalNonemptyString(cast.parent_url)
						const rootParentUrl = optionalNonemptyString(cast.root_parent_url)
						return {
							fid: cast.author.fid,
							hash: castHash,
							...(cast.author.username !== '' && {
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
								cast.parent_author.fid == null
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
							...(rootParentUrl != null && { rootParentUrl }),
							timestamp,
							mentionedProfileFids: mentionFids.length > 0 ? mentionFids : undefined,
							mentionedChannelIds: mentionChIds.length > 0 ? mentionChIds : undefined,
							$$embeds: neynarCastEmbedRows(cast, castId),
							$$timestamps: neynarCastTimestamps(cast, castId),
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
				Hash: {
					resolve: async ({ hash }, context) => {
						const {
							getCast,
						} = await import('$/sources/Neynar/Rest/queries.ts')
						const castHash = zeroXLowerHexCastHash(hash)
						const cast = await getCast(
							context.publicEnv,
							{
								identifier: castHash,
								type: 'hash',
							}
						)
						if (cast == null)
							throw new Error('Neynar_Rest: cast not found')
						const resolvedHash = zeroXLowerHexCastHash(cast.hash)
						if (resolvedHash !== castHash)
							throw new Error('Neynar_Rest: cast hash mismatch')
						return neynarCastSnapshot(cast)
					},
				},
				UsernameHashPrefix: {
					resolve: async ({ username, hashPrefix }, context) => {
						const {
							getCast,
						} = await import('$/sources/Neynar/Rest/queries.ts')
						const normalizedPrefix = zeroXLowerHexCastHash(hashPrefix)
						const clientUrl = `https://warpcast.com/${username}/${normalizedPrefix}`
						const cast = await getCast(context.publicEnv, {
							identifier: clientUrl,
							type: 'url',
						})
						if (cast == null)
							throw new Error('Neynar_Rest: cast not found')
						const castHash = zeroXLowerHexCastHash(cast.hash)
						if (!castHash.startsWith(normalizedPrefix))
							throw new Error('Neynar_Rest: cast hash prefix mismatch')
						if (
							cast.author.username != null
							&& cast.author.username !== ''
							&& cast.author.username.toLowerCase() !== username.toLowerCase()
						)
							throw new Error('Neynar_Rest: cast author username mismatch')
						return neynarCastSnapshot(cast, {
							clientUrl,
							username,
							hashPrefix: normalizedPrefix,
						})
					},
				},
			},
		})({
				fid: (cast) => cast.fid,
				hash: (cast) => cast.hash,
				username: (cast) => cast.username,
				hashPrefix: (cast) => cast.hashPrefix,
				clientUrl: (cast) => cast.clientUrl,
				$author: (cast) => cast.$author,
				$postedViaApp: (cast) => cast.$postedViaApp,
				text: (cast) => cast.text,
				$parentCast: (cast) => cast.$parentCast,
				parentUrl: (cast) => cast.parentUrl,
				rootParentUrl: (cast) => cast.rootParentUrl,
				timestamp: (cast) => cast.timestamp,
				mentionedProfileFids: (cast) => cast.mentionedProfileFids,
				mentionedChannelIds: (cast) => cast.mentionedChannelIds,
				$$embeds: (cast) => cast.$$embeds,
				$$timestamps: (cast) => cast.$$timestamps,
				threadHash: (cast) => cast.threadHash,
				$channel: (cast) => cast.$channel,
			}),

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				FidHash: {
					resolve: async ({ fid, hash }, context) => {
						const { getCastConversation } = await import('$/sources/Neynar/Rest/queries.ts')
						const parentHash = zeroXLowerHexCastHash(hash)
						const conversationCast = (
							await getCastConversation(
								context.publicEnv,
								{
									identifier: parentHash,
									type: 'hash',
								}
							)
						)?.conversation.cast
						if (conversationCast == null)
							throw new Error('Neynar_Rest: conversation subject not found')
						if (
							conversationCast.author.fid !== fid
							|| zeroXLowerHexCastHash(conversationCast.hash) !== parentHash
						)
							throw new Error('Neynar_Rest: conversation subject mismatch')
						return {
							$$directReplies: (
								conversationCast.direct_replies
							).filter((reply) => (
								reply.parent_author.fid === fid
								&& reply.parent_hash != null
								&& zeroXLowerHexCastHash(reply.parent_hash) === parentHash
							)).flatMap(neynarCastSummaryReference)
								.map((reply) => ({
									...reply,
									[EntityMetaKey.Fields]: {
										...reply[EntityMetaKey.Fields],
										[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
											[EntityMetaKey.Selector]: {
												fid,
												hash: parentHash,
											},
										},
									},
								})),
						}
					},
				},
				ClientUrl: {
					resolve: async ({ clientUrl }, context) => {
						const { getCastConversation } = await import('$/sources/Neynar/Rest/queries.ts')
						const conversationCast = (
							await getCastConversation(
								context.publicEnv,
								{
									identifier: clientUrl,
									type: 'url',
								}
							)
						)?.conversation.cast
						if (
							conversationCast == null
							|| !ZeroExHex.allows(conversationCast.hash)
							|| conversationCast.hash === '0x'
						)
							throw new Error('Neynar_Rest: conversation subject not found')
						const parentHash = zeroXLowerHexCastHash(conversationCast.hash)
						return {
							$$directReplies: (
								conversationCast.direct_replies
							).filter((reply) => (
								reply.parent_author.fid === conversationCast.author.fid
								&& reply.parent_hash != null
								&& zeroXLowerHexCastHash(reply.parent_hash) === parentHash
							)).flatMap(neynarCastSummaryReference)
								.map((reply) => ({
									...reply,
									[EntityMetaKey.Fields]: {
										...reply[EntityMetaKey.Fields],
										[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
											[EntityMetaKey.Selector]: { clientUrl },
										},
									},
								})),
						}
					},
				},
				Hash: {
					resolve: async ({ hash }, context) => {
						const { getCastConversation } = await import('$/sources/Neynar/Rest/queries.ts')
						const parentHash = zeroXLowerHexCastHash(hash)
						const conversationCast = (
							await getCastConversation(
								context.publicEnv,
								{
									identifier: parentHash,
									type: 'hash',
								}
							)
						)?.conversation.cast
						if (conversationCast == null)
							throw new Error('Neynar_Rest: conversation subject not found')
						if (zeroXLowerHexCastHash(conversationCast.hash) !== parentHash)
							throw new Error('Neynar_Rest: conversation subject mismatch')
						const fid = conversationCast.author.fid
						return {
							$$directReplies: (
								conversationCast.direct_replies
							).filter((reply) => (
								reply.parent_author.fid === fid
								&& reply.parent_hash != null
								&& zeroXLowerHexCastHash(reply.parent_hash) === parentHash
							)).flatMap(neynarCastSummaryReference)
								.map((reply) => ({
									...reply,
									[EntityMetaKey.Fields]: {
										...reply[EntityMetaKey.Fields],
										[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
											[EntityMetaKey.Selector]: {
												hash: parentHash,
											},
										},
									},
								})),
						}
					},
				},
				UsernameHashPrefix: {
					resolve: async ({ username, hashPrefix }, context) => {
						const { getCastConversation } = await import('$/sources/Neynar/Rest/queries.ts')
						const normalizedPrefix = zeroXLowerHexCastHash(hashPrefix)
						const clientUrl = `https://warpcast.com/${username}/${normalizedPrefix}`
						const conversationCast = (
							await getCastConversation(
								context.publicEnv,
								{
									identifier: clientUrl,
									type: 'url',
								}
							)
						)?.conversation.cast
						if (
							conversationCast == null
							|| !ZeroExHex.allows(conversationCast.hash)
							|| conversationCast.hash === '0x'
						)
							throw new Error('Neynar_Rest: conversation subject not found')
						const parentHash = zeroXLowerHexCastHash(conversationCast.hash)
						if (!parentHash.startsWith(normalizedPrefix))
							throw new Error('Neynar_Rest: conversation subject hash prefix mismatch')
						return {
							$$directReplies: (
								conversationCast.direct_replies
							).filter((reply) => (
								reply.parent_author.fid === conversationCast.author.fid
								&& reply.parent_hash != null
								&& zeroXLowerHexCastHash(reply.parent_hash) === parentHash
							)).flatMap(neynarCastSummaryReference)
								.map((reply) => ({
									...reply,
									[EntityMetaKey.Fields]: {
										...reply[EntityMetaKey.Fields],
										[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
											[EntityMetaKey.Selector]: {
												username,
												hashPrefix: normalizedPrefix,
											},
										},
									},
								})),
						}
					},
				},
			},
		})({
				$$directReplies: (cast) => cast.$$directReplies,
			}),

		defineResolver({
			entityType: EntityType.FarcasterFeed,
			resolve: {
				Variant: {
					resolve: async ({ variant }, context) => {
						const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
						if (variant !== 'trending') throw new Error(`Neynar_Rest: unsupported feed variant ${variant}`)
						const limit = resolverContextRowLimit(context)
						const page = await getFeed(
							context.publicEnv,
							{
								feedType: 'filter',
								filterType: 'global_trending',
								limit,
								cursor: context.providerContinuationToken,
							}
						)
						if (page == null) throw new Error('Neynar_Rest: feed response missing')
						return page
					},
				},
				ByUser: {
					resolve: async ({ fid }, context) => {
						const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const page = await getFeed(
							context.publicEnv,
							{
								feedType: 'filter',
								filterType: 'fids',
								fids: [fid],
								limit,
								cursor: context.providerContinuationToken,
							}
						)
						if (page == null) throw new Error('Neynar_Rest: feed response missing')
						return page
					},
				},
				ByChannel: {
					resolve: async ({ channelId }, context) => {
						const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const page = await getFeed(
							context.publicEnv,
							{
								feedType: 'filter',
								filterType: 'channel_id',
								channelId: channelId,
								membersOnly: true,
								limit,
								cursor: context.providerContinuationToken,
							}
						)
						if (page == null) throw new Error('Neynar_Rest: feed response missing')
						return page
					},
				},
				Following: {
					resolve: async ({ viewerFid }, context) => {
						const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const page = await getFeed(
							context.publicEnv,
							{
								feedType: 'following',
								fid: viewerFid,
								limit,
								cursor: context.providerContinuationToken,
								viewerFid,
							}
						)
						if (page == null) throw new Error('Neynar_Rest: feed response missing')
						return page
					},
				},
			},
		})({
			$$entries: {
				select: (page, entitySelector) => (
					page.casts
						.filter((cast) => {
							if ('fid' in entitySelector && cast.author.fid !== entitySelector.fid) return false
							return !('channelId' in entitySelector) || cast.channel?.id === entitySelector.channelId
						})
						.flatMap(neynarCastSummaryReference)
				),
				continuation: (page, entitySelector) => (
					page.next.cursor == null || page.next.cursor === '' ?
						{
							operation: 'feed',
							target: 'api',
							...('viewerFid' in entitySelector && {
								viewerScope: String(entitySelector.viewerFid),
							}),
							terminal: true,
						}
					:
						{
							operation: 'feed',
							target: 'api',
							...('viewerFid' in entitySelector && {
								viewerScope: String(entitySelector.viewerFid),
							}),
							terminal: false,
							token: page.next.cursor,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }, context) => {
						const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const page = await getFeed(
							context.publicEnv,
							{
								feedType: 'filter',
								filterType: 'fids',
								fids: [fid],
								limit,
								cursor: context.providerContinuationToken,
							}
						)
						if (page == null) throw new Error('Neynar_Rest: feed response missing')
						return page
					},
				}
			},
		})({
				$$casts: {
					select: (page, { fid }) => (
						page.casts
							.filter((cast) => cast.author.fid === fid)
							.flatMap(neynarCastSummaryReference)
					),
					continuation: (page) => (
						page.next.cursor == null || page.next.cursor === '' ?
							{
								operation: 'user-feed',
								target: 'api',
								terminal: true,
							}
						:
							{
								operation: 'user-feed',
								target: 'api',
								terminal: false,
								token: page.next.cursor,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
						const { getFeed } = await import('$/sources/Neynar/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const page = await getFeed(
							context.publicEnv,
							{
								feedType: 'filter',
								filterType: 'channel_id',
								channelId: id,
								membersOnly: true,
								limit,
								cursor: context.providerContinuationToken,
							}
						)
						if (page == null) throw new Error('Neynar_Rest: feed response missing')
						return page
					},
				}
			},
		})({
				$$casts: {
					select: (page, { id }) => (
						page.casts
							.filter((cast) => cast.channel?.id === id)
							.flatMap(neynarCastSummaryReference)
					),
					continuation: (page) => (
						page.next.cursor == null || page.next.cursor === '' ?
							{
								operation: 'channel-feed',
								target: 'api',
								terminal: true,
							}
						:
							{
								operation: 'channel-feed',
								target: 'api',
								terminal: false,
								token: page.next.cursor,
							}
					),
				},
			}),

	],
} satisfies RegisteredSourceResolverModule
