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
	CompoundCometRoots,
} from '$/sources/Compound/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type CompoundCometId = EntitySelector<typeof schema, EntityType.CompoundComet>

const eip155ChainId = (network: NetworkId) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error(`${Source.Compound_Rest}: network must use the eip155 CAIP-2 namespace`)

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error(`${Source.Compound_Rest}: invalid eip155 chain id ${network.caip2.reference}`)

	return chainId
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
})

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
					}: CompoundCometId) => {
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
						return mapCompoundCometSnapshot(
							$network,
							deployment.marketSlug,
							configuration,
							roots
						)
					},
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
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Compound_Rest>
