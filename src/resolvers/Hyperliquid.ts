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

const hyperliquidLiquidityProviderVaultAddress = '0xdfc24b077bc1425ad1dea75bcb6f8158e10df303'

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

const hyperliquidCandleInterval = (
	timeInterval: {
		unit: string
		value: number
	}
) => {
	const interval = `${String(timeInterval.value)}${timeInterval.unit}`
	if (
		interval !== '1m'
		&& interval !== '3m'
		&& interval !== '5m'
		&& interval !== '15m'
		&& interval !== '30m'
		&& interval !== '1h'
		&& interval !== '2h'
		&& interval !== '4h'
		&& interval !== '8h'
		&& interval !== '12h'
		&& interval !== '1d'
		&& interval !== '3d'
		&& interval !== '1w'
		&& interval !== '1M'
	)
		throw new Error(`Hyperliquid_Rest: unsupported candle interval ${interval}`)

	return interval
}

const resolveHyperliquidNetworkMetadata = async (
	network: NetworkId,
	limit: number
) => {
	assertHyperliquidMainnet(network)
	const {
		getMeta,
		getSpotMeta,
		getValidatorSummaries,
		getVaultDetails,
	} = await import('$/sources/Hyperliquid/Rest/queries.ts')
	const [
		perpMeta,
		spotMeta,
		validators,
		liquidityProviderVault,
	] = await Promise.all([
		getMeta(),
		getSpotMeta(),
		getValidatorSummaries(),
		getVaultDetails({
			vaultAddress: hyperliquidLiquidityProviderVaultAddress,
		}),
	])
	if (liquidityProviderVault == null)
		throw new Error('Hyperliquid_Rest: liquidity provider vault not found')

	const vaultAddresses = [
		liquidityProviderVault.vaultAddress,
		...(
			liquidityProviderVault.relationship?.type === 'parent' ?
				liquidityProviderVault.relationship.data.childAddresses
			:
				[]
		),
	]
	for (const vaultAddress of vaultAddresses)
		assertHyperliquidAddress(vaultAddress)

	return {
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: Date.now(),
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
				[entityFieldAddressKey(EntityType.HyperliquidNetwork_Timestamp, [], 'vaultCount')]: vaultAddresses.length,
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
		$$vaults: vaultAddresses
			.slice(0, limit)
			.map((vaultAddress) => ({
				[EntityMetaKey.Selector]: {
					$network: network,
					vaultAddress,
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
			entityType: EntityType.HyperliquidPerpMarket_Timestamp,
			resolve: {
				PerpMarketTimestampMsSource: {
					resolve: async ({ $perpMarket }) => {
						assertHyperliquidMainnet($perpMarket.$network)
						const { getMeta } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const perpMarket = (await getMeta()).universe
							.find((market) => market.name === $perpMarket.coin)
						if (perpMarket == null)
							throw new Error(`Hyperliquid_Rest: perp market not found for ${$perpMarket.coin}`)
						return {
							maxLeverage: perpMarket.maxLeverage,
							...(perpMarket.onlyIsolated != null && {
								onlyIsolated: perpMarket.onlyIsolated,
							}),
						}
					},
				}
			},
		})({
			maxLeverage: (snapshot) => snapshot.maxLeverage,
			onlyIsolated: (snapshot) => snapshot.onlyIsolated,
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
						const { getVaultDetails } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const vault = await getVaultDetails({
							vaultAddress,
						})
						if (vault == null)
							throw new Error(`Hyperliquid_Rest: vault not found for ${vaultAddress}`)

						assertHyperliquidAddress(vault.leader)
						const timestampMs = Date.now()
						const limit = resolverContextRowLimit(context)
						return {
							$leader: {
								[EntityMetaKey.Selector]: {
									$network,
									address: vault.leader,
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
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'name')]: vault.name,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'description')]: vault.description,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'apr')]: String(vault.apr),
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'leaderFraction')]: String(vault.leaderFraction),
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'leaderCommission')]: String(vault.leaderCommission),
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'maxDistributable')]: String(vault.maxDistributable),
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'maxWithdrawable')]: String(vault.maxWithdrawable),
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'isClosed')]: vault.isClosed,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'allowDeposits')]: vault.allowDeposits,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'alwaysCloseOnWithdraw')]: vault.alwaysCloseOnWithdraw,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'relationship')]: vault.relationship,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'portfolio')]: vault.portfolio,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'followerCount')]: vault.followers.length,
									[entityFieldAddressKey(EntityType.HyperliquidVault_Timestamp, [], 'followers')]: vault.followers,
								},
							}],
							$$equities: vault.followers
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
								}),
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
			entityType: EntityType.HyperliquidOrderbook_Timestamp,
			resolve: {
				NetworkBookKeyTimestampMsSource: {
					resolve: async ({
						$network,
						bookKey,
					}) => {
						assertHyperliquidMainnet($network)
						const { getL2Book } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const book = await getL2Book({
							coin: bookKey,
						})
						assertSafeWireInteger(book.time, 'orderbook time')
						const [
							bids,
							asks,
						] = book.levels
						return {
							bids,
							asks,
							...(
								bookKey.includes('/') || bookKey.startsWith('@') ?
									{}
								:
									{
										$perpMarket: {
											[EntityMetaKey.Selector]: {
												$network,
												coin: bookKey,
											},
										},
									}
							),
						}
					},
				}
			},
		})({
			bids: (snapshot) => snapshot.bids,
			asks: (snapshot) => snapshot.asks,
			$perpMarket: (snapshot) => snapshot.$perpMarket,
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
						const interval = hyperliquidCandleInterval(timeInterval)
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
						assertHyperliquidAddress(address)
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
							clearinghouseState,
							spotClearinghouseState,
							userFees,
							delegatorSummary,
							userAbstraction,
							userDexAbstraction,
							approvedBuilders,
							borrowLendState,
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
						if (!Number.isSafeInteger(clearinghouseState.time) || clearinghouseState.time < 0)
							throw new Error(`Hyperliquid_Rest: invalid account state time ${String(clearinghouseState.time)}`)

						if (userRoleWire.role === 'agent')
							assertHyperliquidAddress(userRoleWire.data.user)

						if (userRoleWire.role === 'subAccount')
							assertHyperliquidAddress(userRoleWire.data.master)

						for (const builder of approvedBuilders)
							assertHyperliquidAddress(builder)

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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$account: {
										$network,
										address,
									},
									timestampMs: clearinghouseState.time,
									source: Source.Hyperliquid,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'accountValue')]: clearinghouseState.marginSummary.accountValue,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalNtlPos')]: clearinghouseState.marginSummary.totalNtlPos,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalRawUsd')]: clearinghouseState.marginSummary.totalRawUsd,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'totalMarginUsed')]: clearinghouseState.marginSummary.totalMarginUsed,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'withdrawable')]: clearinghouseState.withdrawable,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'crossMaintenanceMarginUsed')]: clearinghouseState.crossMaintenanceMarginUsed,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'assetPositions')]: clearinghouseState.assetPositions,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'spotBalances')]: spotClearinghouseState.balances,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'feeSchedule')]: userFees,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'stakingSummary')]: delegatorSummary,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'userAbstraction')]: userAbstraction,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'userDexAbstraction')]: userDexAbstraction,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'approvedBuilders')]: approvedBuilders,
									[entityFieldAddressKey(EntityType.HyperliquidAccount_Timestamp, [], 'borrowLendState')]: borrowLendState,
								},
							}],
						}
					},
				}
			},
		})({
			accountRole: (snapshot) => snapshot.accountRole,
			$masterAccount: (snapshot) => snapshot.$masterAccount,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
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

						const { getHistoricalOrders } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const orders = (await getHistoricalOrders({
							user: account.address,
						})).toSorted((left, right) => (
							right.statusTimestamp - left.statusTimestamp
							|| right.order.timestamp - left.order.timestamp
							|| right.order.oid - left.order.oid
						))
						const orderIds = new Set<number>()
						for (const historicalOrder of orders) {
							assertSafeWireInteger(historicalOrder.order.oid, 'order id')
							assertSafeWireInteger(historicalOrder.order.timestamp, 'order timestamp')
							assertSafeWireInteger(historicalOrder.statusTimestamp, 'order status timestamp')
							if (orderIds.has(historicalOrder.order.oid))
								throw new Error(`Hyperliquid_Rest: duplicate historical order ${String(historicalOrder.order.oid)}`)

							orderIds.add(historicalOrder.order.oid)
						}

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
				select: (page, account) => page.orders.map(({ order, status, statusTimestamp }) => ({
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
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'status')]: status,
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'statusTimestampMs')]: statusTimestamp,
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'size')]: order.sz,
								[entityFieldAddressKey(EntityType.HyperliquidOrder_Timestamp, [], 'children')]: order.children,
							},
						}],
					},
				})),
				continuation: (page, account) => (
					page.terminal ?
						{
							operation: 'historical-orders',
							target: account.address,
							terminal: true,
						}
					:
						{
							operation: 'historical-orders',
							target: account.address,
							terminal: false,
							token: String(page.offset + page.limit),
						}
				),
			},
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

						const { getUserFillsByTime } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const response = await getUserFillsByTime({
							user: account.address,
							startTime: cursorTime,
						})
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
			entityType: EntityType.HyperliquidValidator_Timestamp,
			resolve: {
				ValidatorTimestampMsSource: {
					resolve: async ({ $validator }) => {
						assertHyperliquidMainnet($validator.$network)
						const { getValidatorSummaries } = await import('$/sources/Hyperliquid/Rest/queries.ts')
						const validator = (await getValidatorSummaries())
							.find((summary) => summary.validator.toLowerCase() === $validator.validator.toLowerCase())
						if (validator == null) throw new Error(`Hyperliquid_Rest: validator not found for ${$validator.validator}`)
						return {
							name: validator.name,
							signerAddress: validator.signer,
							$signer: {
								[EntityMetaKey.Selector]: {
									$network: $validator.$network,
									address: validator.signer,
								},
							},
							commission: validator.commission,
							recentBlockCount: validator.nRecentBlocks,
							stake: BigInt(validator.stake),
							isActive: validator.isActive,
							isJailed: validator.isJailed,
						}
					},
				}
			},
		})({
			name: (snapshot) => snapshot.name,
			signerAddress: (snapshot) => snapshot.signerAddress,
			$signer: (snapshot) => snapshot.$signer,
			commission: (snapshot) => snapshot.commission,
			recentBlockCount: (snapshot) => snapshot.recentBlockCount,
			stake: (snapshot) => snapshot.stake,
			isActive: (snapshot) => snapshot.isActive,
			isJailed: (snapshot) => snapshot.isJailed,
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
			$$vaults: (snapshot) => snapshot.$$vaults,
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
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
