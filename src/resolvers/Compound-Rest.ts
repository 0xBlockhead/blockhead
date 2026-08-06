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
import type { CompoundCometAccountPosition } from '$/sources/Compound/Contracts/types.ts'
import type {
	CompoundCometConfiguration,
	CompoundCometConfigurationAsset,
	CompoundCometRoots,
} from '$/sources/Compound/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CompoundCometId = EntitySelector<typeof schema, EntityType.CompoundComet>
type CompoundCometAssetId = EntitySelector<typeof schema, EntityType.CompoundCometAsset>
type CompoundPositionId = EntitySelector<typeof schema, EntityType.CompoundPosition>
type CompoundPositionCollateralId = EntitySelector<typeof schema, EntityType.CompoundPositionCollateral>
type EvmNetworkAccountId = EntitySelector<typeof schema, EntityType.EvmNetworkAccount>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Compound_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Compound_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
}

const resolveCompoundCometDeployment = async (
	$network: NetworkId,
	cometAddress: CompoundCometId['cometAddress']
) => {
	const chainId = eip155ChainId($network)
	const {
		compoundCometByChainIdAndAddress,
		compoundNetworkByChainId,
	} = await import('$/sources/Compound/Rest/constants.ts')
	if (compoundNetworkByChainId[chainId] == null)
		throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

	const deployment = compoundCometByChainIdAndAddress[`${String(chainId)}:${cometAddress.toLowerCase()}`]
	if (deployment == null)
		throw new Error(`${Source.Compound_Rest}: unknown comet ${cometAddress} on chain ${String(chainId)}`)

	const {
		getConfiguration,
		getRoots,
	} = await import('$/sources/Compound/Rest/queries.ts')
	const [
		configuration,
		roots,
	] = await Promise.all([
		getConfiguration({
			networkSlug: deployment.networkSlug,
			marketSlug: deployment.marketSlug,
		}),
		getRoots({
			networkSlug: deployment.networkSlug,
			marketSlug: deployment.marketSlug,
			expectedCometAddress: cometAddress,
		}),
	])

	return {
		marketSlug: deployment.marketSlug,
		configuration,
		roots,
	}
}

const mapCompoundCometSnapshot = (
	network: NetworkId,
	marketSlug: string,
	configuration: CompoundCometConfiguration,
	roots: CompoundCometRoots
) => ({
	$network: {
		[EntityMetaKey.Selector]: network,
	},
	cometAddress: roots.cometAddress,
	marketSlug,
	name: configuration.name,
	symbol: configuration.symbol,
	baseTokenSymbol: configuration.baseTokenSymbol,
	baseTokenAddress: configuration.baseTokenAddress,
	baseTokenPriceFeedAddress: configuration.baseTokenPriceFeedAddress,
	collateralAssetCount: configuration.collateralAssetCount,
	rates: configuration.rates,
	...(configuration.borrowMin != null && {
		borrowMin: configuration.borrowMin,
	}),
	...(configuration.targetReserves != null && {
		targetReserves: configuration.targetReserves,
	}),
	...(configuration.governorAddress != null && {
		governorAddress: configuration.governorAddress,
	}),
	...(configuration.pauseGuardianAddress != null && {
		pauseGuardianAddress: configuration.pauseGuardianAddress,
	}),
	...(roots.configuratorAddress != null && {
		configuratorAddress: roots.configuratorAddress,
	}),
	...(roots.rewardsAddress != null && {
		rewardsAddress: roots.rewardsAddress,
	}),
	...(roots.bulkerAddress != null && {
		bulkerAddress: roots.bulkerAddress,
	}),
	assets: configuration.assets,
})

const mapCompoundCometAssetSnapshot = (
	$comet: CompoundCometId,
	asset: CompoundCometConfigurationAsset
) => ({
	$comet: {
		[EntityMetaKey.Selector]: $comet,
	},
	symbol: asset.symbol,
	tokenAddress: asset.tokenAddress,
	priceFeedAddress: asset.priceFeedAddress,
	decimals: asset.decimals,
	borrowCF: asset.borrowCF,
	liquidateCF: asset.liquidateCF,
	liquidationFactor: asset.liquidationFactor,
	supplyCap: asset.supplyCap,
})

const resolveCompoundComet = async ({
	$network,
	cometAddress,
}: CompoundCometId) => {
	const {
		marketSlug,
		configuration,
		roots,
	} = await resolveCompoundCometDeployment($network, cometAddress)

	const { getCometTipRates } = await import('$/sources/Compound/Contracts/queries.ts')
	const tipRates = await getCometTipRates({
		chainId: eip155ChainId($network),
		cometAddress,
	})
	const wad = 1e18
	const secondsPerYear = 31_536_000
	const tipApy = (ratePerSecond: string) => (
		(1 + Number(ratePerSecond) / wad) ** secondsPerYear - 1
	)

	return {
		...mapCompoundCometSnapshot(
			$network,
			marketSlug,
			configuration,
			roots
		),
		supplyKink: configuration.rates.supplyKink,
		supplySlopeLow: configuration.rates.supplySlopeLow,
		supplySlopeHigh: configuration.rates.supplySlopeHigh,
		supplyBase: configuration.rates.supplyBase,
		borrowKink: configuration.rates.borrowKink,
		borrowSlopeLow: configuration.rates.borrowSlopeLow,
		borrowSlopeHigh: configuration.rates.borrowSlopeHigh,
		borrowBase: configuration.rates.borrowBase,
		utilization: Number(tipRates.utilization) / wad,
		supplyApy: tipApy(tipRates.supplyRatePerSecond),
		borrowApy: tipApy(tipRates.borrowRatePerSecond),
	}
}

const compoundPositionSelector = (
	$account: EvmNetworkAccountId,
	cometAddress: `0x${string}`
) => ({
	$account,
	$comet: {
		$network: $account.$network,
		cometAddress,
	},
})

const mapCompoundPositionSnapshot = (
	$account: EvmNetworkAccountId,
	position: CompoundCometAccountPosition
) => {
	const $position = compoundPositionSelector($account, position.cometAddress)
	return {
		$account: {
			[EntityMetaKey.Selector]: $account,
		},
		$comet: {
			[EntityMetaKey.Selector]: $position.$comet,
		},
		baseTokenSymbol: position.baseToken.symbol,
		baseTokenAddress: position.baseToken.address,
		...(position.baseToken.suppliedBalance !== '0' && {
			suppliedBalance: position.baseToken.suppliedBalance,
		}),
		...(position.baseToken.borrowedBalance !== '0' && {
			borrowedBalance: position.baseToken.borrowedBalance,
		}),
		$$collaterals: position.collateral.map((collateral) => ({
			[EntityMetaKey.Selector]: {
				$position,
				$asset: {
					$comet: $position.$comet,
					symbol: collateral.symbol,
				},
			},
		})),
	}
}

export default {
	source: Source.Compound_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }: EvmNetworkAccountId, context) => {
						const chainId = eip155ChainId($network)
						const { compoundNetworkByChainId } = await import('$/sources/Compound/Rest/constants.ts')
						if (compoundNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

						const { getAccountPositions } = await import('$/sources/Compound/Contracts/queries.ts')
						const $account = {
							$actor,
							$network,
						}
						const positions = (
							await getAccountPositions({
								chainId,
								account: $actor.address,
							})
						).positions
						return {
							positions: positions
								.slice(0, resolverContextRowLimit(context))
								.map((position) => ({
									[EntityMetaKey.Selector]: compoundPositionSelector($account, position.cometAddress),
								})),
							positionCount: positions.length,
						}
					},
				},
			},
		})({
			$$compoundPositions: {
				select: (snapshot) => snapshot.positions,
				resolveCount: (snapshot) => snapshot.positionCount,
			},
		}),

		defineResolver({
			entityType: EntityType.CompoundPosition,
			resolve: {
				AccountComet: {
					resolve: async ({
						$account,
						$comet,
					}: CompoundPositionId) => {
						const chainId = eip155ChainId($account.$network)
						const { compoundNetworkByChainId } = await import('$/sources/Compound/Rest/constants.ts')
						if (compoundNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedCometAddress = hexLowerOfByteSize($comet.cometAddress, 20)
						if (normalizedCometAddress == null)
							throw new Error(`${Source.Compound_Rest}: invalid comet address ${$comet.cometAddress}`)

						const { getAccountPositions } = await import('$/sources/Compound/Contracts/queries.ts')
						const position = (
							await getAccountPositions({
								chainId,
								account: $account.$actor.address,
							})
						).positions.find((candidate) => candidate.cometAddress === normalizedCometAddress)
						if (position == null)
							throw new Error(`${Source.Compound_Rest}: position not found for comet ${normalizedCometAddress}`)

						return mapCompoundPositionSnapshot($account, position)
					},
				},
			},
		})({
			$account: (position) => position.$account,
			$comet: (position) => position.$comet,
			baseTokenSymbol: (position) => position.baseTokenSymbol,
			baseTokenAddress: (position) => position.baseTokenAddress,
			suppliedBalance: (position) => position.suppliedBalance,
			borrowedBalance: (position) => position.borrowedBalance,
			$$collaterals: {
				select: (position) => position.$$collaterals,
				resolveCount: (position) => position.$$collaterals.length,
			},
		}),

		defineResolver({
			entityType: EntityType.CompoundPositionCollateral,
			resolve: {
				PositionAsset: {
					resolve: async ({
						$position,
						$asset,
					}: CompoundPositionCollateralId) => {
						const chainId = eip155ChainId($position.$account.$network)
						const { compoundNetworkByChainId } = await import('$/sources/Compound/Rest/constants.ts')
						if (compoundNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

						const normalizedCometAddress = hexLowerOfByteSize($position.$comet.cometAddress, 20)
						if (normalizedCometAddress == null)
							throw new Error(`${Source.Compound_Rest}: invalid comet address ${$position.$comet.cometAddress}`)

						const { getAccountPositions } = await import('$/sources/Compound/Contracts/queries.ts')
						const position = (
							await getAccountPositions({
								chainId,
								account: $position.$account.$actor.address,
							})
						).positions.find((candidate) => candidate.cometAddress === normalizedCometAddress)
						if (position == null)
							throw new Error(`${Source.Compound_Rest}: position not found for comet ${normalizedCometAddress}`)

						const collateral = position.collateral.find((candidate) => candidate.symbol === $asset.symbol)
						if (collateral == null)
							throw new Error(`${Source.Compound_Rest}: position has no collateral ${$asset.symbol}`)

						return {
							$position: {
								[EntityMetaKey.Selector]: $position,
							},
							$asset: {
								[EntityMetaKey.Selector]: $asset,
							},
							balance: collateral.balance,
						}
					},
				},
			},
		})({
			$position: (collateral) => collateral.$position,
			$asset: (collateral) => collateral.$asset,
			balance: (collateral) => collateral.balance,
		}),

		defineResolver({
			entityType: EntityType.CompoundComet,
			resolve: {
				NetworkCometAddress: {
					resolve: async ({
						$network,
						cometAddress,
					}: CompoundCometId) => (
						resolveCompoundComet({
							$network,
							cometAddress,
						})
					),
				},
			},
		})({
			$network: (comet) => comet.$network,
			cometAddress: (comet) => comet.cometAddress,
			marketSlug: (comet) => comet.marketSlug,
			name: (comet) => comet.name,
			symbol: (comet) => comet.symbol,
			baseTokenSymbol: (comet) => comet.baseTokenSymbol,
			baseTokenAddress: (comet) => comet.baseTokenAddress,
			baseTokenPriceFeedAddress: (comet) => comet.baseTokenPriceFeedAddress,
			collateralAssetCount: (comet) => comet.collateralAssetCount,
			borrowMin: (comet) => comet.borrowMin,
			targetReserves: (comet) => comet.targetReserves,
			governorAddress: (comet) => comet.governorAddress,
			pauseGuardianAddress: (comet) => comet.pauseGuardianAddress,
			configuratorAddress: (comet) => comet.configuratorAddress,
			rewardsAddress: (comet) => comet.rewardsAddress,
			bulkerAddress: (comet) => comet.bulkerAddress,
			supplyKink: (comet) => comet.supplyKink,
			supplySlopeLow: (comet) => comet.supplySlopeLow,
			supplySlopeHigh: (comet) => comet.supplySlopeHigh,
			supplyBase: (comet) => comet.supplyBase,
			borrowKink: (comet) => comet.borrowKink,
			borrowSlopeLow: (comet) => comet.borrowSlopeLow,
			borrowSlopeHigh: (comet) => comet.borrowSlopeHigh,
			borrowBase: (comet) => comet.borrowBase,
			utilization: (comet) => comet.utilization,
			supplyApy: (comet) => comet.supplyApy,
			borrowApy: (comet) => comet.borrowApy,
			$$assets: {
				select: (comet) => (
					comet.assets.map((asset) => ({
						[EntityMetaKey.Selector]: {
							$comet: {
								$network: comet.$network[EntityMetaKey.Selector],
								cometAddress: comet.cometAddress,
							},
							symbol: asset.symbol,
						},
					}))
				),
				resolveCount: (comet) => comet.collateralAssetCount,
			},
		}),

		defineResolver({
			entityType: EntityType.CompoundCometAsset,
			resolve: {
				CometAssetSymbol: {
					resolve: async ({
						$comet,
						symbol,
					}: CompoundCometAssetId) => {
						const comet = await resolveCompoundComet($comet)
						const asset = comet.assets.find((candidate) => candidate.symbol === symbol)
						if (asset == null)
							throw new Error(`${Source.Compound_Rest}: comet ${$comet.cometAddress} has no collateral asset ${symbol}`)

						return mapCompoundCometAssetSnapshot($comet, asset)
					},
				},
			},
		})({
			$comet: (asset) => asset.$comet,
			symbol: (asset) => asset.symbol,
			tokenAddress: (asset) => asset.tokenAddress,
			priceFeedAddress: (asset) => asset.priceFeedAddress,
			decimals: (asset) => asset.decimals,
			borrowCF: (asset) => asset.borrowCF,
			liquidateCF: (asset) => asset.liquidateCF,
			liquidationFactor: (asset) => asset.liquidationFactor,
			supplyCap: (asset) => asset.supplyCap,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async (network) => {
						const chainId = eip155ChainId(network)
						const {
							compoundCometsByChainId,
							compoundNetworkByChainId,
						} = await import('$/sources/Compound/Rest/constants.ts')
						if (compoundNetworkByChainId[chainId] == null)
							throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

						const deployments = compoundCometsByChainId[chainId]
						if (deployments == null)
							throw new Error(`${Source.Compound_Rest}: unsupported chain id ${String(chainId)}`)

						return deployments.map((deployment) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								cometAddress: deployment.cometAddress,
							},
						}))
					},
				},
			},
		})({
			Evm: {
				$$compoundComets: {
					select: (comets) => comets,
					resolveCount: (comets) => comets.length,
				},
			},
		}),
	],
}
