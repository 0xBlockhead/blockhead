import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { NetworkEnvironment } from '$/constants/Network.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'
import { Source } from '$/sources/Source.ts'
import type {
	CosmosChainRegistryAssetList,
	CosmosChainRegistryChain,
} from '$/sources/CosmosChainRegistry/Github/types.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

type CosmosRegistryNetworkRow = {
	chainName: string
	chainId: string
	slug: string
	environment: NetworkEnvironment
}

const cosmosRegistryNetworks = [
	{
		chainName: 'cosmoshub',
		chainId: 'cosmoshub-4',
		slug: 'cosmos',
		environment: NetworkEnvironment.Mainnet,
	},
	{
		chainName: 'osmosis',
		chainId: 'osmosis-1',
		slug: 'osmosis',
		environment: NetworkEnvironment.Mainnet,
	},
	{
		chainName: 'dydx',
		chainId: 'dydx-mainnet-1',
		slug: 'dydx',
		environment: NetworkEnvironment.Mainnet,
	},
] as const satisfies readonly CosmosRegistryNetworkRow[]

const cosmosRegistryNetworkByChainId = Object.fromEntries(
	cosmosRegistryNetworks.map((row) => [row.chainId, row])
)

const cosmosRegistryNetworkBySlug = Object.fromEntries(
	cosmosRegistryNetworks.map((row) => [row.slug, row])
)

const cosmosNetworkRow = (network: NetworkId) => {
	const row = (
		'caip2' in network ?
			network.caip2.namespace === 'cosmos' ?
				cosmosRegistryNetworkByChainId[network.caip2.reference]
			:
				undefined
		:
			cosmosRegistryNetworkBySlug[network.slug]
	)
	if (row == null)
		throw new Error('CosmosChainRegistry_Github: unsupported network')

	return row
}

const cosmosNetworkApplicability = {
	Caip2: cosmosRegistryNetworks.map((row) => ({
		caip2: {
			namespace: 'cosmos' as const,
			reference: row.chainId,
		},
	})),
	Slug: cosmosRegistryNetworks.map((row) => ({
		slug: row.slug,
	})),
} as const

const cosmosNetworkSelectors = <_Snapshot extends object>(
	resolve: (network: NetworkId) => Promise<_Snapshot>
) => ({
	Caip2: {
		appliesTo: cosmosNetworkApplicability.Caip2,
		resolve,
	},
	Slug: {
		appliesTo: cosmosNetworkApplicability.Slug,
		resolve,
	},
})

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
	network: NetworkId,
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
		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkSelectors(async (entitySelector) => {
				const row = cosmosNetworkRow(entitySelector)
				const { getChain } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
				const chain = await getChain({
					chainName: row.chainName,
				})
				if (chain.chain_id !== row.chainId)
					throw new Error(`CosmosChainRegistry_Github: mismatched chain_id ${chain.chain_id}`)
				const iconMedia = iconMediaFromChain(chain)
				return {
					name: chain.pretty_name ?? chain.chain_name,
					environment: row.environment,
					...(iconMedia != null && { $icon: iconMedia }),
				}
			}),
		})({
			name: (snapshot) => snapshot.name,
			environment: (snapshot) => snapshot.environment,
			$icon: (snapshot) => snapshot.$icon,
		}),

		defineResolver({
			entityType: EntityType.AssetInstance,
			resolve: {
				NetworkKindAssetKey: {
					appliesTo: [
						...cosmosRegistryNetworks.map((row) => ({
							$network: {
								caip2: {
									namespace: 'cosmos' as const,
									reference: row.chainId,
								},
							},
							kind: AssetInstanceKind.Denom,
						})),
						...cosmosRegistryNetworks.map((row) => ({
							$network: {
								slug: row.slug,
							},
							kind: AssetInstanceKind.Denom,
						})),
					],
					resolve: async ({ $network, assetKey, kind }) => {
						const row = cosmosNetworkRow($network)
						if (kind !== AssetInstanceKind.Denom) throw new Error('CosmosChainRegistry_Github: only denom asset instances are supported')
						const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
						const asset = (await getAssetList({
							chainName: row.chainName,
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: cosmosNetworkSelectors(async (entitySelector) => {
				const row = cosmosNetworkRow(entitySelector)
				const { getAssetList } = await import('$/sources/CosmosChainRegistry/Github/queries.ts')
				return assetInstanceRows(
					entitySelector,
					await getAssetList({
						chainName: row.chainName,
					})
				)
			}),
		})({
			$$nativeAssets: (snapshot) => snapshot,
		}),
	],
} satisfies RegisteredSourceResolverModule
