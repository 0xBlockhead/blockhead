import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	CompoundCometConfiguration,
	CompoundCometConfigurationAsset,
	CompoundCometRoots,
} from '$/sources/Compound/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CompoundCometId = EntitySelector<typeof schema, EntityType.CompoundComet>
type CompoundCometAssetId = EntitySelector<typeof schema, EntityType.CompoundCometAsset>

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
	const { compoundCometByChainIdAndAddress } = await import('$/sources/Compound/Rest/constants.ts')
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

	return mapCompoundCometSnapshot(
		$network,
		marketSlug,
		configuration,
		roots
	)
}

export default {
	source: Source.Compound_Rest,

	resolvers: [
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
			$$assets: (comet) => (
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
						const { compoundCometsByChainId } = await import('$/sources/Compound/Rest/constants.ts')
						return (compoundCometsByChainId[chainId] ?? []).map((deployment) => ({
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
				$$compoundComets: (comets) => comets,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Compound_Rest>
