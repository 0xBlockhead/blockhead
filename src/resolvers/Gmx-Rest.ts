import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	GmxMarketInfo,
	GmxPositionInfo,
} from '$/sources/Gmx/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type GmxMarketId = EntitySelector<typeof schema, EntityType.GmxMarket>
type GmxPositionId = EntitySelector<typeof schema, EntityType.GmxPosition>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>

const gmxPaginationWindow = (
	context: ResolverContext
) => {
	const offset = context.pagination.offset ?? 0
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error(`${Source.Gmx_Rest}: invalid pagination offset`)

	return {
		limit: resolverContextRowLimit(context),
		offset,
	}
}

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Gmx_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Gmx_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapGmxMarketSnapshot = (
	network: NetworkId,
	market: GmxMarketInfo
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	marketTokenAddress: market.marketTokenAddress,
	name: market.name,
	indexTokenAddress: market.indexTokenAddress,
	longTokenAddress: market.longTokenAddress,
	shortTokenAddress: market.shortTokenAddress,
	isSpotOnly: market.isSpotOnly,
	isDisabled: market.isDisabled,
	longInterestUsd: market.longInterestUsd,
	shortInterestUsd: market.shortInterestUsd,
	longPoolAmount: market.longPoolAmount,
	shortPoolAmount: market.shortPoolAmount,
	fundingFactorPerSecond: market.fundingFactorPerSecond,
})

const mapGmxPositionSnapshot = (
	$account: EvmNetworkAccountId,
	position: GmxPositionInfo
) => ({
	$account: {
		[EntityMetaKey.Selector]: $account,
	},
	contractKey: position.contractKey,
	$market: {
		[EntityMetaKey.Selector]: {
			$network: $account.$network,
			marketTokenAddress: position.marketAddress,
		},
	},
	collateralTokenAddress: position.collateralTokenAddress,
	isLong: position.isLong,
	sizeInUsd: position.sizeInUsd,
	sizeInTokens: position.sizeInTokens,
	collateralAmount: position.collateralAmount,
	...(position.collateralUsd.length > 0 && {
		collateralUsd: position.collateralUsd,
	}),
	...(position.positionValueInUsd.length > 0 && {
		positionValueInUsd: position.positionValueInUsd,
	}),
	...(position.pnl.length > 0 && {
		pnl: position.pnl,
	}),
	...(position.leverage.length > 0 && {
		leverage: position.leverage,
	}),
	...(position.entryPrice.length > 0 && {
		entryPrice: position.entryPrice,
	}),
	...(position.markPrice.length > 0 && {
		markPrice: position.markPrice,
	}),
	...(position.liquidationPrice.length > 0 && {
		liquidationPrice: position.liquidationPrice,
	}),
	...(position.indexName.length > 0 && {
		indexName: position.indexName,
	}),
	...(position.poolName.length > 0 && {
		poolName: position.poolName,
	}),
})

export default {
	source: Source.Gmx_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const { getPositionsInfo } = await import('$/sources/Gmx/Rest/queries.ts')
						const $account = {
							$actor,
							$network,
						}
						const positions = await getPositionsInfo({
							chainId,
							address: $actor.address,
						})
						const {
							limit,
							offset,
						} = gmxPaginationWindow(context)
						return {
							positions: positions
								.slice(offset, offset + limit)
								.map((position) => ({
									[EntityMetaKey.Selector]: {
										$account,
										contractKey: position.contractKey,
									},
								})),
							positionCount: positions.length,
						}
					},
				},
			},
		})({
			$$gmxPositions: {
				select: (snapshot) => snapshot.positions,
				resolveCount: (snapshot) => snapshot.positionCount,
			},
		}),

		defineResolver({
			entityType: EntityType.GmxPosition,
			resolve: {
				AccountContractKey: {
					resolve: async ({
						$account,
						contractKey,
					}: GmxPositionId) => {
						const chainId = eip155ChainId($account.$network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedContractKey = hexLowerOfByteSize(contractKey, 32)
						if (normalizedContractKey == null)
							throw new Error(`${Source.Gmx_Rest}: invalid contract key ${contractKey}`)

						const { getPositionByKey } = await import('$/sources/Gmx/Rest/queries.ts')
						const position = await getPositionByKey({
							chainId,
							contractKey: normalizedContractKey,
						})
						const normalizedAccountAddress = hexLowerOfByteSize($account.$actor.address, 20)
						if (normalizedAccountAddress == null)
							throw new Error(`${Source.Gmx_Rest}: invalid position account ${$account.$actor.address}`)
						if (position.account !== normalizedAccountAddress)
							throw new Error(`${Source.Gmx_Rest}: position belongs to a different account`)

						return mapGmxPositionSnapshot(
							$account,
							position
						)
					},
				},
			},
		})({
			$account: (position) => position.$account,
			contractKey: (position) => position.contractKey,
			$market: (position) => position.$market,
			collateralTokenAddress: (position) => position.collateralTokenAddress,
			isLong: (position) => position.isLong,
			sizeInUsd: (position) => position.sizeInUsd,
			sizeInTokens: (position) => position.sizeInTokens,
			collateralAmount: (position) => position.collateralAmount,
			collateralUsd: (position) => position.collateralUsd,
			positionValueInUsd: (position) => position.positionValueInUsd,
			pnl: (position) => position.pnl,
			leverage: (position) => position.leverage,
			entryPrice: (position) => position.entryPrice,
			markPrice: (position) => position.markPrice,
			liquidationPrice: (position) => position.liquidationPrice,
			indexName: (position) => position.indexName,
			poolName: (position) => position.poolName,
		}),

		defineResolver({
			entityType: EntityType.GmxMarket,
			resolve: {
				NetworkMarketTokenAddress: {
					resolve: async ({
						$network,
						marketTokenAddress,
					}: GmxMarketId) => {
						const chainId = eip155ChainId($network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedMarketTokenAddress = hexLowerOfByteSize(marketTokenAddress, 20)
						if (normalizedMarketTokenAddress == null)
							throw new Error(`${Source.Gmx_Rest}: invalid market token ${marketTokenAddress}`)

						const { getMarketsInfo } = await import('$/sources/Gmx/Rest/queries.ts')
						const market = (
							await getMarketsInfo({
								chainId,
							})
						)
							.find((candidate) => (
								candidate.marketTokenAddress === normalizedMarketTokenAddress
							))
						if (market == null)
							throw new Error(`${Source.Gmx_Rest}: market not found ${normalizedMarketTokenAddress}`)

						return mapGmxMarketSnapshot(
							$network,
							market
						)
					},
				},
			},
		})({
			$network: (market) => market.$network,
			marketTokenAddress: (market) => market.marketTokenAddress,
			name: (market) => market.name,
			indexTokenAddress: (market) => market.indexTokenAddress,
			longTokenAddress: (market) => market.longTokenAddress,
			shortTokenAddress: (market) => market.shortTokenAddress,
			isSpotOnly: (market) => market.isSpotOnly,
			isDisabled: (market) => market.isDisabled,
			longInterestUsd: (market) => market.longInterestUsd,
			shortInterestUsd: (market) => market.shortInterestUsd,
			longPoolAmount: (market) => market.longPoolAmount,
			shortPoolAmount: (market) => market.shortPoolAmount,
			fundingFactorPerSecond: (market) => market.fundingFactorPerSecond,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { gmxApiByChainId } = await import('$/sources/Gmx/Rest/constants.ts')
						if (gmxApiByChainId[chainId] == null)
							throw new Error(`${Source.Gmx_Rest}: unsupported chain id ${String(chainId)}`)

						const { getMarketsInfo } = await import('$/sources/Gmx/Rest/queries.ts')
						const markets = await getMarketsInfo({
							chainId,
						})
						const {
							limit,
							offset,
						} = gmxPaginationWindow(context)
						return {
							markets: markets
								.slice(offset, offset + limit)
								.map((market) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										marketTokenAddress: market.marketTokenAddress,
									},
								})),
							marketCount: markets.length,
						}
					},
				},
			},
		})({
			Evm: {
				$$gmxMarkets: {
					select: (snapshot) => snapshot.markets,
					resolveCount: (snapshot) => snapshot.marketCount,
				},
			},
		}),
	],
}
