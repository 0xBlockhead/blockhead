import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { AaveMarketSnapshotWire } from '$/sources/Aave/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type AaveMarketId = EntitySelector<typeof schema, EntityType.AaveMarket>
type AaveReserveId = EntitySelector<typeof schema, EntityType.AaveReserve>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Aave_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Aave_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const mapAaveMarketSnapshot = (
	network: NetworkId,
	market: AaveMarketSnapshotWire
) => {
	const poolAddress = hexLowerOfByteSize(market.address, 20)
	if (poolAddress == null)
		throw new Error(`${Source.Aave_Rest}: invalid market pool address`)

	return {
		$network: {
			[EntityMetaKey.Selector]: network,
		},
		poolAddress,
		name: market.name,
		icon: market.icon,
		totalMarketSize: market.totalMarketSize,
		totalAvailableLiquidity: market.totalAvailableLiquidity,
		$$reserves: market.reserves.map((reserve) => ({
			[EntityMetaKey.Selector]: {
				$market: {
					$network: network,
					poolAddress,
				},
				underlyingTokenAddress: reserve.underlyingToken.address,
			},
		})),
	}
}

export default {
	source: Source.Aave_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.AaveMarket,
			resolve: {
				NetworkPoolAddress: {
					resolve: async ({
						$network,
						poolAddress,
					}: AaveMarketId) => {
						const chainId = eip155ChainId($network)
						const { aaveChainByChainId } = await import('$/sources/Aave/Rest/constants.ts')
						if (aaveChainByChainId[chainId] == null)
							throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedPoolAddress = hexLowerOfByteSize(poolAddress, 20)
						if (normalizedPoolAddress == null)
							throw new Error(`${Source.Aave_Rest}: invalid pool address ${poolAddress}`)

						const { getMarket } = await import('$/sources/Aave/Rest/queries.ts')
						return mapAaveMarketSnapshot(
							$network,
							await getMarket({
								chainId,
								poolAddress: normalizedPoolAddress,
							})
						)
					},
				},
			},
		})({
			$network: (market) => market.$network,
			poolAddress: (market) => market.poolAddress,
			name: (market) => market.name,
			icon: (market) => market.icon,
			totalMarketSize: (market) => market.totalMarketSize,
			totalAvailableLiquidity: (market) => market.totalAvailableLiquidity,
			$$reserves: {
				select: (market) => market.$$reserves,
				resolveCount: (market) => market.$$reserves.length,
			},
		}),

		defineResolver({
			entityType: EntityType.AaveReserve,
			resolve: {
				MarketUnderlyingTokenAddress: {
					resolve: async ({
						$market,
						underlyingTokenAddress,
					}: AaveReserveId) => {
						const normalizedUnderlyingTokenAddress = hexLowerOfByteSize(underlyingTokenAddress, 20)
						if (normalizedUnderlyingTokenAddress == null)
							throw new Error(`${Source.Aave_Rest}: invalid underlying token address ${underlyingTokenAddress}`)

						const chainId = eip155ChainId($market.$network)
						const { aaveChainByChainId } = await import('$/sources/Aave/Rest/constants.ts')
						if (aaveChainByChainId[chainId] == null)
							throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedPoolAddress = hexLowerOfByteSize($market.poolAddress, 20)
						if (normalizedPoolAddress == null)
							throw new Error(`${Source.Aave_Rest}: invalid pool address ${$market.poolAddress}`)

						const { getMarket } = await import('$/sources/Aave/Rest/queries.ts')
						const market = await getMarket({
							chainId,
							poolAddress: normalizedPoolAddress,
						})
						const reserve = market.reserves.find((candidate) => (
							candidate.underlyingToken.address === normalizedUnderlyingTokenAddress
						))
						if (reserve == null)
							throw new Error(`${Source.Aave_Rest}: reserve not found ${normalizedUnderlyingTokenAddress}`)

						return {
							$market: {
								[EntityMetaKey.Selector]: $market,
							},
							underlyingTokenAddress: reserve.underlyingToken.address,
							name: reserve.underlyingToken.name,
							symbol: reserve.underlyingToken.symbol,
							decimals: reserve.underlyingToken.decimals,
							imageUrl: reserve.underlyingToken.imageUrl,
							totalSupplied: reserve.size.amount.value,
							...(reserve.borrowInfo != null && {
								availableLiquidity: reserve.borrowInfo.availableLiquidity.amount.value,
								borrowApy: reserve.borrowInfo.apy.value,
							}),
							supplyApy: reserve.supplyInfo.apy.value,
							frozen: reserve.isFrozen,
							paused: reserve.isPaused,
						}
					},
				},
			},
		})({
			$market: (reserve) => reserve.$market,
			underlyingTokenAddress: (reserve) => reserve.underlyingTokenAddress,
			name: (reserve) => reserve.name,
			symbol: (reserve) => reserve.symbol,
			decimals: (reserve) => reserve.decimals,
			imageUrl: (reserve) => reserve.imageUrl,
			totalSupplied: (reserve) => reserve.totalSupplied,
			availableLiquidity: (reserve) => reserve.availableLiquidity,
			supplyApy: (reserve) => reserve.supplyApy,
			borrowApy: (reserve) => reserve.borrowApy,
			frozen: (reserve) => reserve.frozen,
			paused: (reserve) => reserve.paused,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network, context) => {
						const chainId = eip155ChainId(network)
						const { aaveChainByChainId } = await import('$/sources/Aave/Rest/constants.ts')
						if (aaveChainByChainId[chainId] == null)
							throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)

						const { listMarkets } = await import('$/sources/Aave/Rest/queries.ts')
						return (await listMarkets({
							chainIds: [
								chainId,
							],
						}))
							.slice(0, resolverContextRowLimit(context))
							.map((market) => ({
								[EntityMetaKey.Selector]: {
									$network: network,
									poolAddress: market.address,
								},
							}))
					},
				},
			},
		})({
			Evm: {
				$$aaveMarkets: (markets) => markets,
			},
		}),
	],
}
