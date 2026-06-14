import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { SnapchainReactionType } from '$/constants/Snapchain.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl, resolveMediaUrlTransport } from '$/lib/media.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { FarcasterUserSelector } from '$/schema/FarcasterUser.ts'
import { FarcasterUser_TimestampSelector } from '$/schema/FarcasterUser_Timestamp.ts'
import { FarcasterCastSelector } from '$/schema/FarcasterCast.ts'
import { FarcasterCast_TimestampSelector } from '$/schema/FarcasterCast_Timestamp.ts'
import { BlockheadFarcasterAccountConnectionSelector } from '$/schema/BlockheadFarcasterAccountConnection.ts'
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
			: farcasterTimestamp >= 1e9 ?
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
				[FarcasterUserSelector.Fid]: async ({ fid }) => {
				type UserFields = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterUser>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerification
				const {
					getUserBundleByFid,
					countLinksByFid,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const [{ userData, usernameProofs, verifications }, followerCount, followingCount] = await Promise.all([
					getUserBundleByFid({
						fid: fid,
					}),
					singleFlight(countLinksByFid)({
						fid: fid,
						linkType: 'follow',
						reverse: true,
					}),
					singleFlight(countLinksByFid)({
						fid: fid,
						linkType: 'follow',
					}),
				])
				const verifiedAddresses = (
					(verifications.messages ?? [])
						.flatMap<Entity<typeof schema, EntityType.FarcasterVerifiedAddress>>((message: SnapVerify) => {
							const body = message.data?.verificationAddAddressBody
							const address = optionalNonemptyString(body?.address)
							const protocol = (
								body?.protocol === 'PROTOCOL_ETHEREUM' ?
									'ethereum' as const
								: body?.protocol === 'PROTOCOL_SOLANA' ?
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
														fid: entitySelector.fid,
														protocol,
														address: evmAddress,
													},
													$user: {
														[EntityMetaKey.Selector]: entitySelector,
													},
													$evmAccount: {
														[EntityMetaKey.Selector]: {
															address: evmAddress,
														},
													},
													protocol,
													address: evmAddress,
												}]
										)
									)(EvmAddress.assert(address))
							:
									[{
										[EntityMetaKey.Selector]: {
											fid: entitySelector.fid,
											protocol,
											address,
										},
										$user: {
											[EntityMetaKey.Selector]: entitySelector,
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
										protocol,
										address,
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
					username: optionalNonemptyString(usernameProofs.proofs?.[0]?.name),
					followerCount,
					followingCount,
					$$verifiedAddresses: verifiedAddresses,
				}
				if (primaryVerifiedEvmAddress != null)
					userFields.$primaryEvmAccount = {
						[EntityMetaKey.Selector]: {
							address: EvmAddress.assert(primaryVerifiedEvmAddress),
						},
					}
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalNonemptyString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						const icon = mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						if (icon != null) userFields.$icon = icon
					}
					else if (userDataType === 'USER_DATA_TYPE_DISPLAY') userFields.displayName = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_BIO') userFields.bio = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_URL') userFields.url = fieldValue
				}
				return userFields
			}
			},
		})({
				fields: {
				username: (user) => user.username,
				displayName: (user) => user.displayName,
				$icon: (user) => user.$icon,
				bio: (user) => user.bio,
				url: (user) => user.url,
				$primaryEvmAccount: (user) => user.$primaryEvmAccount,
				$$verifiedAddresses: (user) => user.$$verifiedAddresses,
				followerCount: (user) => user.followerCount,
				followingCount: (user) => user.followingCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser_Timestamp,
			resolve: {
				[FarcasterUser_TimestampSelector.FarcasterUserTimestampMs]: async ({ $user }) => {
				const { countLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const [followerCount, followingCount] = await Promise.all([
					singleFlight(countLinksByFid)({
						fid: $user.fid,
						linkType: 'follow',
						reverse: true,
					}),
					singleFlight(countLinksByFid)({
						fid: $user.fid,
						linkType: 'follow',
					}),
				])
				return {
					followerCount,
					followingCount,
				}
			}
			},
		})({
				fields: {
				followerCount: (timestamp) => timestamp.followerCount,
				followingCount: (timestamp) => timestamp.followingCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.FidHash]: async (entitySelector) => {
				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				if (!('fid' in entitySelector) || !('hash' in entitySelector)) {
					throw new Error('Snapchain_Rest: cast id requires fid and hash')
				}
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entitySelector.fid,
					hash: entitySelector.hash,
				})
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
				const channelId = channelIdFromParentUrl(parentUrl)
				const { likeCount, recastCount, replyCount } = await getCastEngagementCountsForCast({
					targetFid: entitySelector.fid,
					targetHash: entitySelector.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
				const timestamp = snapchainCastTimestampMs(farcasterTimestamp)
				if (timestamp == null) {
					throw new Error('Snapchain_Rest: cast missing timestamp')
				}
				return {
					fid: entitySelector.fid,
					hash: lowerHex0xCastHash(entitySelector.hash),
					$author: {
						[EntityMetaKey.Selector]: {
							fid: entitySelector.fid,
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
					$$embeds: (castAddBody?.embeds ?? []).flatMap((embed, index) => (
						[
							(({
								[EntityMetaKey.Selector]: {
									$cast: entitySelector,
									index,
								},
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
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
					replyCount,
				} satisfies Partial<CastFieldValues>
			},
				[FarcasterCastSelector.Hash]: async (entitySelector) => {
				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type CastEmbedEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCastEmbed>
				type CastFieldValues = import('$/schema/$schema.ts').EntityFieldValues<typeof schema, EntityType.FarcasterCast>
				if (!('fid' in entitySelector) || !('hash' in entitySelector)) {
					throw new Error('Snapchain_Rest: cast id requires fid and hash')
				}
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const snapchainCast = await singleFlight(getCastById)({
					fid: entitySelector.fid,
					hash: entitySelector.hash,
				})
				const castAddBody = snapchainCast.data?.castAddBody
				const farcasterTimestamp = snapchainCast.data?.timestamp
				const parentUrl = optionalNonemptyString(castAddBody?.parentUrl)
				const channelId = channelIdFromParentUrl(parentUrl)
				const { likeCount, recastCount, replyCount } = await getCastEngagementCountsForCast({
					targetFid: entitySelector.fid,
					targetHash: entitySelector.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
				const timestamp = snapchainCastTimestampMs(farcasterTimestamp)
				if (timestamp == null) {
					throw new Error('Snapchain_Rest: cast missing timestamp')
				}
				return {
					fid: entitySelector.fid,
					hash: lowerHex0xCastHash(entitySelector.hash),
					$author: {
						[EntityMetaKey.Selector]: {
							fid: entitySelector.fid,
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
					$$embeds: (castAddBody?.embeds ?? []).flatMap((embed, index) => (
						[
							(({
								[EntityMetaKey.Selector]: {
									$cast: entitySelector,
									index,
								},
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
							}) satisfies CastEmbedEntity),
						]
					)),
					likeCount,
					recastCount,
					replyCount,
				} satisfies Partial<CastFieldValues>
			},
			},
		})({
				fields: {
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
				likeCount: (cast) => cast.likeCount,
				recastCount: (cast) => cast.recastCount,
				replyCount: (cast) => cast.replyCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast_Timestamp,
			resolve: {
				[FarcasterCast_TimestampSelector.FarcasterCastTimestampMs]: async ({ $cast }) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				if (!('fid' in $cast) || !('hash' in $cast)) {
					throw new Error('Snapchain_Rest: cast snapshot id requires cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: $cast.fid,
					hash: $cast.hash,
				})
				return getCastEngagementCountsForCast({
					targetFid: $cast.fid,
					targetHash: $cast.hash,
					likeReactionType: SnapchainReactionType.Like,
					recastReactionType: SnapchainReactionType.Recast,
				})
			}
			},
		})({
				fields: {
				likeCount: (timestamp) => timestamp.likeCount,
				recastCount: (timestamp) => timestamp.recastCount,
				replyCount: (timestamp) => timestamp.replyCount,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[BlockheadFarcasterAccountConnectionSelector.Fid]: async ({ fid }) => {
				type ConnectionFields = import('$/schema/$schema.ts').EntityFieldValues<
					typeof schema,
					EntityType.BlockheadFarcasterAccountConnection
				>
				type SnapVerify = import('$/sources/Snapchain/Rest/types.ts').SnapchainVerification
				const {
					getOnChainIdRegisterEventsByFid,
					getUserBundleByFid,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const { userData, usernameProofs, verifications } = await singleFlight(getUserBundleByFid)({ fid: fid })
				const idRegisterPage = await singleFlight(getOnChainIdRegisterEventsByFid)({ fid: fid, reverse: true })
				const ethList = (
					(verifications.messages ?? [])
						.map((message: SnapVerify) => {
							const body = message.data?.verificationAddAddressBody
							if (body?.protocol !== 'PROTOCOL_ETHEREUM') return undefined
							return optionalNonemptyString(body.address)
						})
						.filter((address): address is string => address != null)
				)
				const custodyEvent = (idRegisterPage.events ?? []).find(
					(event) => (
						event.idRegisterEventBody?.eventType === 'ID_REGISTER_EVENT_TYPE_REGISTER'
					),
				)
				const connectionFields: Partial<ConnectionFields> = {
					username: optionalNonemptyString(usernameProofs.proofs?.[0]?.name),
					...(ethList.length > 0 && { verifications: ethList }),
					...((
						custodyAddress,
					) => (
						custodyAddress != null && {
							custody: custodyAddress,
						}
					))(optionalNonemptyString(custodyEvent?.idRegisterEventBody?.to)),
				}
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalNonemptyString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						const icon = mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						if (icon != null) connectionFields.$icon = icon
					}
					else if (userDataType === 'USER_DATA_TYPE_DISPLAY') connectionFields.displayName = fieldValue
					else if (userDataType === 'USER_DATA_TYPE_BIO') connectionFields.bio = fieldValue
				}
				return connectionFields
			}
			},
		})({
				fields: {
				username: (connection) => connection.username,
				displayName: (connection) => connection.displayName,
				$icon: (connection) => connection.$icon,
				bio: (connection) => connection.bio,
				verifications: (connection) => connection.verifications,
				custody: (connection) => connection.custody,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.BlockheadFarcasterAccountConnection,
			resolve: {
				[BlockheadFarcasterAccountConnectionSelector.Fid]: async ({ fid }) => {
				const { getUserBundleByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const { userData } = await singleFlight(getUserBundleByFid)({
					fid: fid,
				})
				for (const message of (userData.messages ?? [])) {
					const userDataType = message.data?.userDataBody?.type
					const fieldValue = optionalNonemptyString(message.data?.userDataBody?.value)
					if (fieldValue == null) continue
					if (userDataType === 'USER_DATA_TYPE_PFP') {
						return (
							mediaFromUrl(snapchainUserDataPfpHttpUrl(fieldValue), MediaType.Image)
						)
					}
				}
				return undefined
			}
			},
		})({
				fields: {
				$icon: (icon) => icon,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterNetwork,
			resolve: {
				[FarcasterNetworkSelector.Scope]: async (_entitySelector, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type UserEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterUser>
				const { getFids } = await import('$/sources/Snapchain/Rest/queries.ts')
				const subsetRowLimit = resolverContextRowLimit(context)
				const fids: number[] = []
				let pageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
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
			}
			},
		})({
				fields: {
				$$users: (users) => users,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: async (entitySelector) => {
				const { countLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const [followerCount, followingCount] = await Promise.all([
					singleFlight(countLinksByFid)({
						fid: entitySelector.fid,
						linkType: 'follow',
						reverse: true,
					}),
					singleFlight(countLinksByFid)({
						fid: entitySelector.fid,
						linkType: 'follow',
					}),
				])
				return [
					{
						[EntityMetaKey.Selector]: {
							$user: entitySelector,
							timestampMs: Date.now(),
						},
						followerCount,
						followingCount,
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterUser,
			resolve: {
				[FarcasterUserSelector.Fid]: async ({ fid }, context) => {
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
					const page = await singleFlight(getCastsByFid)({
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
						.map((cast) => (({
							[EntityMetaKey.Selector]: {
								fid: entitySelector.fid,
								hash: lowerHex0xCastHash(cast.hash),
							},
						}) satisfies CastEntity))
				)
			}
			},
		})({
				fields: {
				$$casts: (casts) => casts,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterCast,
			resolve: {
				[FarcasterCastSelector.FidHash]: async (entitySelector) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const castId = (
					'fid' in entitySelector
					&& 'hash' in entitySelector ?
						{
							fid: entitySelector.fid,
							hash: entitySelector.hash,
						}
					:
						undefined
				)
				if (castId === undefined) {
					throw new Error('Snapchain_Rest: cast timestamps require cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: castId.fid,
					hash: castId.hash,
				})
				return [
						{
							[EntityMetaKey.Selector]: {
								$cast: castId,
								timestampMs: Date.now(),
							},
							...(await getCastEngagementCountsForCast({
								targetFid: castId.fid,
								targetHash: castId.hash,
								likeReactionType: SnapchainReactionType.Like,
								recastReactionType: SnapchainReactionType.Recast,
							})),
					},
				]
			},
				[FarcasterCastSelector.Hash]: async (entitySelector) => {
				const {
					getCastById,
					getCastEngagementCountsForCast,
				} = await import('$/sources/Snapchain/Rest/queries.ts')
				const castId = (
					'fid' in entitySelector
					&& 'hash' in entitySelector ?
						{
							fid: entitySelector.fid,
							hash: entitySelector.hash,
						}
					:
						undefined
				)
				if (castId === undefined) {
					throw new Error('Snapchain_Rest: cast timestamps require cast fid and hash')
				}
				await singleFlight(getCastById)({
					fid: castId.fid,
					hash: castId.hash,
				})
				return [
						{
							[EntityMetaKey.Selector]: {
								$cast: castId,
								timestampMs: Date.now(),
							},
							...(await getCastEngagementCountsForCast({
								targetFid: castId.fid,
								targetHash: castId.hash,
								likeReactionType: SnapchainReactionType.Like,
								recastReactionType: SnapchainReactionType.Recast,
							})),
					},
				]
			},
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterChannel,
			resolve: {
				[FarcasterChannelSelector.Id]: async ({ id }, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
				const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
				const channel = await singleFlight(getChannel)(id)
				const channelPageUrl = optionalNonemptyString(channel?.url) ?? `https://warpcast.com/~/channel/${id}`
				const subsetRowLimit = resolverContextRowLimit(context)
				const casts: SnapCast[] = []
				let pageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - casts.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getCastsByParent)({
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
				}
			},
		})({
				fields: {
				$$casts: (casts) => casts,
			},
			}),

		defineResolver(Source.Snapchain_Rest, {
			entityType: EntityType.FarcasterFeed,
			resolve: {
				[FarcasterFeedSelector.Trending]: async ({ channelId, fid: fidSelector, variant, viewerFid }, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const subsetRowLimit = resolverContextRowLimit(context)

				if (variant === 'following') {
					const { getCastsByFid, getLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const followedFids: number[] = []
					let linksPageToken: string | undefined
					const maxFollowedFids = Math.min(subsetRowLimit * 2, 50)
					do {
						const remaining = Math.max(maxFollowedFids - followedFids.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getLinksByFid)({
							fidSelector: viewerFid,
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
					const refs: CastEntity[] = []
					const perAuthor = Math.max(
						1,
						Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1)),
					)
					for (const fidSelector of followedFids) {
						if (refs.length >= subsetRowLimit) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector,
							pageSize: Math.min(perAuthor, snapchainMaxPageSize),
							reverse: true,
						})
						for (const cast of page.messages ?? []) {
							const authorFid = cast.data?.fidSelector
							if (authorFid == null) continue
							refs.push({
								[EntityMetaKey.Selector]: {
									fidSelector: authorFid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							} satisfies CastEntity)
							if (refs.length >= subsetRowLimit) break
						}
					}
					return refs
				}

				if (variant === 'byUser') {
					const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector: fidSelector,
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
									fid: entitySelector.fid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							}) satisfies CastEntity))
					)
				}

				if (variant === 'byChannel') {
					const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
					const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
					const channel = await singleFlight(getChannel)(channelId)
					const channelPageUrl = (
						optionalNonemptyString(channel?.url)
						?? `https://warpcast.com/~/channel/${channelId}`
					)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByParent)({
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
				}

				const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const fids: number[] = []
				let fidsPageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
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
						const page = await singleFlight(getCastsByFid)({
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
[FarcasterFeedSelector.ByUser]: async ({ channelId, fid: fidSelector, variant, viewerFid }, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const subsetRowLimit = resolverContextRowLimit(context)

				if (variant === 'following') {
					const { getCastsByFid, getLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const followedFids: number[] = []
					let linksPageToken: string | undefined
					const maxFollowedFids = Math.min(subsetRowLimit * 2, 50)
					do {
						const remaining = Math.max(maxFollowedFids - followedFids.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getLinksByFid)({
							fidSelector: viewerFid,
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
					const refs: CastEntity[] = []
					const perAuthor = Math.max(
						1,
						Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1)),
					)
					for (const fidSelector of followedFids) {
						if (refs.length >= subsetRowLimit) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector,
							pageSize: Math.min(perAuthor, snapchainMaxPageSize),
							reverse: true,
						})
						for (const cast of page.messages ?? []) {
							const authorFid = cast.data?.fidSelector
							if (authorFid == null) continue
							refs.push({
								[EntityMetaKey.Selector]: {
									fidSelector: authorFid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							} satisfies CastEntity)
							if (refs.length >= subsetRowLimit) break
						}
					}
					return refs
				}

				if (variant === 'byUser') {
					const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector: fidSelector,
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
									fid: entitySelector.fid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							}) satisfies CastEntity))
					)
				}

				if (variant === 'byChannel') {
					const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
					const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
					const channel = await singleFlight(getChannel)(channelId)
					const channelPageUrl = (
						optionalNonemptyString(channel?.url)
						?? `https://warpcast.com/~/channel/${channelId}`
					)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByParent)({
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
				}

				const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const fids: number[] = []
				let fidsPageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
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
						const page = await singleFlight(getCastsByFid)({
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
[FarcasterFeedSelector.ByChannel]: async ({ channelId, fid: fidSelector, variant, viewerFid }, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const subsetRowLimit = resolverContextRowLimit(context)

				if (variant === 'following') {
					const { getCastsByFid, getLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const followedFids: number[] = []
					let linksPageToken: string | undefined
					const maxFollowedFids = Math.min(subsetRowLimit * 2, 50)
					do {
						const remaining = Math.max(maxFollowedFids - followedFids.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getLinksByFid)({
							fidSelector: viewerFid,
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
					const refs: CastEntity[] = []
					const perAuthor = Math.max(
						1,
						Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1)),
					)
					for (const fidSelector of followedFids) {
						if (refs.length >= subsetRowLimit) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector,
							pageSize: Math.min(perAuthor, snapchainMaxPageSize),
							reverse: true,
						})
						for (const cast of page.messages ?? []) {
							const authorFid = cast.data?.fidSelector
							if (authorFid == null) continue
							refs.push({
								[EntityMetaKey.Selector]: {
									fidSelector: authorFid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							} satisfies CastEntity)
							if (refs.length >= subsetRowLimit) break
						}
					}
					return refs
				}

				if (variant === 'byUser') {
					const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector: fidSelector,
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
									fid: entitySelector.fid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							}) satisfies CastEntity))
					)
				}

				if (variant === 'byChannel') {
					const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
					const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
					const channel = await singleFlight(getChannel)(channelId)
					const channelPageUrl = (
						optionalNonemptyString(channel?.url)
						?? `https://warpcast.com/~/channel/${channelId}`
					)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByParent)({
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
				}

				const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const fids: number[] = []
				let fidsPageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
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
						const page = await singleFlight(getCastsByFid)({
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
[FarcasterFeedSelector.Following]: async ({ channelId, fid: fidSelector, variant, viewerFid }, context) => {
				const { snapchainMaxPageSize } = await import('$/sources/Snapchain/Rest/constants.ts')

				type CastEntity = import('$/schema/$schema.ts').Entity<typeof schema, EntityType.FarcasterCast>
				type SnapCast = import('$/sources/Snapchain/Rest/types.ts').SnapchainCast
				const subsetRowLimit = resolverContextRowLimit(context)

				if (variant === 'following') {
					const { getCastsByFid, getLinksByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const followedFids: number[] = []
					let linksPageToken: string | undefined
					const maxFollowedFids = Math.min(subsetRowLimit * 2, 50)
					do {
						const remaining = Math.max(maxFollowedFids - followedFids.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getLinksByFid)({
							fidSelector: viewerFid,
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
					const refs: CastEntity[] = []
					const perAuthor = Math.max(
						1,
						Math.ceil(subsetRowLimit / Math.max(followedFids.length, 1)),
					)
					for (const fidSelector of followedFids) {
						if (refs.length >= subsetRowLimit) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector,
							pageSize: Math.min(perAuthor, snapchainMaxPageSize),
							reverse: true,
						})
						for (const cast of page.messages ?? []) {
							const authorFid = cast.data?.fidSelector
							if (authorFid == null) continue
							refs.push({
								[EntityMetaKey.Selector]: {
									fidSelector: authorFid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							} satisfies CastEntity)
							if (refs.length >= subsetRowLimit) break
						}
					}
					return refs
				}

				if (variant === 'byUser') {
					const { getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByFid)({
							fidSelector: fidSelector,
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
									fid: entitySelector.fid,
									hash: lowerHex0xCastHash(cast.hash),
								},
							}) satisfies CastEntity))
					)
				}

				if (variant === 'byChannel') {
					const { getChannel } = await import('$/sources/Farcaster/Rest/queries.ts')
					const { getCastsByParent } = await import('$/sources/Snapchain/Rest/queries.ts')
					const channel = await singleFlight(getChannel)(channelId)
					const channelPageUrl = (
						optionalNonemptyString(channel?.url)
						?? `https://warpcast.com/~/channel/${channelId}`
					)
					const casts: SnapCast[] = []
					let pageToken: string | undefined
					do {
						const remaining = Math.max(subsetRowLimit - casts.length, 0)
						if (remaining === 0) break
						const page = await singleFlight(getCastsByParent)({
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
				}

				const { getFids, getCastsByFid } = await import('$/sources/Snapchain/Rest/queries.ts')
				const fids: number[] = []
				let fidsPageToken: string | undefined
				do {
					const remaining = Math.max(subsetRowLimit - fids.length, 0)
					if (remaining === 0) break
					const page = await singleFlight(getFids)({
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
						const page = await singleFlight(getCastsByFid)({
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
			}
			},
		})({
				fields: {
				$$entries: (entries) => entries,
			},
			}),

	],
}
