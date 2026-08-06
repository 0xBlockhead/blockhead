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
import type {
	AaveAccountPosition,
	AaveMarketSnapshotWire,
} from '$/sources/Aave/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type AaveMarketId = EntitySelector<typeof schema, EntityType.AaveMarket>
type AaveReserveId = EntitySelector<typeof schema, EntityType.AaveReserve>
type AaveReservePositionId = EntitySelector<typeof schema, EntityType.AaveReservePosition>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>

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

const mergeAaveReservePositions = (
	$account: EvmNetworkAccountId,
	positions: readonly AaveAccountPosition[],
	limit: number,
) => {
	const merged = new Map<string, {
		poolAddress: `0x${string}`
		underlyingTokenAddress: `0x${string}`
		symbol: string
		decimals: number
		suppliedBalance?: string
		suppliedBalanceUsd?: string
		supplyApy?: string
		isCollateral?: boolean
		borrowedBalance?: string
		borrowedBalanceUsd?: string
		borrowApy?: string
	}>()

	for (const position of positions) {
		const key = `${position.poolAddress}:${position.underlyingTokenAddress}`
		const row = merged.get(key) ?? {
			poolAddress: position.poolAddress,
			underlyingTokenAddress: position.underlyingTokenAddress,
			symbol: position.symbol,
			decimals: position.decimals,
		}
		if (position.kind === 'supply') {
			row.suppliedBalance = position.balance
			row.suppliedBalanceUsd = position.balanceUsd
			row.supplyApy = position.apy
			row.isCollateral = position.isCollateral
		} else {
			row.borrowedBalance = position.debt
			row.borrowedBalanceUsd = position.debtUsd
			row.borrowApy = position.apy
		}
		merged.set(key, row)
	}

	const rows = [...merged.values()]
	return {
		positions: rows
			.slice(0, limit)
			.map((position) => ({
				[EntityMetaKey.Selector]: {
					$account,
					$reserve: {
						$market: {
							$network: $account.$network,
							poolAddress: position.poolAddress,
						},
						underlyingTokenAddress: position.underlyingTokenAddress,
					},
				},
			})),
		positionCount: rows.length,
	}
}

const mapAaveReservePositionSnapshot = (
	$account: EvmNetworkAccountId,
	position: {
		poolAddress: `0x${string}`
		underlyingTokenAddress: `0x${string}`
		symbol: string
		decimals: number
		suppliedBalance?: string
		suppliedBalanceUsd?: string
		supplyApy?: string
		isCollateral?: boolean
		borrowedBalance?: string
		borrowedBalanceUsd?: string
		borrowApy?: string
	},
) => ({
	$account: {
		[EntityMetaKey.Selector]: $account,
	},
	$reserve: {
		[EntityMetaKey.Selector]: {
			$market: {
				$network: $account.$network,
				poolAddress: position.poolAddress,
			},
			underlyingTokenAddress: position.underlyingTokenAddress,
		},
	},
	symbol: position.symbol,
	decimals: position.decimals,
	...(position.suppliedBalance != null && {
		suppliedBalance: position.suppliedBalance,
	}),
	...(position.suppliedBalanceUsd != null && {
		suppliedBalanceUsd: position.suppliedBalanceUsd,
	}),
	...(position.supplyApy != null && {
		supplyApy: position.supplyApy,
	}),
	...(position.isCollateral != null && {
		isCollateral: position.isCollateral,
	}),
	...(position.borrowedBalance != null && {
		borrowedBalance: position.borrowedBalance,
	}),
	...(position.borrowedBalanceUsd != null && {
		borrowedBalanceUsd: position.borrowedBalanceUsd,
	}),
	...(position.borrowApy != null && {
		borrowApy: position.borrowApy,
	}),
})

export default {
	source: Source.Aave_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { aaveChainByChainId } = await import('$/sources/Aave/Rest/constants.ts')
						if (aaveChainByChainId[chainId] == null)
							throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)

						const { getAccountPositions } = await import('$/sources/Aave/Rest/queries.ts')
						return mergeAaveReservePositions(
							{
								$actor,
								$network,
							},
							await getAccountPositions({
								chainId,
								account: $actor.address,
							}),
							resolverContextRowLimit(context)
						)
					},
				},
			},
		})({
			$$aaveReservePositions: {
				select: (snapshot) => snapshot.positions,
				resolveCount: (snapshot) => snapshot.positionCount,
			},
		}),

		defineResolver({
			entityType: EntityType.AaveReservePosition,
			resolve: {
				AccountReserve: {
					resolve: async ({
						$account,
						$reserve,
					}: AaveReservePositionId) => {
						const chainId = eip155ChainId($account.$network)
						const { aaveChainByChainId } = await import('$/sources/Aave/Rest/constants.ts')
						if (aaveChainByChainId[chainId] == null)
							throw new Error(`${Source.Aave_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedPoolAddress = hexLowerOfByteSize($reserve.$market.poolAddress, 20)
						if (normalizedPoolAddress == null)
							throw new Error(`${Source.Aave_Rest}: invalid pool address ${$reserve.$market.poolAddress}`)

						const normalizedUnderlyingTokenAddress = hexLowerOfByteSize($reserve.underlyingTokenAddress, 20)
						if (normalizedUnderlyingTokenAddress == null)
							throw new Error(`${Source.Aave_Rest}: invalid underlying token address ${$reserve.underlyingTokenAddress}`)

						const { getAccountPositions } = await import('$/sources/Aave/Rest/queries.ts')
						const matched = (
							await getAccountPositions({
								chainId,
								account: $account.$actor.address,
							})
						)
							.filter((position) => (
								position.poolAddress === normalizedPoolAddress
								&& position.underlyingTokenAddress === normalizedUnderlyingTokenAddress
							))
						if (matched.length < 1)
							throw new Error(`${Source.Aave_Rest}: reserve position not found ${normalizedUnderlyingTokenAddress}`)

						const supply = matched.find((position) => position.kind === 'supply')
						const borrow = matched.find((position) => position.kind === 'borrow')
						const head = supply ?? borrow
						if (head == null)
							throw new Error(`${Source.Aave_Rest}: reserve position not found ${normalizedUnderlyingTokenAddress}`)

						return mapAaveReservePositionSnapshot(
							$account,
							{
								poolAddress: normalizedPoolAddress,
								underlyingTokenAddress: normalizedUnderlyingTokenAddress,
								symbol: head.symbol,
								decimals: head.decimals,
								...(supply != null && {
									suppliedBalance: supply.balance,
									suppliedBalanceUsd: supply.balanceUsd,
									supplyApy: supply.apy,
									isCollateral: supply.isCollateral,
								}),
								...(borrow != null && {
									borrowedBalance: borrow.debt,
									borrowedBalanceUsd: borrow.debtUsd,
									borrowApy: borrow.apy,
								}),
							}
						)
					},
				},
			},
		})({
			$account: (position) => position.$account,
			$reserve: (position) => position.$reserve,
			symbol: (position) => position.symbol,
			decimals: (position) => position.decimals,
			suppliedBalance: (position) => position.suppliedBalance,
			suppliedBalanceUsd: (position) => position.suppliedBalanceUsd,
			supplyApy: (position) => position.supplyApy,
			isCollateral: (position) => position.isCollateral,
			borrowedBalance: (position) => position.borrowedBalance,
			borrowedBalanceUsd: (position) => position.borrowedBalanceUsd,
			borrowApy: (position) => position.borrowApy,
		}),

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
						const markets = await listMarkets({
							chainIds: [
								chainId,
							],
						})
						return {
							markets: markets
								.slice(0, resolverContextRowLimit(context))
								.map((market) => ({
									[EntityMetaKey.Selector]: {
										$network: network,
										poolAddress: market.address,
									},
								})),
							marketCount: markets.length,
						}
					},
				},
			},
		})({
			Evm: {
				$$aaveMarkets: {
					select: (snapshot) => snapshot.markets,
					resolveCount: (snapshot) => snapshot.marketCount,
				},
			},
		}),
	],
}
