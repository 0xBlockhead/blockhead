import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { SnapchainReactionType } from '$/constants/Snapchain.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	SnapchainCast,
	SnapchainVerification,
} from '$/sources/Snapchain/Rest/types.ts'

const lowerHex0xCastHash = (hash: `0x${string}`) => (
	hexLowerOfByteSize(hash, 20)
		?? hexLowerOfByteSize(`${hash.slice(0, 2)}${hash.slice(2).toLowerCase()}`, 20)
		?? hash
)

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

const snapchainCastEntity = (cast: SnapchainCast) => (
	cast.data?.fid == null ?
		undefined
	:
		({
			[EntityMetaKey.Selector]: {
				fid: cast.data.fid,
				hash: lowerHex0xCastHash(cast.hash),
			},
		} satisfies Entity<typeof schema, EntityType.FarcasterCast>)
)

const getSnapchainCast = async ({
	fid,
	hash,
}: {
	fid: number
	hash: `0x${string}`
}) => {
	const { getCastById } = await import('$/sources/Snapchain/Rest/queries.ts')
	const cast = await getCastById({ fid, hash })
	const castHash = hexLowerOfByteSize(cast.hash, 20)
	if (
		cast.data?.fid !== fid
		|| castHash == null
		|| castHash !== hexLowerOfByteSize(hash, 20)
	)
		throw new Error('Snapchain_Rest: cast subject mismatch')
	return cast
}

const getSnapchainCastsByFid = async (
	fid: number,
	rowLimit: number
) => {
	const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')
	const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
	const casts: SnapchainCast[] = []
	let pageToken: string | undefined
	do {
		const remaining = Math.max(rowLimit - casts.length, 0)
		if (remaining === 0) break
		const page = await getCastsByFid({
			fid,
			pageSize: Math.min(remaining, snapchainMaxPageSize),
			pageToken,
			reverse: true,
		})
		casts.push(...(page.messages ?? []).slice(0, remaining))
		pageToken = page.nextPageToken
	} while (
		pageToken != null
		&& pageToken !== ''
		&& casts.length < rowLimit
	)
	return casts
}

const getSnapchainCastsByParent = async (
	parent: (
		| {
			fid: number
			hash: `0x${string}`
		}
		| {
			url: string
		}
	),
	rowLimit: number
) => {
	const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')
	const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
	const casts: SnapchainCast[] = []
	let pageToken: string | undefined
	do {
		const remaining = Math.max(rowLimit - casts.length, 0)
		if (remaining === 0) break
		const page = await getCastsByParent({
			...parent,
			pageSize: Math.min(remaining, snapchainMaxPageSize),
			pageToken,
		})
		casts.push(...(page.messages ?? []).slice(0, remaining))
		pageToken = page.nextPageToken
	} while (
		pageToken != null
		&& pageToken !== ''
		&& casts.length < rowLimit
	)
	return casts
}

const getSnapchainFids = async (rowLimit: number) => {
	const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')
	const { getFids } = await import('$/sources/Snapchain/Rest/queries.ts')
	const fids: number[] = []
	let pageToken: string | undefined
	do {
		const remaining = Math.max(rowLimit - fids.length, 0)
		if (remaining === 0) break
		const page = await getFids({
			pageSize: Math.min(remaining, snapchainMaxPageSize),
			pageToken,
		})
		fids.push(...(page.fids ?? []).slice(0, remaining))
		pageToken = page.nextPageToken
	} while (
		pageToken != null
		&& pageToken !== ''
		&& fids.length < rowLimit
	)
	return fids
}

const getSnapchainUserCounts = async (fid: number) => {
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
	return {
		followerCount,
		followingCount,
	}
}

const getSnapchainCastCounts = async ({
	fid,
	hash,
}: {
	fid: number
	hash: `0x${string}`
}) => {
	const { getCastEngagementCountsForCast } = await import('$/sources/Snapchain/Rest/queries.ts')
	await getSnapchainCast({ fid, hash })
	return getCastEngagementCountsForCast({
		targetFid: fid,
		targetHash: hash,
		likeReactionType: SnapchainReactionType.Like,
		recastReactionType: SnapchainReactionType.Recast,
	})
}

const snapchainVerifiedAddress = (message: SnapchainVerification) => {
	const fid = message.data?.fid
	const body = message.data?.verificationAddAddressBody
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
	if (fid == null || protocol == null || address == null) return undefined
	const normalizedAddress = protocol === 'ethereum' ? EvmAddress.assert(address) : address
	return {
		fid,
		protocol,
		address: normalizedAddress,
		$user: {
			[EntityMetaKey.Selector]: { fid },
		},
		...(protocol === 'ethereum' && {
			$evmAccount: {
				[EntityMetaKey.Selector]: {
					address: normalizedAddress,
				},
			},
		}),
		...(protocol === 'solana' && {
			$solanaAccount: {
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: {
							namespace: 'solana',
							reference: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
						},
					},
					pubkey: normalizedAddress,
				},
			},
		}),
	}
}

export default {
	source: Source.Snapchain_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }) => {
						type UserFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterUser>
						const {
							getUserDataByFid,
							getUsernameProofsByFid,
							getVerificationsByFid,
						} = await import('$/sources/Snapchain/Rest/queries.ts')
						const [userData, usernameProofs, verifications] = await Promise.all([
							getUserDataByFid({ fid }),
							getUsernameProofsByFid({ fid }),
							getVerificationsByFid({ fid }),
						])
						const verifiedAddressValues = (
							(verifications.messages ?? [])
								.flatMap((message) => {
									const verifiedAddress = snapchainVerifiedAddress(message)
									return verifiedAddress?.fid === fid ? [verifiedAddress] : []
								})
								.filter((verification, index, verificationsList) => (
									verificationsList.findIndex((otherVerification) => (
										otherVerification.protocol === verification.protocol
										&& otherVerification.address === verification.address
									)) === index
								))
						)
						const verifiedAddresses = verifiedAddressValues.map((verifiedAddress) => ({
							[EntityMetaKey.Selector]: {
								fid,
								protocol: verifiedAddress.protocol,
								address: verifiedAddress.address,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$user')]:
									verifiedAddress.$user,
								...(verifiedAddress.$evmAccount != null && {
									[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$evmAccount')]:
										verifiedAddress.$evmAccount,
								}),
								...(verifiedAddress.$solanaAccount != null && {
									[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], '$solanaAccount')]:
										verifiedAddress.$solanaAccount,
								}),
								[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'protocol')]:
									verifiedAddress.protocol,
								[entityFieldAddressKey(EntityType.FarcasterVerifiedAddress, [], 'address')]:
									verifiedAddress.address,
							},
						} satisfies Entity<typeof schema, EntityType.FarcasterVerifiedAddress>))
						const primaryVerifiedEvmAddress = verifiedAddressValues.find((verifiedAddress) => (
							verifiedAddress.protocol === 'ethereum'
						))?.address
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
								const iconUrl = resolveMediaUrlTransport(fieldValue)?.url
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

		defineResolver({
			entityType: EntityType.FarcasterVerifiedAddress,
			resolve: {
				FidProtocolAddress: {
					resolve: async (verifiedAddress) => {
						const { getVerificationsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
						const resolved = (await getVerificationsByFid({
							fid: verifiedAddress.fid,
						})).messages
							?.map(snapchainVerifiedAddress)
							.find((candidate) => (
								candidate?.fid === verifiedAddress.fid
								&& candidate.protocol === verifiedAddress.protocol
								&& candidate.address === (
									verifiedAddress.protocol === 'ethereum' ?
										EvmAddress.assert(verifiedAddress.address)
									:
										verifiedAddress.address
								)
							))
						if (resolved == null) throw new Error('Snapchain_Rest: verified address not found')
						return resolved
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
					resolve: async ({ fid, hash }) => {
						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
						type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
						const snapchainCast = await getSnapchainCast({
							fid,
							hash,
						})
						const castHash = hexLowerOfByteSize(snapchainCast.hash, 20)
						if (castHash == null) throw new Error('Snapchain_Rest: cast subject mismatch')
						const castAddBody = snapchainCast.data.castAddBody
						const farcasterTimestamp = snapchainCast.data.timestamp
						const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
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
								parentUrl == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: {
											parentUrl,
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

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				FidHash: {
					resolve: async ({ fid, hash }, context) => {
						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						const parentHash = hexLowerOfByteSize(hash, 20)
						if (parentHash == null)
							throw new Error('Snapchain_Rest: direct replies require a 20-byte parent cast hash')

						return (await getSnapchainCastsByParent(
							{
								fid,
								hash: parentHash,
							},
							resolverContextRowLimit(context)
						)).map((directReply) => {
							const directReplyEntity = snapchainCastEntity(directReply)
							const directReplyBody = directReply.data?.castAddBody
							const directReplyParentHash = (
								directReplyBody?.parentCastId?.hash == null ?
									undefined
								:
									hexLowerOfByteSize(directReplyBody.parentCastId.hash, 20)
							)
							const timestamp = snapchainCastTimestampMs(directReply.data?.timestamp)
							if (
								directReplyEntity == null
								|| hexLowerOfByteSize(directReply.hash, 20) == null
								|| directReplyBody == null
								|| directReplyBody.parentCastId?.fid !== fid
								|| directReplyParentHash !== parentHash
								|| timestamp == null
							)
								throw new Error('Snapchain_Rest: malformed or mismatched direct reply')

							return {
								...directReplyEntity,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FarcasterCast, [], 'fid')]:
										directReplyEntity[EntityMetaKey.Selector].fid,
									[entityFieldAddressKey(EntityType.FarcasterCast, [], 'hash')]:
										directReplyEntity[EntityMetaKey.Selector].hash,
									[entityFieldAddressKey(EntityType.FarcasterCast, [], '$author')]: {
										[EntityMetaKey.Selector]: {
											fid: directReplyEntity[EntityMetaKey.Selector].fid,
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

		defineResolver({
			entityType: EntityType.FarcasterCastEmbed,
			resolve: {
				CastIndexInCast: {
					resolve: async ({ $cast, indexInCast }) => {
						type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
						type CastEmbedFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCastEmbed>
						if (!('fid' in $cast) || !('hash' in $cast))
							throw new Error('Snapchain_Rest: cast embed id requires cast fid and hash')

						const embed = (await getSnapchainCast({
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

		defineResolver({
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						type UserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
						return (
							(await getSnapchainFids(
								resolverContextRowLimit(context)
							)).map((fid) => (({
								[EntityMetaKey.Selector]: {
									fid,
								},
							}) satisfies UserEntity))
						)
					},
				},
			},
		})({
			$$users: (users) => users,
		}),

		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }) => {
						const {
							followerCount,
							followingCount,
						} = await getSnapchainUserCounts(fid)
						return [
							{
								[EntityMetaKey.Selector]: {
									$user: { fid },
									timestampMs: Date.now(),
									source: Source.Snapchain_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followerCount')]: followerCount,
									[entityFieldAddressKey(EntityType.FarcasterUser_Timestamp, [], 'followingCount')]: followingCount,
								},
							},
						]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.FarcasterUser,
			resolve: {
				Fid: {
					resolve: async ({ fid }, context) => {
						return (
							(await getSnapchainCastsByFid(
								fid,
								resolverContextRowLimit(context)
							))
								.flatMap((cast) => {
									const castEntity = snapchainCastEntity(cast)
									return (
										castEntity?.[EntityMetaKey.Selector].fid === fid
										&& hexLowerOfByteSize(cast.hash, 20) != null ?
											[castEntity]
										:
											[]
									)
								})
						)
					},
				},
			},
		})({
			$$casts: (casts) => casts,
		}),

		defineResolver({
			entityType: EntityType.FarcasterCast,
			resolve: {
				FidHash: {
					resolve: async ({ fid, hash }) => {
						const counts = await getSnapchainCastCounts({ fid, hash })
						return [
							{
								[EntityMetaKey.Selector]: {
									$cast: {
										fid,
										hash,
									},
									timestampMs: Date.now(),
									source: Source.Snapchain_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'likeCount')]:
										counts.likeCount,
									[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'recastCount')]:
										counts.recastCount,
									[entityFieldAddressKey(EntityType.FarcasterCast_Timestamp, [], 'replyCount')]:
										counts.replyCount,
								},
							},
						]
					},
				},
			},
		})({
			$$timestamps: (timestamps) => timestamps,
		}),

		defineResolver({
			entityType: EntityType.FarcasterChannel,
			resolve: {
				ParentUrl: {
					resolve: async ({ parentUrl }, context) => {
						return (
							(await getSnapchainCastsByParent(
								{ url: parentUrl },
								resolverContextRowLimit(context)
							))
								.flatMap((cast) => snapchainCastEntity(cast) ?? [])
						)
					},
				},
			},
		})({
			$$casts: (casts) => casts,
		}),

		defineResolver({
			entityType: EntityType.FarcasterFeed,
			resolve: {
				Variant: {
					resolve: async ({ variant }, context) => {
						if (variant !== 'trending')
							throw new Error(`Snapchain_Rest: unsupported feed variant ${variant}`)

						const subsetRowLimit = resolverContextRowLimit(context)
						const feedCasts: SnapchainCast[] = []
						fidLoop: for (const fid of await getSnapchainFids(subsetRowLimit)) {
							if (feedCasts.length >= subsetRowLimit) break fidLoop
							feedCasts.push(...await getSnapchainCastsByFid(
								fid,
								subsetRowLimit - feedCasts.length
							))
						}
						return (
							feedCasts
								.flatMap((cast) => snapchainCastEntity(cast) ?? [])
						)
					},
				},
				ByUser: {
					resolve: async ({ fid }, context) => {
						return (
							(await getSnapchainCastsByFid(
								fid,
								resolverContextRowLimit(context)
							))
								.flatMap((cast) => {
									const castEntity = snapchainCastEntity(cast)
									return castEntity?.[EntityMetaKey.Selector].fid === fid ?
										[castEntity]
									:
										[]
								})
						)
					},
				},
				Following: {
					resolve: async ({ viewerFid }, context) => {
						const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

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
								.flatMap((cast) => snapchainCastEntity(cast) ?? [])
								.slice(0, subsetRowLimit)
						)
					},
				},
			},
		})({
				$$entries: (entries) => entries,
			}),

	],
} satisfies RegisteredSourceResolverModule
