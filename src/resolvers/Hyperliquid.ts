import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hyperliquidEvmResolvers } from '$/resolvers/HyperliquidEvm.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { hyperliquidJsonRpcEndpoints } from '$/sources/Hyperliquid/JsonRpc/queries.ts'
import { hyperliquidRestEndpoints } from '$/sources/Hyperliquid/Rest/queries.ts'
import type { HyperliquidMetaAndAssetCtxs } from '$/sources/Hyperliquid/Rest/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertHyperliquidMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug.hyperliquid.slug)
		throw new Error('Hyperliquid_Rest: unsupported network')
}

const assertHyperliquidAddress = (address: string) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(address))
		throw new Error(`Hyperliquid_Rest: invalid account address ${address}`)
}

const assertSafeWireInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Hyperliquid_Rest: invalid ${label} ${String(value)}`)

	return BigInt(value)
}

const filledSizeFromOrderSizes = (
	originalSize: string,
	remainingSize: string
) => {
	if (
		!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(originalSize)
		|| !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(remainingSize)
	)
		throw new Error('Hyperliquid_Rest: invalid nonnegative order size')

	const [
		originalWhole,
		originalFraction = '',
	] = originalSize.split('.')
	const [
		remainingWhole,
		remainingFraction = '',
	] = remainingSize.split('.')
	const decimalPlaces = Math.max(
		originalFraction.length,
		remainingFraction.length
	)
	const original = BigInt(
		originalWhole + originalFraction.padEnd(decimalPlaces, '0')
	)
	const remaining = BigInt(
		remainingWhole + remainingFraction.padEnd(decimalPlaces, '0')
	)
	if (remaining > original)
		throw new Error('Hyperliquid_Rest: remaining order size exceeds original size')

	const filled = (original - remaining)
	if (decimalPlaces === 0)
		return filled.toString()

	const decimal = filled.toString().padStart(decimalPlaces + 1, '0')
	const fraction = decimal.slice(-decimalPlaces).replace(/0+$/, '')
	return fraction === '' ?
		decimal.slice(0, -decimalPlaces)
	:
		`${decimal.slice(0, -decimalPlaces)}.${fraction}`
}

const hyperliquidOrderTimestampSnapshot = ({
	order,
	status,
	statusTimestamp,
}: {
	order: {
		children: unknown[]
		origSz: string
		sz: string
	}
	status: string
	statusTimestamp: number
}) => ({
	status,
	statusTimestampMs: statusTimestamp,
	size: order.sz,
	remainingSize: order.sz,
	filledSize: filledSizeFromOrderSizes(order.origSz, order.sz),
	children: order.children,
})

const scaleDecimalString = (
	value: string,
	decimals = 8
) => {
	const [
		whole,
		fraction = '',
	] = value.split('.')
	return BigInt(`${whole}${`${fraction}${'0'.repeat(decimals)}`.slice(0, decimals)}`)
}

const hyperliquidCandleInterval = async (
	timeInterval: {
		unit: string
		value: number
	}
) => {
	const interval = `${String(timeInterval.value)}${timeInterval.unit}`
	const { hyperliquidCandleIntervals } = await import('$/sources/Hyperliquid/Rest/constants.ts')
	if (!hyperliquidCandleIntervals.some((candleInterval) => candleInterval === interval))
		throw new Error(`Hyperliquid_Rest: unsupported candle interval ${interval}`)

	return interval
}

const assertPerpMarketSnapshot = ([
	meta,
	assetContexts,
]: HyperliquidMetaAndAssetCtxs) => {
	if (meta.universe.length !== assetContexts.length)
		throw new Error('Hyperliquid_Rest: perp universe and asset context count differ')

	const coins = new Set<string>()
	for (const market of meta.universe) {
		if (market.name === '')
			throw new Error('Hyperliquid_Rest: invalid perp market coin')

		if (!Number.isSafeInteger(market.szDecimals) || market.szDecimals < 0)
			throw new Error(`Hyperliquid_Rest: invalid perp market size decimals for ${market.name}`)

		if (!Number.isSafeInteger(market.maxLeverage) || market.maxLeverage < 1)
			throw new Error(`Hyperliquid_Rest: invalid perp market max leverage for ${market.name}`)

		if (coins.has(market.name))
			throw new Error(`Hyperliquid_Rest: duplicate perp market ${market.name}`)

		coins.add(market.name)
	}

	return meta
}

const resolveHyperliquidNetworkMetadata = async (
	network: NetworkId,
	limit: number
) => {
	assertHyperliquidMainnet(network)
	const {
		getAllBorrowLendReserveStates,
		getMetaAndAssetCtxs,
		getSpotMeta,
		getValidatorSummaries,
		getVaultSummaries,
	} = await import('$/sources/Hyperliquid/Rest/queries.ts')
	const [
		perpSnapshot,
		spotMeta,
		validators,
		vaultSummaries,
		borrowLendReserves,
	] = await Promise.all([
		getMetaAndAssetCtxs(),
		getSpotMeta(),
		getValidatorSummaries(),
		getVaultSummaries(),
		getAllBorrowLendReserveStates(),
	])
	const perpMeta = assertPerpMarketSnapshot(perpSnapshot)
	const vaultAddresses = new Set<string>()
	for (const vault of vaultSummaries) {
		assertHyperliquidAddress(vault.vaultAddress)
		assertHyperliquidAddress(vault.leader)
		const vaultAddressKey = vault.vaultAddress.toLowerCase()
		if (vaultAddresses.has(vaultAddressKey))
			throw new Error(`Hyperliquid_Rest: duplicate vault summary ${vault.vaultAddress}`)

		vaultAddresses.add(vaultAddressKey)
	}

	const tokenIndexes = new Set<number>()
	for (const [tokenIndex] of borrowLendReserves) {
		if (!Number.isSafeInteger(tokenIndex) || tokenIndex < 0)
			throw new Error(`Hyperliquid_Rest: invalid borrow/lend token index ${String(tokenIndex)}`)

		if (tokenIndexes.has(tokenIndex))
			throw new Error(`Hyperliquid_Rest: duplicate borrow/lend reserve ${String(tokenIndex)}`)

		tokenIndexes.add(tokenIndex)
	}

	const timestampMs = Date.now()
	return {
		vaultCount: vaultSummaries.length,
		borrowLendReserveCount: borrowLendReserves.length,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs,
				source: Source.Hyperliquid,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'perpMarketCount')]: perpMeta.universe.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'spotAssetCount')]: spotMeta.tokens.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'spotPairCount')]: spotMeta.universe.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'validatorCount')]: validators.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'activeValidatorCount')]: validators.filter((validator) => validator.isActive).length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'jailedValidatorCount')]: validators.filter((validator) => validator.isJailed).length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'totalStake')]: validators.reduce(
					(totalStake, validator) => totalStake + BigInt(validator.stake),
					0n
				),
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'vaultCount')]: vaultSummaries.length,
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'borrowLendReserveCount')]: borrowLendReserves.length,
			},
		}],
		$$validators: validators
			.slice(0, limit)
			.map((validator) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					validator: validator.validator,
				},
			})),
		$$perpMarkets: perpMeta.universe
			.slice(0, limit)
			.map((market) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					coin: market.name,
				},
			})),
		$$spotAssets: spotMeta.tokens
			.slice(0, limit)
			.map((token) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					assetId: token.index,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'name')]: token.name,
					[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'szDecimals')]: token.szDecimals,
					[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'weiDecimals')]: token.weiDecimals,
					...(token.tokenId != null && {
						[entityFieldAddressKey(EntityType.HyperliquidSpotAsset, [], 'tokenId')]: token.tokenId,
					}),
				},
			})),
		$$spotPairs: spotMeta.universe
			.slice(0, limit)
			.map((pair) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					pairIndex: pair.index,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidSpotPair, [], '$baseAsset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							assetId: pair.tokens[0],
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidSpotPair, [], '$quoteAsset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							assetId: pair.tokens[1],
						},
					},
				},
			})),
		$$vaults: vaultSummaries
			.slice(0, limit)
			.map((vault) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					vaultAddress: vault.vaultAddress,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidVault, [], '$leader')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: vault.leader,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidVault, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$vault: {
								$network: network,
								vaultAddress: vault.vaultAddress,
							},
							timestampMs,
							source: Source.Hyperliquid,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'name')]: vault.name,
							[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'tvl')]: vault.tvl,
							[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'createTimeMillis')]: vault.createTimeMillis,
							[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'isClosed')]: vault.isClosed,
							[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'relationship')]: vault.relationship,
						},
					}],
				},
			})),
		$$borrowLendReserves: borrowLendReserves
			.slice(0, limit)
			.map(([tokenIndex, state]) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					tokenIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], '$asset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							assetId: tokenIndex,
						},
					},
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'borrowYearlyRate')]: state.borrowYearlyRate,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'supplyYearlyRate')]: state.supplyYearlyRate,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'balance')]: state.balance,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'utilization')]: state.utilization,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'oraclePx')]: state.oraclePx,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'ltv')]: state.ltv,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'totalSupplied')]: state.totalSupplied,
					[entityFieldAddressKey(EntityType.HyperliquidBorrowLendReserve, [], 'totalBorrowed')]: state.totalBorrowed,
				},
			})),
	}
}

export default {
	source: Source.Hyperliquid,

	resolvers: [
		...hyperliquidEvmResolvers,

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertHyperliquidMainnet($network)
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							rpcEndpoints: hyperliquidJsonRpcEndpoints,
							restEndpoints: hyperliquidRestEndpoints,
						}
					},
				}
			},
		})({
			$network: (snapshot) => snapshot.$network,
			rpcEndpoints: (snapshot) => snapshot.rpcEndpoints,
			restEndpoints: (snapshot) => snapshot.restEndpoints,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertHyperliquidMainnet(account.$network)
						assertHyperliquidAddress(account.address)
						const { getUserVaultEquities } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const equities = await getUserVaultEquities({
							user: account.address,
						})
						const vaultAddresses = new Set<string>()
						for (const equity of equities) {
							assertHyperliquidAddress(equity.vaultAddress)
							if (vaultAddresses.has(equity.vaultAddress.toLowerCase()))
								throw new Error(`Hyperliquid_Rest: duplicate vault equity ${equity.vaultAddress}`)

							vaultAddresses.add(equity.vaultAddress.toLowerCase())
						}

						return {
							equities: equities.slice(0, resolverContextRowLimit(context)),
							timestampMs: Date.now(),
						}
					},
				},
			},
		})({
			$$vaultEquities: (snapshot, account) => snapshot.equities.map((equity) => ({
				[EntityMetaKey.Selector]: {
					$account: account,
					$vault: {
						$network: account.$network,
						vaultAddress: equity.vaultAddress,
					},
					timestampMs: snapshot.timestampMs,
					source: Source.Hyperliquid,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'equity')]: equity.equity,
				},
			})),
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertHyperliquidMainnet(network)
						return {
							Hyperliquid: {
								rpcEndpoints: hyperliquidJsonRpcEndpoints,
								restEndpoints: hyperliquidRestEndpoints,
							},
						}
					},
				}
			},
		})({
			Hyperliquid: {
				rpcEndpoints: (snapshot) => snapshot.Hyperliquid.rpcEndpoints,
				restEndpoints: (snapshot) => snapshot.Hyperliquid.restEndpoints,
			},
		}),

		defineResolver({
			entityType: EntityType.HyperliquidPerpMarket,
			resolve: {
				NetworkCoin: {
					resolve: async (entitySelector) => {
						const { $network } = entitySelector
						assertHyperliquidMainnet($network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$perpMarket: entitySelector,
									timestampMs: Date.now(),
									source: Source.Hyperliquid,
								},
							},
						]
					},
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidSpotAsset,
			resolve: {
				NetworkAssetId: {
					resolve: async ({ $network, assetId }) => {
						assertHyperliquidMainnet($network)
						const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const spotMeta = await getSpotMeta()
						const spotToken = spotMeta.tokens
							.find((token) => token.index === assetId)
						if (spotToken == null)
							throw new Error(`Hyperliquid_Rest: spot asset not found for ${String(assetId)}`)
						return {
							name: spotToken.name,
							szDecimals: spotToken.szDecimals,
							weiDecimals: spotToken.weiDecimals,
							...(spotToken.tokenId != null && {
								tokenId: spotToken.tokenId,
							}),
							$$basePairs: spotMeta.universe
								.filter((pair) => pair.tokens[0] === assetId)
								.map((pair) => ({
									[EntityMetaKey.Selector]: {
										$network,
										pairIndex: pair.index,
									},
								})),
							$$quotePairs: spotMeta.universe
								.filter((pair) => pair.tokens[1] === assetId)
								.map((pair) => ({
									[EntityMetaKey.Selector]: {
										$network,
										pairIndex: pair.index,
									},
								})),
						}
					},
				}
			},
		})({
			name: (snapshot) => snapshot.name,
			szDecimals: (snapshot) => snapshot.szDecimals,
			weiDecimals: (snapshot) => snapshot.weiDecimals,
			tokenId: (snapshot) => snapshot.tokenId,
			$$basePairs: (snapshot) => snapshot.$$basePairs,
			$$quotePairs: (snapshot) => snapshot.$$quotePairs,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidSpotPair,
			resolve: {
				NetworkPairIndex: {
					resolve: async ({ $network, pairIndex }) => {
						assertHyperliquidMainnet($network)
						const { getSpotMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const spotPair = (await getSpotMeta()).universe
							.find((pair) => pair.index === pairIndex)
						if (spotPair == null)
							throw new Error(`Hyperliquid_Rest: spot pair not found for ${String(pairIndex)}`)
						return {
							$baseAsset: {
								[EntityMetaKey.Selector]: {
									$network,
									assetId: spotPair.tokens[0],
								},
							},
							$quoteAsset: {
								[EntityMetaKey.Selector]: {
									$network,
									assetId: spotPair.tokens[1],
								},
							},
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$spotPair: {
										$network,
										pairIndex,
									},
									timestampMs: Date.now(),
									source: Source.Hyperliquid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidSpotPair_Timestamp, [], 'name')]: spotPair.name,
									[entityFieldAddressKey(EntityType.HyperliquidSpotPair_Timestamp, [], 'baseAssetId')]: spotPair.tokens[0],
									[entityFieldAddressKey(EntityType.HyperliquidSpotPair_Timestamp, [], 'quoteAssetId')]: spotPair.tokens[1],
									...(spotPair.isCanonical != null && {
										[entityFieldAddressKey(EntityType.HyperliquidSpotPair_Timestamp, [], 'isCanonical')]: spotPair.isCanonical,
									}),
								},
							}],
						}
					},
				}
			},
		})({
			$baseAsset: (snapshot) => snapshot.$baseAsset,
			$quoteAsset: (snapshot) => snapshot.$quoteAsset,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidVault,
			resolve: {
				NetworkVaultAddress: {
					resolve: async ({ $network, vaultAddress }, context) => {
						assertHyperliquidMainnet($network)
						assertHyperliquidAddress(vaultAddress)
						const {
							getVaultDetails,
							getVaultSummaries,
						} = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const [
							vault,
							vaultSummaries,
						] = await Promise.all([
							getVaultDetails({
								vaultAddress,
							}),
							getVaultSummaries(),
						])
						const summary = vaultSummaries
							.find((candidate) => candidate.vaultAddress.toLowerCase() === vaultAddress.toLowerCase())
						if (vault == null && summary == null)
							throw new Error(`Hyperliquid_Rest: vault not found for ${vaultAddress}`)

						const leader = vault?.leader ?? summary?.leader
						if (leader == null)
							throw new Error(`Hyperliquid_Rest: vault leader missing for ${vaultAddress}`)

						assertHyperliquidAddress(leader)
						const timestampMs = Date.now()
						const limit = resolverContextRowLimit(context)
						const name = vault?.name ?? summary?.name
						const isClosed = vault?.isClosed ?? summary?.isClosed
						const relationship = vault?.relationship ?? summary?.relationship
						const tvl = summary?.tvl
						const createTimeMillis = summary?.createTimeMillis
						if (name == null || isClosed == null)
							throw new Error(`Hyperliquid_Rest: vault summary fields missing for ${vaultAddress}`)

						return {
							$leader: {
								[EntityMetaKey.Selector]: {
									$network,
									address: leader,
								},
							},
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$vault: {
										$network,
										vaultAddress,
									},
									timestampMs,
									source: Source.Hyperliquid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'name')]: name,
									...(tvl != null && {
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'tvl')]: tvl,
									}),
									...(createTimeMillis != null && {
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'createTimeMillis')]: createTimeMillis,
									}),
									...(vault != null && {
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'description')]: vault.description,
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'apr')]: String(vault.apr),
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'leaderFraction')]: String(vault.leaderFraction),
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'leaderCommission')]: String(vault.leaderCommission),
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'maxDistributable')]: String(vault.maxDistributable),
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'maxWithdrawable')]: String(vault.maxWithdrawable),
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'allowDeposits')]: vault.allowDeposits,
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'alwaysCloseOnWithdraw')]: vault.alwaysCloseOnWithdraw,
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'portfolio')]: vault.portfolio,
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'followerCount')]: vault.followers.length,
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'followers')]: vault.followers,
									}),
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'isClosed')]: isClosed,
									...(relationship !== undefined && {
										[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'relationship')]: relationship,
									}),
								},
							}],
							$$equities: (
								vault?.followers
									.slice(0, limit)
									.map((follower) => {
										assertHyperliquidAddress(follower.user)
										return {
											[EntityMetaKey.Selector]: {
												$account: {
													$network,
													address: follower.user,
												},
												$vault: {
													$network,
													vaultAddress,
												},
												timestampMs,
												source: Source.Hyperliquid,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'equity')]: follower.vaultEquity,
												[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'pnl')]: follower.pnl,
												[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'allTimePnl')]: follower.allTimePnl,
												[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'daysFollowing')]: follower.daysFollowing,
												[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'vaultEntryTimeMs')]: follower.vaultEntryTime,
												[entityFieldAddressKey(EntityType.HyperliquidVaultEquity_Timestamp, [], 'lockupUntilMs')]: follower.lockupUntil,
											},
										}
									})
								?? []
							),
						}
					},
				}
			},
		})({
			$leader: (snapshot) => snapshot.$leader,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			$$equities: (snapshot) => snapshot.$$equities,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidMarket_TimeInterval_Timestamp,
			resolve: {
				NetworkMarketKeyTimeIntervalTimestampMs: {
					resolve: async ({
						$network,
						marketKey,
						timeInterval,
						timestampMs,
					}) => {
						assertHyperliquidMainnet($network)
						const interval = await hyperliquidCandleInterval(timeInterval)
						const { getCandleSnapshot } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const candle = (await getCandleSnapshot({
							coin: marketKey,
							interval,
							startTime: timestampMs,
							endTime: timestampMs + 86_400_000,
						}))
							.find((candidate) => candidate.t === timestampMs)
						if (candle == null)
							throw new Error(`Hyperliquid_Rest: candle not found for ${marketKey} ${interval} @ ${String(timestampMs)}`)
						return {
							open: scaleDecimalString(candle.o),
							high: scaleDecimalString(candle.h),
							low: scaleDecimalString(candle.l),
							close: scaleDecimalString(candle.c),
							volume: scaleDecimalString(candle.v),
							tradeCount: candle.n,
							...(
								marketKey.includes('/') || marketKey.startsWith('@') ?
									{}
								:
									{
										$perpMarket: {
											[EntityMetaKey.Selector]: {
												$network,
												coin: marketKey,
											},
										},
									}
							),
						}
					},
				}
			},
		})({
			open: (snapshot) => snapshot.open,
			high: (snapshot) => snapshot.high,
			low: (snapshot) => snapshot.low,
			close: (snapshot) => snapshot.close,
			volume: (snapshot) => snapshot.volume,
			tradeCount: (snapshot) => snapshot.tradeCount,
			$perpMarket: (snapshot) => snapshot.$perpMarket,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async ({ $network, address }) => {
						assertHyperliquidMainnet($network)
						const {
							getApprovedBuilders,
							getBorrowLendUserState,
							getClearinghouseState,
							getDelegatorSummary,
							getSpotClearinghouseState,
							getUserAbstraction,
							getUserDexAbstraction,
							getUserFees,
							getUserRole,
						} = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const [
							userRoleWire,
							clearinghouseObservation,
							spotClearinghouseObservation,
							userFeesObservation,
							delegatorSummaryObservation,
							userAbstractionObservation,
							userDexAbstractionObservation,
							approvedBuildersObservation,
							borrowLendObservation,
						] = await Promise.all([
							getUserRole({
								user: address,
							}),
							getClearinghouseState({
								user: address,
							}),
							getSpotClearinghouseState({
								user: address,
							}),
							getUserFees({
								user: address,
							}),
							getDelegatorSummary({
								user: address,
							}),
							getUserAbstraction({
								user: address,
							}),
							getUserDexAbstraction({
								user: address,
							}),
							getApprovedBuilders({
								user: address,
							}),
							getBorrowLendUserState({
								user: address,
							}),
						])
						return {
							accountRole: userRoleWire.role,
							...(userRoleWire.role === 'agent' && {
								$masterAccount: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: userRoleWire.data.user,
									},
								},
							}),
							...(userRoleWire.role === 'subAccount' && {
								$masterAccount: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										address: userRoleWire.data.master,
									},
								},
							}),
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: clearinghouseObservation.infoType,
										timestampMs: clearinghouseObservation.timestampMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'accountValue')]: clearinghouseObservation.state.marginSummary.accountValue,
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalNtlPos')]: clearinghouseObservation.state.marginSummary.totalNtlPos,
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalRawUsd')]: clearinghouseObservation.state.marginSummary.totalRawUsd,
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalMarginUsed')]: clearinghouseObservation.state.marginSummary.totalMarginUsed,
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'withdrawable')]: clearinghouseObservation.state.withdrawable,
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'crossMaintenanceMarginUsed')]: clearinghouseObservation.state.crossMaintenanceMarginUsed,
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'assetPositions')]: clearinghouseObservation.state.assetPositions,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: spotClearinghouseObservation.infoType,
										timestampMs: spotClearinghouseObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'spotBalances')]: spotClearinghouseObservation.state.balances,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: userFeesObservation.infoType,
										timestampMs: userFeesObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'feeSchedule')]: userFeesObservation.fees,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: delegatorSummaryObservation.infoType,
										timestampMs: delegatorSummaryObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'stakingSummary')]: delegatorSummaryObservation.summary,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: userAbstractionObservation.infoType,
										timestampMs: userAbstractionObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'userAbstraction')]: userAbstractionObservation.abstraction,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: userDexAbstractionObservation.infoType,
										timestampMs: userDexAbstractionObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'userDexAbstraction')]: userDexAbstractionObservation.abstraction,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: approvedBuildersObservation.infoType,
										timestampMs: approvedBuildersObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'approvedBuilders')]: approvedBuildersObservation.builders,
									},
								},
								{
									[EntityMetaKey.Selector]: {
										$account: {
											$network,
											address,
										},
										infoType: borrowLendObservation.infoType,
										timestampMs: borrowLendObservation.fetchedAtMs,
										source: Source.Hyperliquid,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'borrowLendHealth')]: borrowLendObservation.state.health,
										...(borrowLendObservation.state.healthFactor != null && {
											[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'borrowLendHealthFactor')]: borrowLendObservation.state.healthFactor,
										}),
									},
								},
							],
							$$borrowLendPositions: borrowLendObservation.state.tokenToState.map(([tokenIndex, position]) => ({
								[EntityMetaKey.Selector]: {
									$account: {
										$network,
										address,
									},
									tokenIndex,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], '$reserve')]: {
										[EntityMetaKey.Selector]: {
											$network,
											tokenIndex,
										},
									},
									[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], '$asset')]: {
										[EntityMetaKey.Selector]: {
											$network,
											assetId: tokenIndex,
										},
									},
									[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'borrowBasis')]: position.borrow.basis,
									[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'borrowValue')]: position.borrow.value,
									[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'supplyBasis')]: position.supply.basis,
									[entityFieldAddressKey(EntityType.HyperliquidBorrowLendPosition, [], 'supplyValue')]: position.supply.value,
								},
							})),
						}
					},
				}
			},
		})({
			accountRole: (snapshot) => snapshot.accountRole,
			$masterAccount: (snapshot) => snapshot.$masterAccount,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			$$borrowLendPositions: (snapshot) => snapshot.$$borrowLendPositions,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertHyperliquidMainnet(account.$network)
						assertHyperliquidAddress(account.address)
						const limit = resolverContextRowLimit(context)
						const offset = context.providerContinuationToken == null ?
							context.pagination.offset ?? 0
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Hyperliquid_Rest: invalid order continuation')

						const {
							getFrontendOpenOrders,
							getHistoricalOrders,
						} = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const [
							historicalOrders,
							openOrders,
						] = await Promise.all([
							getHistoricalOrders({
								user: account.address,
							}),
							getFrontendOpenOrders({
								user: account.address,
							}),
						])
						const orderByOid = new Map<number, {
							order: (typeof historicalOrders)[number]['order']
							status: string
							statusTimestamp: number
						}>()
						for (const historicalOrder of historicalOrders) {
							assertSafeWireInteger(historicalOrder.order.oid, 'order id')
							assertSafeWireInteger(historicalOrder.order.timestamp, 'order timestamp')
							assertSafeWireInteger(historicalOrder.statusTimestamp, 'order status timestamp')
							if (orderByOid.has(historicalOrder.order.oid))
								throw new Error(`Hyperliquid_Rest: duplicate historical order ${String(historicalOrder.order.oid)}`)

							orderByOid.set(historicalOrder.order.oid, historicalOrder)
						}

						for (const openOrder of openOrders) {
							assertSafeWireInteger(openOrder.oid, 'order id')
							assertSafeWireInteger(openOrder.timestamp, 'order timestamp')
							if (orderByOid.has(openOrder.oid))
								continue

							orderByOid.set(openOrder.oid, {
								order: openOrder,
								status: 'open',
								statusTimestamp: openOrder.timestamp,
							})
						}

						const orders = [...orderByOid.values()]
							.toSorted((left, right) => (
								right.statusTimestamp - left.statusTimestamp
								|| right.order.timestamp - left.order.timestamp
								|| right.order.oid - left.order.oid
							))

						return {
							limit,
							offset,
							orders: orders.slice(offset, offset + limit),
							terminal: offset + limit >= orders.length,
						}
					},
				},
			},
		})({
			$$orders: {
				select: (page, account) => page.orders.map(({
					order,
					status,
					statusTimestamp,
				}) => {
					const orderTimestamp = hyperliquidOrderTimestampSnapshot({
						order,
						status,
						statusTimestamp,
					})
					return {
						[EntityMetaKey.Selector]: {
							$account: account,
							oid: assertSafeWireInteger(order.oid, 'order id'),
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'coin')]: order.coin,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'side')]: order.side,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'orderType')]: order.orderType,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'limitPrice')]: order.limitPx,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'originalSize')]: order.origSz,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'triggerCondition')]: order.triggerCondition,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'triggerPrice')]: order.triggerPx,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'reduceOnly')]: order.reduceOnly,
							...(order.tif != null && {
								[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'tif')]: order.tif,
							}),
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'isTrigger')]: order.isTrigger,
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'isPositionTpsl')]: order.isPositionTpsl,
							...(order.cloid != null && {
								[entityFieldAddressKey(EntityType.HyperliquidOrder, [], 'cloid')]: order.cloid,
							}),
							[entityFieldAddressKey(EntityType.HyperliquidOrder, [], '$$timestamps')]: [{
								[EntityMetaKey.Selector]: {
									$order: {
										$account: account,
										oid: assertSafeWireInteger(order.oid, 'order id'),
									},
									timestampMs: statusTimestamp,
									source: Source.Hyperliquid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'status')]: orderTimestamp.status,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'statusTimestampMs')]: orderTimestamp.statusTimestampMs,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'size')]: orderTimestamp.size,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'remainingSize')]: orderTimestamp.remainingSize,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'filledSize')]: orderTimestamp.filledSize,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'children')]: orderTimestamp.children,
								},
							}],
						},
					}
				}),
				continuation: (page, account) => (
					page.terminal ?
						{
							operation: 'account-orders',
							target: account.address,
							terminal: true,
						}
					:
						{
							operation: 'account-orders',
							target: account.address,
							terminal: false,
							token: String(page.offset + page.limit),
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.HyperliquidOrder,
			resolve: {
				AccountOid: {
					resolve: async ({ $account, oid }) => {
						assertHyperliquidMainnet($account.$network)
						assertHyperliquidAddress($account.address)
						const oidNumber = Number(oid)
						assertSafeWireInteger(oidNumber, 'order id')
						if (BigInt(oidNumber) !== BigInt(oid))
							throw new Error(`Hyperliquid_Rest: invalid order id ${String(oid)}`)

						const { getOrderStatus } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const orderStatus = await getOrderStatus({
							user: $account.address,
							oid: oidNumber,
						})
						if (orderStatus.status !== 'order')
							throw new Error(`Hyperliquid_Rest: order not found for ${String(oid)}`)

						const {
							order,
							status,
							statusTimestamp,
						} = orderStatus.order
						assertSafeWireInteger(order.oid, 'order id')
						assertSafeWireInteger(order.timestamp, 'order timestamp')
						assertSafeWireInteger(statusTimestamp, 'order status timestamp')
						if (order.oid !== oidNumber)
							throw new Error(`Hyperliquid_Rest: order id mismatch for ${String(oid)}`)
						const orderTimestamp = hyperliquidOrderTimestampSnapshot({
							order,
							status,
							statusTimestamp,
						})

						return {
							coin: order.coin,
							side: order.side,
							orderType: order.orderType,
							limitPrice: order.limitPx,
							originalSize: order.origSz,
							triggerCondition: order.triggerCondition,
							triggerPrice: order.triggerPx,
							reduceOnly: order.reduceOnly,
							...(order.tif != null && {
								tif: order.tif,
							}),
							isTrigger: order.isTrigger,
							isPositionTpsl: order.isPositionTpsl,
							...(order.cloid != null && {
								cloid: order.cloid,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$order: {
										$account,
										oid: assertSafeWireInteger(order.oid, 'order id'),
									},
									timestampMs: statusTimestamp,
									source: Source.Hyperliquid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'status')]: orderTimestamp.status,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'statusTimestampMs')]: orderTimestamp.statusTimestampMs,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'size')]: orderTimestamp.size,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'remainingSize')]: orderTimestamp.remainingSize,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'filledSize')]: orderTimestamp.filledSize,
									[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'children')]: orderTimestamp.children,
								},
							}],
						}
					},
				},
			},
		})({
			coin: (snapshot) => snapshot.coin,
			side: (snapshot) => snapshot.side,
			orderType: (snapshot) => snapshot.orderType,
			limitPrice: (snapshot) => snapshot.limitPrice,
			originalSize: (snapshot) => snapshot.originalSize,
			triggerCondition: (snapshot) => snapshot.triggerCondition,
			triggerPrice: (snapshot) => snapshot.triggerPrice,
			reduceOnly: (snapshot) => snapshot.reduceOnly,
			tif: (snapshot) => snapshot.tif,
			isTrigger: (snapshot) => snapshot.isTrigger,
			isPositionTpsl: (snapshot) => snapshot.isPositionTpsl,
			cloid: (snapshot) => snapshot.cloid,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidOrder_Timestamp,
			resolve: {
				OrderTimestampMsSource: {
					resolve: async ({
						$order,
						timestampMs,
						source,
					}) => {
						assertHyperliquidMainnet($order.$account.$network)
						assertHyperliquidAddress($order.$account.address)
						if (source !== Source.Hyperliquid)
							throw new Error('Hyperliquid_Rest: order observation source mismatch')

						const oid = Number($order.oid)
						assertSafeWireInteger(oid, 'order id')
						if (BigInt(oid) !== $order.oid)
							throw new Error(`Hyperliquid_Rest: invalid order id ${String($order.oid)}`)

						const { getOrderStatus } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const response = await getOrderStatus({
							user: $order.$account.address,
							oid,
						})
						if (response.status !== 'order')
							throw new Error(`Hyperliquid_Rest: order not found for ${String($order.oid)}`)

						const {
							order,
							status,
							statusTimestamp,
						} = response.order
						assertSafeWireInteger(order.oid, 'order id')
						assertSafeWireInteger(statusTimestamp, 'order status timestamp')
						if (order.oid !== oid)
							throw new Error(`Hyperliquid_Rest: order id mismatch for ${String($order.oid)}`)
						if (statusTimestamp !== timestampMs)
							throw new Error('Hyperliquid_Rest: order observation timestamp mismatch')

						return hyperliquidOrderTimestampSnapshot({
							order,
							status,
							statusTimestamp,
						})
					},
				},
			},
		})({
			status: (snapshot) => snapshot.status,
			statusTimestampMs: (snapshot) => snapshot.statusTimestampMs,
			size: (snapshot) => snapshot.size,
			remainingSize: (snapshot) => snapshot.remainingSize,
			filledSize: (snapshot) => snapshot.filledSize,
			children: (snapshot) => snapshot.children,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidAccount,
			resolve: {
				NetworkAddress: {
					resolve: async (account, context) => {
						assertHyperliquidMainnet(account.$network)
						assertHyperliquidAddress(account.address)
						const limit = resolverContextRowLimit(context)
						const [
							cursorTime,
							cursorTid,
						] = context.providerContinuationToken == null ?
							[0, -1]
						:
							context.providerContinuationToken.split(':').map(Number)
						if (
							!Number.isSafeInteger(cursorTime)
							|| cursorTime < 0
							|| !Number.isSafeInteger(cursorTid)
							|| cursorTid < -1
						)
							throw new Error('Hyperliquid_Rest: invalid fill continuation')

						const {
							getUserFills,
							getUserFillsByTime,
						} = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const response = (
							cursorTime === 0 && cursorTid === -1 ?
								await getUserFills({
									user: account.address,
								})
							:
								await getUserFillsByTime({
									user: account.address,
									startTime: cursorTime,
								})
						)
						const fillIds = new Set<number>()
						for (const fill of response) {
							assertSafeWireInteger(fill.tid, 'fill trade id')
							assertSafeWireInteger(fill.oid, 'fill order id')
							assertSafeWireInteger(fill.time, 'fill timestamp')
							if (fillIds.has(fill.tid))
								throw new Error(`Hyperliquid_Rest: duplicate fill trade id ${String(fill.tid)}`)

							fillIds.add(fill.tid)
						}

						const fills = response
							.filter((fill) => (
								fill.time > cursorTime
								|| (fill.time === cursorTime && fill.tid > cursorTid)
							))
							.toSorted((left, right) => left.time - right.time || left.tid - right.tid)
						return {
							fills: fills.slice(0, limit),
							terminal: response.length < 2_000 && fills.length <= limit,
						}
					},
				},
			},
		})({
			$$fills: {
				select: (page, account) => page.fills.map((fill) => ({
					[EntityMetaKey.Selector]: {
						$account: account,
						tid: assertSafeWireInteger(fill.tid, 'fill trade id'),
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'oid')]: assertSafeWireInteger(fill.oid, 'fill order id'),
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'coin')]: fill.coin,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'side')]: fill.side,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'direction')]: fill.dir,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'price')]: fill.px,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'size')]: fill.sz,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'startPosition')]: fill.startPosition,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'closedPnl')]: fill.closedPnl,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'fee')]: fill.fee,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'feeToken')]: fill.feeToken,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'timeMs')]: fill.time,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'hash')]: fill.hash,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], 'crossed')]: fill.crossed,
						[entityFieldAddressKey(EntityType.HyperliquidFill, [], '$order')]: {
							[EntityMetaKey.Selector]: {
								$account: account,
								oid: assertSafeWireInteger(fill.oid, 'fill order id'),
							},
						},
						...(fill.hash !== `0x${'0'.repeat(64)}` && {
							[entityFieldAddressKey(EntityType.HyperliquidFill, [], '$transaction')]: {
								[EntityMetaKey.Selector]: {
									$network: account.$network,
									txHash: fill.hash,
								},
							},
						}),
					},
				})),
				continuation: (page, account) => {
					const lastFill = page.fills.at(-1)
					return (
						page.terminal || lastFill == null ?
							{
								operation: 'user-fills-by-time',
								target: account.address,
								terminal: true,
							}
						:
							{
								operation: 'user-fills-by-time',
								target: account.address,
								terminal: false,
								token: `${String(lastFill.time)}:${String(lastFill.tid)}`,
							}
					)
				},
			},
		}),

		defineResolver({
			entityType: EntityType.HyperliquidValidator,
			resolve: {
				NetworkValidator: {
					resolve: async (entitySelector) => {
						const { $network } = entitySelector
						assertHyperliquidMainnet($network)
						return [
							{
								[EntityMetaKey.Selector]: {
									$validator: entitySelector,
									timestampMs: Date.now(),
									source: Source.Hyperliquid,
								},
							},
						]
					},
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidBorrowLendReserve,
			resolve: {
				NetworkTokenIndex: {
					resolve: async ({
						$network,
						tokenIndex,
					}) => {
						assertHyperliquidMainnet($network)
						if (!Number.isSafeInteger(tokenIndex) || tokenIndex < 0)
							throw new Error(`Hyperliquid_Rest: invalid borrow/lend token index ${String(tokenIndex)}`)

						const { getAllBorrowLendReserveStates } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const reserves = await getAllBorrowLendReserveStates()
						const row = reserves.find(([index]) => index === tokenIndex)
						if (row == null)
							throw new Error(`Hyperliquid_Rest: borrow/lend reserve not found for token index ${String(tokenIndex)}`)

						const [
							,
							state,
						] = row
						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							tokenIndex,
							$asset: {
								[EntityMetaKey.Selector]: {
									$network,
									assetId: tokenIndex,
								},
							},
							borrowYearlyRate: state.borrowYearlyRate,
							supplyYearlyRate: state.supplyYearlyRate,
							balance: state.balance,
							utilization: state.utilization,
							oraclePx: state.oraclePx,
							ltv: state.ltv,
							totalSupplied: state.totalSupplied,
							totalBorrowed: state.totalBorrowed,
						}
					},
				},
			},
		})({
			$network: (snapshot) => snapshot.$network,
			tokenIndex: (snapshot) => snapshot.tokenIndex,
			$asset: (snapshot) => snapshot.$asset,
			borrowYearlyRate: (snapshot) => snapshot.borrowYearlyRate,
			supplyYearlyRate: (snapshot) => snapshot.supplyYearlyRate,
			balance: (snapshot) => snapshot.balance,
			utilization: (snapshot) => snapshot.utilization,
			oraclePx: (snapshot) => snapshot.oraclePx,
			ltv: (snapshot) => snapshot.ltv,
			totalSupplied: (snapshot) => snapshot.totalSupplied,
			totalBorrowed: (snapshot) => snapshot.totalBorrowed,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidBorrowLendPosition,
			resolve: {
				AccountTokenIndex: {
					resolve: async ({
						$account,
						tokenIndex,
					}) => {
						assertHyperliquidMainnet($account.$network)
						assertHyperliquidAddress($account.address)
						if (!Number.isSafeInteger(tokenIndex) || tokenIndex < 0)
							throw new Error(`Hyperliquid_Rest: invalid borrow/lend position token index ${String(tokenIndex)}`)

						const { getBorrowLendUserState } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const { state } = await getBorrowLendUserState({
							user: $account.address,
						})
						const row = state.tokenToState.find(([index]) => index === tokenIndex)
						if (row == null)
							throw new Error(`Hyperliquid_Rest: borrow/lend position not found for token index ${String(tokenIndex)}`)

						const [
							,
							position,
						] = row
						return {
							$account: {
								[EntityMetaKey.Selector]: $account,
							},
							tokenIndex,
							$reserve: {
								[EntityMetaKey.Selector]: {
									$network: $account.$network,
									tokenIndex,
								},
							},
							$asset: {
								[EntityMetaKey.Selector]: {
									$network: $account.$network,
									assetId: tokenIndex,
								},
							},
							borrowBasis: position.borrow.basis,
							borrowValue: position.borrow.value,
							supplyBasis: position.supply.basis,
							supplyValue: position.supply.value,
						}
					},
				},
			},
		})({
			$account: (snapshot) => snapshot.$account,
			tokenIndex: (snapshot) => snapshot.tokenIndex,
			$reserve: (snapshot) => snapshot.$reserve,
			$asset: (snapshot) => snapshot.$asset,
			borrowBasis: (snapshot) => snapshot.borrowBasis,
			borrowValue: (snapshot) => snapshot.borrowValue,
			supplyBasis: (snapshot) => snapshot.supplyBasis,
			supplyValue: (snapshot) => snapshot.supplyValue,
		}),

		defineResolver({
			entityType: EntityType.HyperliquidNetwork,
			resolve: {
				Network: {
					resolve: ({ $network }, context) => resolveHyperliquidNetworkMetadata(
						$network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
			$$validators: (snapshot) => snapshot.$$validators,
			$$perpMarkets: (snapshot) => snapshot.$$perpMarkets,
			$$spotAssets: (snapshot) => snapshot.$$spotAssets,
			$$spotPairs: (snapshot) => snapshot.$$spotPairs,
			$$vaults: {
				select: (snapshot) => snapshot.$$vaults,
				resolveCount: (snapshot) => snapshot.vaultCount,
			},
			$$borrowLendReserves: {
				select: (snapshot) => snapshot.$$borrowLendReserves,
				resolveCount: (snapshot) => snapshot.borrowLendReserveCount,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: (network, context) => resolveHyperliquidNetworkMetadata(
						network,
						resolverContextRowLimit(context)
					),
				}
			},
		})({
			Hyperliquid: {
				$$timestamps: (snapshot) => snapshot.$$timestamps,
				$$validators: (snapshot) => snapshot.$$validators,
				$$perpMarkets: (snapshot) => snapshot.$$perpMarkets,
				$$spotAssets: (snapshot) => snapshot.$$spotAssets,
				$$spotPairs: (snapshot) => snapshot.$$spotPairs,
				$$vaults: {
					select: (snapshot) => snapshot.$$vaults,
					resolveCount: (snapshot) => snapshot.vaultCount,
				},
				$$borrowLendReserves: {
					select: (snapshot) => snapshot.$$borrowLendReserves,
					resolveCount: (snapshot) => snapshot.borrowLendReserveCount,
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
