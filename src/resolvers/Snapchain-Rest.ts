import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { SnapchainReactionType } from '$/constants/Snapchain.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { FarcasterUserSelector } from '$/schema/FarcasterUser.ts'
import { FarcasterUser_TimestampSelector } from '$/schema/FarcasterUser_Timestamp.ts'
import { FarcasterVerifiedAddressSelector } from '$/schema/FarcasterVerifiedAddress.ts'
import { FarcasterCastSelector } from '$/schema/FarcasterCast.ts'
import { FarcasterCastEmbedSelector } from '$/schema/FarcasterCastEmbed.ts'
import { FarcasterCast_TimestampSelector } from '$/schema/FarcasterCast_Timestamp.ts'
import { FarcasterNetworkSelector } from '$/schema/FarcasterNetwork.ts'
import { FarcasterChannelSelector } from '$/schema/FarcasterChannel.ts'
import { FarcasterFeedSelector } from '$/schema/FarcasterFeed.ts'

const lowerHex0xCastHash = (hash: `0x${string}`): `0x${string}` => (
	hexLowerOfByteSize(hash, 20)
		?? hexLowerOfByteSize(`${hash.slice(0, 2)}${hash.slice(2).toLowerCase()}`, 20)
		?? hash
)


const channelIdFromParentUrl = (parentUrl: string | undefined) => {
	const parentUrlString = optionalNonemptyString(parentUrl)
	if (parentUrlString == null) return undefined
	return (
		/warpcast\.com\/~\/channel\/([^/?#]+)/.exec(parentUrlString)?.[1]
		?? /farcaster\.xyz\/([^/?#]+)/.exec(parentUrlString)?.[1]
	)
}

const snapchainCastTimestampMs = (farcasterTimestamp: number | undefined) => (
	farcasterTimestamp != null && Number.isFinite(farcasterTimestamp) ?
		(
			farcasterTimestamp >= 1e12 ?
				farcasterTimestamp
			:
				farcasterTimestamp >= 1e9 ?
					farcasterTimestamp * 1000
				:
					(farcasterTimestamp + 1609459200) * 1000
		)
	:
		undefined
)

const snapchainUserDataPfpHttpUrl = (value: string | null | undefined) => {
	const raw = value ?? ''
	if (raw.length === 0) return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export default {
	source: Source.Snapchain_Rest,

	resolvers: [
		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: {
					resolve: async ({ fid }) => {
						type UserFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterUser>
						type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerification
						const { getUserBundleByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const { userData, usernameProofs, verifications } = await getUserBundleByFid({
							fid: fid,
						})
						const verifiedAddresses = (
							(verifications.messages ?? [])
								.flatMap<Entity<typeof schema, EntityType.FarcasterVerifiedAddress>>((message: SnapVerify) => {
								if (message.data?.fid !== fid) return []
								const body = message.data.verificationAddAddressBody
								const address = optionalNonemptyString(body?.address)
								const protocol = (
									body?.protocol === 'PROTOCOL_ETHEREUM' ?
										'ethereum' as const
									:
										body?.protocol === 'PROTOCOL_SOLANA' ?
											'solana' as const
										:
											undefined
								)
								return protocol == null || address == null ?
									[]
								:
									protocol === 'ethereum' ?
										(
											(evmAddress) => (
												[{
													[EntityMetaKey.Selector]: {
														fid: fid,
														protocol,
														address: evmAddress,
													},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$user')]: {
														[EntityMetaKey.Selector]: { fid },
													},
													[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$evmAccount')]: {
														[EntityMetaKey.Selector]: {
															address: evmAddress,
														},
													},
													[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'protocol')]: protocol,
													[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'address')]: evmAddress,
												},
												}]
											)
										)(EvmAddress.assert(address))
									:
										[{
											[EntityMetaKey.Selector]: {
												fid: fid,
												protocol,
												address,
											},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$user')]: {
												[EntityMetaKey.Selector]: { fid },
											},
											[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$solanaAccount')]: {
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
											[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'protocol')]: protocol,
											[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'address')]: address,
										},
										}]
								})
								.filter((verification, index, verificationsList) => (
								verificationsList.findIndex((otherVerification) => (
									otherVerification[EntityMetaKey.Selector].protocol === verification[EntityMetaKey.Selector].protocol
									&& otherVerification[EntityMetaKey.Selector].address === verification[EntityMetaKey.Selector].address
								)) === index
								))
						)
						const primaryVerifiedEvmAddress = verifiedAddresses.find((verification) => (
							verification[EntityMetaKey.Selector].protocol === 'ethereum'
						))?.[EntityMetaKey.Selector].address
						const userFields: Partial<UserFields> = {
							username: optionalNonemptyString(
								usernameProofs.proofs?.find((proof) => proof.fid === fid)?.name
							),
							$$verifiedAddresses: verifiedAddresses,
						}
						if (primaryVerifiedEvmAddress != null)
							userFields.$primaryEvmAccount = {
								[EntityMetaKey.Selector]: {
									address: EvmAddress.assert(primaryVerifiedEvmAddress),
								},
							}
						for (const message of (userData.messages ?? [])) {
							if (message.data?.fid !== fid) continue
							const userDataType = message.data.userDataBody?.type
							const fieldValue = optionalNonemptyString(message.data.userDataBody?.value)
							if (fieldValue == null) continue
							if (userDataType === 'USER_DATA_TYPE_PFP') {
								const iconUrl = snapchainUserDataPfpHttpUrl(fieldValue)
								if (iconUrl != null) {
									userFields.iconUrl = iconUrl
									const iconMedia = mediaFromUrl(iconUrl, MediaType.Image)
									if (iconMedia != null) userFields.$icon = iconMedia
								}
							}
						else if (userDataType === 'USER_DATA_TYPE_DISPLAY') userFields.displayName = fieldValue
						else if (userDataType === 'USER_DATA_TYPE_BIO') userFields.bio = fieldValue
						else if (userDataType === 'USER_DATA_TYPE_URL') userFields.url = fieldValue
						}
						return userFields
					},
				}
			},
			})({
					username: (user) => user.username,
				displayName: (user) => user.displayName,
				iconUrl: (user) => user.iconUrl,
				$icon: (user) => user.$icon,
				bio: (user) => user.bio,
				url: (user) => user.url,
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses ?? [],
				}),

			defineResolver(Source.Snapchain_Rest, {
				entityType: EntityType.FarcasterVerifiedAddress,
				resolve: {
					[FarcasterVerifiedAddressSelector.FidProtocolAddress]: {
						resolve: async (verifiedAddress) => {
							type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerification
							const { getUserBundleByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
							const { verifications } = await getUserBundleByFid({
								fid: verifiedAddress.fid,
							})
							const verified = (
								(verifications.messages ?? [])
									.some((message: SnapVerify) => {
										if (message.data?.fid !== verifiedAddress.fid) return false
										const body = message.data.verificationAddAddressBody
										const protocol = (
											body?.protocol === 'PROTOCOL_ETHEREUM' ?
												'ethereum' as const
											:
												body?.protocol === 'PROTOCOL_SOLANA' ?
													'solana' as const
												:
													undefined
										)
										const address = optionalNonemptyString(body?.address)
										return (
											protocol === verifiedAddress.protocol
											&& (
												protocol === 'ethereum' ?
													address != null && EvmAddress.assert(address) === EvmAddress.assert(verifiedAddress.address)
												:
													address === verifiedAddress.address
											)
										)
									})
							)
							if (!verified) throw new Error('Snapchain_Rest: verified address not found')

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

			defineResolver(Source.Snapchain_Rest, {
				entityType: EntityType.FarcasterUser_Timestamp,
			resolve: {
				[FarcasterUser_TimestampSelector.FarcasterUserTimestampMs]: {
					resolve: async ({ $user }) => {
						const { countLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const [followerCount, followingCount] = await Promise.all([
							countLinksByFid({
								fid: $user.fid,
								linkType: 'follow',
								reverse: true,
							}),
							countLinksByFid({
								fid: $user.fid,
								linkType: 'follow',
							}),
						])
						return {
							followerCount,
							followingCount,
						}
					},
				}
			},
		})({
				followerCount: (timestamp) => timestamp.followerCount,
				followingCount: (timestamp) => timestamp.followingCount,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.FidHash]: {
					resolve: async ({ fid, hash }) => {
						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
						type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
						const { getCastById } = await import('$/sources/Snapchain/Rest/queries.ts')
						const snapchainCast = await getCastById({
							fid,
							hash,
						})
						const castHash = hexLowerOfByteSize(snapchainCast.hash, 20)
						const requestedHash = hexLowerOfByteSize(hash, 20)
						if (
							snapchainCast.data?.fid !== fid
							|| castHash == null
							|| castHash !== requestedHash
						)
							throw new Error('Snapchain_Rest: cast subject mismatch')
						const castAddBody = snapchainCast.data.castAddBody
						const farcasterTimestamp = snapchainCast.data.timestamp
						const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
						const channelId = channelIdFromParentUrl(parentUrl)
						const timestamp = snapchainCastTimestampMs(farcasterTimestamp)
						if (timestamp == null)
								throw new Error('Snapchain_Rest: cast missing timestamp')

						return {
							fid,
							hash: castHash,
							$author: {
								[EntityMetaKey.Selector]: {
									fid,
								},
							} satisfies Entity<typeof schema, EntityType.FarcasterUser>,
							text: optionalNonemptyString(castAddBody?.text) ?? '',
							$parentCast: (
								castAddBody?.parentCastId?.fid != null
									&& castAddBody.parentCastId.hash != null
							) ?
								{
									[EntityMetaKey.Selector]: {
										fid: castAddBody.parentCastId.fid,
										hash: lowerHex0xCastHash(castAddBody.parentCastId.hash),
									},
								} satisfies CastEntity
							:
								undefined,
							parentUrl,
							timestamp,
							mentions: castAddBody?.mentions,
							$channel: (
								channelId == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: {
											id: channelId,
										},
									} satisfies Entity<typeof schema, EntityType.FarcasterChannel>
							),
							$$embeds: (castAddBody?.embeds ?? []).flatMap((embed, indexInCast) => [
								({
									[EntityMetaKey.Selector]: {
										$cast: {
											fid,
											hash: castHash,
										},
										indexInCast,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], 'url')]: optionalNonemptyString(embed.url),
										[entityFieldAddressKey(EntityType.FarcasterCastEmbed, [], '$embeddedCast')]: (
											embed.castId?.fid != null
											&& embed.castId.hash != null
									) ?
											{
												[EntityMetaKey.Selector]: {
													fid: embed.castId.fid,
													hash: lowerHex0xCastHash(embed.castId.hash),
												},
											} satisfies CastEntity
											:
												undefined,
									},
								}) satisfies CastEmbedEntity,
							]),
						} satisfies Partial<CastFieldValues>
					},
				},
			},
		})({
				fid: (cast) => cast.fid,
				hash: (cast) => cast.hash,
				$author: (cast) => cast.$author,
				text: (cast) => cast.text,
				$parentCast: (cast) => cast.$parentCast,
				parentUrl: (cast) => cast.parentUrl,
				timestamp: (cast) => cast.timestamp,
				mentions: (cast) => cast.mentions,
				$channel: (cast) => cast.$channel,
				$$embeds: (cast) => cast.$$embeds,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.FidHash]: {
					resolve: async ({ fid, hash }, context) => {
						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')
						const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
						const parentHash = hexLowerOfByteSize(hash, 20)
						if (parentHash == null)
							throw new Error('Snapchain_Rest: direct replies require a 20-byte parent cast hash')

						const subsetRowLimit = resolverContextRowLimit(context)
						const directReplies: SnapCast[] = []
						let pageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - directReplies.length, 0)
							if (remaining === 0) break
							const page = await getCastsByParent({
								fid,
								hash: parentHash,
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken,
							})
							directReplies.push(...(page.messages ?? []).slice(0, remaining))
							pageToken = page.nextPageToken
						} while (pageToken != null && pageToken !== '')

						return directReplies.map((directReply) => {
							const directReplyFid = directReply.data?.fid
							const directReplyHash = hexLowerOfByteSize(directReply.hash, 20)
							const directReplyBody = directReply.data?.castAddBody
							const directReplyParentHash = (
								directReplyBody?.parentCastId?.hash == null ?
									undefined
								:
									hexLowerOfByteSize(directReplyBody.parentCastId.hash, 20)
							)
							const timestamp = snapchainCastTimestampMs(directReply.data?.timestamp)
							if (
								directReplyFid == null
								|| directReplyHash == null
								|| directReplyBody == null
								|| directReplyBody.parentCastId?.fid !== fid
								|| directReplyParentHash !== parentHash
								|| timestamp == null
							)
								throw new Error('Snapchain_Rest: malformed or mismatched direct reply')

							return {
								[EntityMetaKey.Selector]: {
									fid: directReplyFid,
									hash: directReplyHash,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]: directReplyFid,
									[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]: directReplyHash,
									[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
										[EntityMetaKey.Selector]: {
											fid: directReplyFid,
										},
									},
									[entityFieldAddressKey(EntityType.FarcasterCast, [], 'text')]: optionalNonemptyString(directReplyBody.text) ?? '',
									[entityFieldAddressKey(EntityType.FarcasterCast, [], '$parentCast')]: {
										[EntityMetaKey.Selector]: {
											fid,
											hash: parentHash,
										},
									},
									[entityFieldAddressKey(EntityType.FarcasterCast, [], 'timestamp')]: timestamp,
								},
							} satisfies CastEntity
						})
					},
				}
			},
		})({
			$$directReplies: (directReplies) => directReplies,
		}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast_Timestamp,
			resolve: {
				[FarcasterCast_TimestampSelector.FarcasterCastTimestampMs]: {
					resolve: async ({ $cast }) => {
						const {
							getCastById,
							getCastEngagementCountsForCast,
						} = await import('$/sources/Snapchain/Rest/queries.ts')
						if (!('fid' in $cast) || !('hash' in $cast))
							throw new Error('Snapchain_Rest: cast snapshot id requires cast fid and hash')
						await getCastById({
							fid: $cast.fid,
							hash: $cast.hash,
						})
						return getCastEngagementCountsForCast({
							targetFid: $cast.fid,
							targetHash: $cast.hash,
							likeReactionType: SnapchainReactionType.Like,
							recastReactionType: SnapchainReactionType.Recast,
						})
					},
				}
			},
		})({
				likeCount: (timestamp) => timestamp.likeCount,
				recastCount: (timestamp) => timestamp.recastCount,
				replyCount: (timestamp) => timestamp.replyCount,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCastEmbed,
			resolve: {
				[FarcasterCastEmbedSelector.CastIndexInCast]: {
					resolve: async ({ $cast, indexInCast }) => {
						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type CastEmbedFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCastEmbed>
						const { getCastById } = await import('$/sources/Snapchain/Rest/queries.ts')
						if (!('fid' in $cast) || !('hash' in $cast))
							throw new Error('Snapchain_Rest: cast embed id requires cast fid and hash')

						const embed = (await getCastById({
							fid: $cast.fid,
							hash: $cast.hash,
						})).data?.castAddBody?.embeds?.[indexInCast]
						if (embed == null)
							throw new Error('Snapchain_Rest: cast embed index not found')

						return {
							$cast: {
								[EntityMetaKey.Selector]: $cast,
							},
							indexInCast,
							url: optionalNonemptyString(embed.url),
							$embeddedCast: (
								embed.castId?.fid != null
									&& embed.castId.hash != null
							) ?
								{
									[EntityMetaKey.Selector]: {
										fid: embed.castId.fid,
										hash: lowerHex0xCastHash(embed.castId.hash),
									},
								} satisfies CastEntity
							:
								undefined,
						} satisfies Partial<CastEmbedFields>
					},
				},
			},
		})({
				$cast: (embed) => embed.$cast,
				indexInCast: (embed) => embed.indexInCast,
				url: (embed) => embed.url,
				$embeddedCast: (embed) => embed.$embeddedCast,
				title: () => undefined,
				description: () => undefined,
				iconUrl: () => undefined,
				$icon: () => undefined,
				quotedPreviewText: () => undefined,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: {
					resolve: async (_entitySelector, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type UserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
						const { getFids } = await import('$/sources/Snapchain/Rest/queries.ts')
						const subsetRowLimit = resolverContextRowLimit(context)
						const fids: number[] = []
						let pageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - fids.length, 0)
							if (remaining === 0) break
							const page = await getFids({
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken,
							})
							fids.push(...(page.fids ?? []))
							pageToken = page.nextPageToken
						} while (
						pageToken != null
						&& fids.length < subsetRowLimit
						)
						return (
							fids.map((fid) => (({
								[EntityMetaKey.Selector]: {
									fid,
								},
							}) satisfies UserEntity))
						)
					},
				}
			},
		})({
				$$users: (users) => users,
		}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: {
					resolve: async ({ fid }) => {
						const { countLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const [followerCount, followingCount] = await Promise.all([
							countLinksByFid({
								fid,
								linkType: 'follow',
								reverse: true,
							}),
							countLinksByFid({
								fid,
								linkType: 'follow',
							}),
						])
						return [
							{
								[EntityMetaKey.Selector]: {
									$user: { fid },
									timestampMs: Date.now(),
								},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followerCount')]: followerCount,
										[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followingCount')]: followingCount,
									},
							},
						]
					},
				}
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: {
					resolve: async ({ fid }, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
						const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const subsetRowLimit = resolverContextRowLimit(context)
						const casts: SnapCast[] = []
						let pageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - casts.length, 0)
							if (remaining === 0) break
							const page = await getCastsByFid({
								fid: fid,
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken,
								reverse: true,
							})
							casts.push(...(page.messages ?? []))
							pageToken = page.nextPageToken
						} while (
						pageToken != null
						&& casts.length < subsetRowLimit
						)
						return (
							casts
								.flatMap((cast) => (
									cast.data?.fid !== fid
									|| hexLowerOfByteSize(cast.hash, 20) == null ?
										[]
									:
										[(({
									[EntityMetaKey.Selector]: {
										fid: fid,
										hash: lowerHex0xCastHash(cast.hash),
									},
										}) satisfies CastEntity)]
								))
						)
					},
				}
			},
		})({
				$$casts: (casts) => casts,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.FidHash]: {
					resolve: async ({ fid, hash }) => {
						const {
							getCastById,
							getCastEngagementCountsForCast,
						} = await import('$/sources/Snapchain/Rest/queries.ts')
						await getCastById({
							fid,
							hash,
						})
						return [
							{
								[EntityMetaKey.Selector]: {
									$cast: {
										fid,
										hash,
									},
									timestampMs: Date.now(),
								},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(await getCastEngagementCountsForCast({
											targetFid: fid,
											targetHash: hash,
											likeReactionType: SnapchainReactionType.Like,
											recastReactionType: SnapchainReactionType.Recast,
										})).map(([fieldName, value]) => [
											entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], fieldName),
											value,
										])
									),
							},
						]
					},
				},
			},
		})({
				$$timestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[FarcasterChannelSelector.Id]: {
					resolve: async ({ id }, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
						const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
						const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
						const channel = await getChannel(id)
						const channelPageUrl = optionalNonemptyString(channel?.url) ?? `https://warpcast.com/~/channel/${id}`
						const subsetRowLimit = resolverContextRowLimit(context)
						const casts: SnapCast[] = []
						let pageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - casts.length, 0)
							if (remaining === 0) break
							const page = await getCastsByParent({
								url: channelPageUrl,
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken,
							})
							casts.push(...(page.messages ?? []))
							pageToken = page.nextPageToken
						} while (
							pageToken != null
							&& casts.length < subsetRowLimit
						)
						return (
							casts
								.flatMap((cast) => {
									const authorFid = cast.data?.fid
									return authorFid == null ?
										[]
									:
										[({
											[EntityMetaKey.Selector]: {
												fid: authorFid,
												hash: lowerHex0xCastHash(cast.hash),
											},
										}) satisfies CastEntity]
								})
						)
					},
				}
			},
		})({
				$$casts: (casts) => casts,
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[FarcasterFeedSelector.Variant]: {
					resolve: async ({ variant }, context) => {
						if (variant !== 'trending')
							throw new Error(`Snapchain_Rest: unsupported feed variant ${variant}`)
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
						const subsetRowLimit = resolverContextRowLimit(context)

						const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const fids: number[] = []
						let fidsPageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - fids.length, 0)
							if (remaining === 0) break
							const page = await getFids({
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken: fidsPageToken,
							})
							fids.push(...(page.fids ?? []))
							fidsPageToken = page.nextPageToken
						} while (
							fidsPageToken != null
							&& fids.length < subsetRowLimit
						)
						const feedCasts: SnapCast[] = []
						fidLoop: for (const fid of fids) {
							if (feedCasts.length >= subsetRowLimit) break fidLoop
							let pageToken: string | undefined
							do {
								const page = await getCastsByFid({
									fid,
									pageSize: snapchainMaxPageSize,
									pageToken,
									reverse: true,
								})
								const batch = page.messages ?? []
								const need = subsetRowLimit - feedCasts.length
								feedCasts.push(...batch.slice(0, need))
								pageToken = page.nextPageToken
							} while (pageToken != null && feedCasts.length < subsetRowLimit)
						}
						return (
							feedCasts
								.flatMap((cast) => {
									const authorFid = cast.data?.fid
									return authorFid == null ?
										[]
									:
										[({
											[EntityMetaKey.Selector]: {
												fid: authorFid,
												hash: lowerHex0xCastHash(cast.hash),
											},
										}) satisfies CastEntity]
								})
						)
					},
				},
				[FarcasterFeedSelector.ByUser]: {
					resolve: async ({ fid }, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
						const subsetRowLimit = resolverContextRowLimit(context)

						const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const casts: SnapCast[] = []
						let pageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - casts.length, 0)
							if (remaining === 0) break
							const page = await getCastsByFid({
								fid,
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken,
								reverse: true,
							})
							casts.push(...(page.messages ?? []))
							pageToken = page.nextPageToken
						} while (
							pageToken != null
							&& casts.length < subsetRowLimit
						)
						return (
							casts
								.map((cast) => (({
									[EntityMetaKey.Selector]: {
										fid,
										hash: lowerHex0xCastHash(cast.hash),
									},
								}) satisfies CastEntity))
						)
					},
				},
				[FarcasterFeedSelector.ByChannel]: {
					resolve: async ({ channelId }, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
						const subsetRowLimit = resolverContextRowLimit(context)

						const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
						const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
						const channel = await getChannel(channelId)
						const channelPageUrl = (
							optionalNonemptyString(channel?.url)
							?? `https://warpcast.com/~/channel/${channelId}`
						)
						const casts: SnapCast[] = []
						let pageToken: string | undefined
						do {
							const remaining = Math.max(subsetRowLimit - casts.length, 0)
							if (remaining === 0) break
							const page = await getCastsByParent({
								url: channelPageUrl,
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken,
							})
							casts.push(...(page.messages ?? []))
							pageToken = page.nextPageToken
						} while (
							pageToken != null
							&& casts.length < subsetRowLimit
						)
						return (
							casts
								.flatMap((cast) => {
									const authorFid = cast.data?.fid
									return authorFid == null ?
										[]
									:
										[({
											[EntityMetaKey.Selector]: {
												fid: authorFid,
												hash: lowerHex0xCastHash(cast.hash),
											},
										}) satisfies CastEntity]
								})
						)
					},
				},
				[FarcasterFeedSelector.Following]: {
					resolve: async ({ viewerFid }, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						const subsetRowLimit = resolverContextRowLimit(context)

						const { getCastsByFid, getLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const followedFids: number[] = []
						let linksPageToken: string | undefined
						const maxFollowedFids = Math.min(subsetRowLimit, 12)
						do {
							const remaining = Math.max(maxFollowedFids - followedFids.length, 0)
							if (remaining === 0) break
							const page = await getLinksByFid({
								fid: viewerFid,
								linkType: 'follow',
								pageSize: Math.min(remaining, snapchainMaxPageSize),
								pageToken: linksPageToken,
								reverse: true,
							})
							for (const message of page.messages ?? []) {
								const targetFid = message.data?.linkBody?.targetFid
								if (targetFid != null) followedFids.push(targetFid)
							}
							linksPageToken = page.nextPageToken
						} while (
							linksPageToken != null
							&& followedFids.length < maxFollowedFids
						)
						const perAuthor = Math.max(
							1,
							Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1))
						)
						return (
							(await Promise.all(
								followedFids.map(async (fid) => (
									await getCastsByFid({
										fid,
										pageSize: Math.min(perAuthor, snapchainMaxPageSize),
										reverse: true,
									})
								))
							))
								.flatMap((page) => page.messages ?? [])
								.flatMap((cast) => {
									const authorFid = cast.data?.fid
									return authorFid == null ?
										[]
									:
										[{
											[EntityMetaKey.Selector]: {
												fid: authorFid,
												hash: lowerHex0xCastHash(cast.hash),
											},
										} satisfies CastEntity]
								})
								.slice(0, subsetRowLimit)
						)
					},
				},
			},
		})({
				$$entries: (entries) => entries,
			}),

	],
}
