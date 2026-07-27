import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { Source } from '$/sources/Source.ts'
import type {
	CosmosChainRegistryAssetList,
	CosmosChainRegistryChain,
} from '$/sources/CosmosChainRegistry/Github/types.ts'
const assertCosmosRegistryNetwork = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'cosmos' || network.caip2.reference !== 'cosmoshub-4')
		throw new Error('CosmosChainRegistry_Github: unsupported network')
}

const chainNameForNetwork = (network: { caip2: {
	namespace: string
	reference: string
} } | { slug: string }) => {
	assertCosmosRegistryNetwork(network)
	return 'cosmoshub'
}

const iconMediaFromChain = (chain: CosmosChainRegistryChain) => {
	const url = chain.logo_URIs?.svg ?? chain.logo_URIs?.png ?? chain.images?.[0]?.svg ?? chain.images?.[0]?.png
	return url != null ? mediaFromUrl(url, MediaType.Image) : undefined
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
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string },
	assetList: CosmosChainRegistryAssetList
) => (
	assetList.assets
		.filter((asset) => asset.type_asset === 'sdk.coin')
		.map((asset) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				kind: AssetInstanceKind.Denom,
				assetKey: asset.base,
			},
			...assetInstanceFields(asset),
		}))
)

export default {
	source: Source.CosmosChainRegistry_Github,

	resolvers: [
		defineResolver(Source.CosmosChainRegistry_Github, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [{
						caip2: {
							namespace: 'cosmos',
							reference: 'cosmoshub-4',
						},
					}],
					resolve: async (entitySelector) => {
						if (
							entitySelector.caip2.namespace !== 'cosmos'
							|| entitySelector.caip2.reference !== 'cosmoshub-4'
						)
							return undefined

						const { getChain } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
						const chain = await getChain({
							chainName: chainNameForNetwork(entitySelector),
						})
						const iconMedia = iconMediaFromChain(chain)
						return {
							name: chain.pretty_name ?? chain.chain_name,
							environment: NetworkEnvironment.Mainnet,
							...(iconMedia != null && { $icon: iconMedia }),
						}
					},
				},
				Slug: {
					appliesTo: [{
						slug: 'cosmos',
					}],
					resolve: async (entitySelector) => {
						if (entitySelector.slug !== 'cosmos') return undefined

						const { getChain } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
						const chain = await getChain({
							chainName: chainNameForNetwork(entitySelector),
						})
						const iconMedia = iconMediaFromChain(chain)
						return {
							name: chain.pretty_name ?? chain.chain_name,
							environment: NetworkEnvironment.Mainnet,
							...(iconMedia != null && { $icon: iconMedia }),
						}
					},
				},
			},
		})({
				name: (snapshot) => snapshot.name,
				environment: (snapshot) => snapshot.environment,
				$icon: (snapshot) => snapshot.$icon,
			}),

		defineResolver(Source.CosmosChainRegistry_Github, {
			entityType: EntityType.AssetInstance,
			resolve: {
				NetworkKindAssetKey: {
					appliesTo: [
						{
							$network: {
								caip2: {
									namespace: 'cosmos',
									reference: 'cosmoshub-4',
								},
							},
							kind: AssetInstanceKind.Denom,
						},
						{
							$network: {
								slug: 'cosmos',
							},
							kind: AssetInstanceKind.Denom,
						},
					],
					resolve: async ({ $network, assetKey, kind }) => {
						assertCosmosRegistryNetwork($network)
						if (kind !== AssetInstanceKind.Denom) throw new Error('CosmosChainRegistry_Github: only denom asset instances are supported')
						const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
						const asset = (await getAssetList({
							chainName: chainNameForNetwork($network),
						})).assets.find((registryAsset) => registryAsset.base === assetKey)
						if (asset == null) throw new Error(`CosmosChainRegistry_Github: asset not found for ${assetKey}`)
						return assetInstanceFields(asset)
					},
				}
			},
		})({
				name: (snapshot) => snapshot.name,
				symbol: (snapshot) => snapshot.symbol,
				decimals: (snapshot) => snapshot.decimals,
			}),

		defineResolver(Source.CosmosChainRegistry_Github, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [{
						caip2: {
							namespace: 'cosmos',
							reference: 'cosmoshub-4',
						},
					}],
					resolve: async (entitySelector) => {
						assertCosmosRegistryNetwork(entitySelector)
						const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
						return assetInstanceRows(
							entitySelector,
							await getAssetList({
								chainName: chainNameForNetwork(entitySelector),
							})
						)
					},
				},
				Slug: {
					appliesTo: [{
						slug: 'cosmos',
					}],
					resolve: async (entitySelector) => {
						assertCosmosRegistryNetwork(entitySelector)
						const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
						return assetInstanceRows(
							entitySelector,
							await getAssetList({
								chainName: chainNameForNetwork(entitySelector),
							})
						)
					},
				},
			},
		})({
				$$nativeAssets: (snapshot) => snapshot,
			}),
	],
}
