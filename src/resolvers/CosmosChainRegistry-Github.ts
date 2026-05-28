import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { Source } from '$/sources/$Source.ts'
import type { CosmosChainRegistryAssetList } from '$/sources/CosmosChainRegistry/Github/types.ts'

const assertCosmosRegistryNetwork = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'cosmos' || network.caip2.reference !== 'cosmoshub-4') {
		throw new Error('CosmosChainRegistry_Github: unsupported network')
	}
}

const chainNameForNetwork = (network: { caip2: { namespace: string; reference: string } } | { networkSlug: string }) => {
	assertCosmosRegistryNetwork(network)
	return 'cosmoshub'
}

const assetInstanceFields = (asset: CosmosChainRegistryAssetList['assets'][number]) => ({
	name: asset.name,
	symbol: asset.symbol,
	...((displayDenomUnit) => (
		displayDenomUnit?.exponent != null && {
			decimals: displayDenomUnit.exponent,
		}
	))((asset.denom_units ?? []).find((denomUnit) => denomUnit.denom === asset.display)),
})

const assetInstanceRows = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
	assetList: CosmosChainRegistryAssetList,
) => (
	assetList.assets
		.filter((asset) => asset.type_asset === 'sdk.coin')
		.map((asset) => ({
			[EntityMetaKey.Id]: {
				$network: network,
				kind: AssetInstanceKind.Denom,
				assetKey: asset.base,
			},
			...assetInstanceFields(asset),
		}))
)

export default {
	source: Source.CosmosChainRegistry_Github,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				assertCosmosRegistryNetwork(entityId)
				const { getChain } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
				const chain = await getChain({
					chainName: chainNameForNetwork(entityId),
				})
				return {
					name: chain.pretty_name ?? chain.chain_name,
					environment: NetworkEnvironment.Mainnet,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AssetInstance,
			resolve: async (entityId) => {
				assertCosmosRegistryNetwork(entityId.$network)
				if (entityId.kind !== AssetInstanceKind.Denom) throw new Error('CosmosChainRegistry_Github: only denom asset instances are supported')
				const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
				const asset = (await getAssetList({
					chainName: chainNameForNetwork(entityId.$network),
				})).assets.find((registryAsset) => registryAsset.base === entityId.assetKey)
				if (asset == null) throw new Error(`CosmosChainRegistry_Github: asset not found for ${entityId.assetKey}`)
				return assetInstanceFields(asset)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$nativeAssets',
			resolve: async (entityId) => {
				assertCosmosRegistryNetwork(entityId)
				const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
				return assetInstanceRows(
					entityId,
					await getAssetList({
						chainName: chainNameForNetwork(entityId),
					}),
				)
			},
		}),
	],
}
