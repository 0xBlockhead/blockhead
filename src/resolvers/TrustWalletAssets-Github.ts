import { mediaFromUrl } from '$/resolvers/media.ts'
import type { ResolverSelectorPattern } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import type {
	EntitySelector,
	EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { AssetInstanceKind } from '$/schema/AssetInstanceKind.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type NetworkCaip2Pattern = ResolverSelectorPattern<
	EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>
>
type NetworkSlugPattern = ResolverSelectorPattern<
	EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Slug'>
>
type NativeAssetSelectorPattern = ResolverSelectorPattern<
	EntitySelectorForSelectorName<typeof schema, EntityType.AssetInstance, 'NetworkKindAssetKey'>
>

const trustWalletChains = {
	Caip2: [
		['arbitrum', 'eip155', '42161'],
		['avalanchec', 'eip155', '43114'],
		['base', 'eip155', '8453'],
		['celo', 'eip155', '42220'],
		['ethereum', 'eip155', '1'],
		['fantom', 'eip155', '250'],
		['optimism', 'eip155', '10'],
		['polygon', 'eip155', '137'],
		['smartchain', 'eip155', '56'],
		['solana', 'solana'],
		['xdai', 'eip155', '100'],
	],
	Slug: [
		['bitcoin', 'bitcoin'],
		['bitcoincash', 'bitcoin-cash'],
		['cosmos', 'cosmos'],
		['dogecoin', 'dogecoin'],
		['litecoin', 'litecoin'],
		['solana', 'solana'],
		['tron', 'tron'],
		['zcash', 'zcash'],
	],
} as const satisfies {
	Caip2: readonly [
		readonly [chain: string, namespace: string, reference?: string],
		...readonly [chain: string, namespace: string, reference?: string][],
	]
	Slug: readonly [
		readonly [chain: string, slug: string],
		...readonly [chain: string, slug: string][],
	]
}

const trustWalletNetworkSelectors = {
	Caip2: trustWalletChains.Caip2.map(([, namespace, reference]): NetworkCaip2Pattern => ({
		caip2: {
			namespace,
			...(reference != null && { reference }),
		},
	})),
	Slug: trustWalletChains.Slug.map(([, slug]): NetworkSlugPattern => ({ slug })),
}
const trustWalletNativeAssetSelectors: readonly [
	NativeAssetSelectorPattern,
	...NativeAssetSelectorPattern[],
] = [
	{
		$network: trustWalletNetworkSelectors.Slug[0],
		kind: AssetInstanceKind.Native,
	},
	...trustWalletNetworkSelectors.Slug.slice(1).map((selector) => ({
		$network: selector,
		kind: AssetInstanceKind.Native,
	})),
	...trustWalletNetworkSelectors.Caip2.map((selector) => ({
		$network: selector,
		kind: AssetInstanceKind.Native,
	})),
]

const trustWalletChain = (network: NetworkId) => (
	'slug' in network ?
		trustWalletChains.Slug.find(([, slug]) => slug === network.slug)?.[0]
	:
		trustWalletChains.Caip2.find(([, namespace, reference]) => (
			namespace === network.caip2.namespace
			&& (reference == null || reference === network.caip2.reference)
		))?.[0]
)

const resolveNetworkIcon = async (entitySelector: NetworkId) => {
	const chain = trustWalletChain(entitySelector)
	if (chain == null) throw new Error('TrustWalletAssets_Github: network not mapped')
	const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
	const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
	if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid logo URL for ${chain}`)
	return iconMedia
}
const projectIcon = (snapshot: Awaited<ReturnType<typeof resolveNetworkIcon>>) => snapshot

export default {
	source: Source.TrustWalletAssets_Github,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: trustWalletNetworkSelectors.Caip2,
					resolve: resolveNetworkIcon,
				},
				Slug: {
					appliesTo: trustWalletNetworkSelectors.Slug,
					resolve: resolveNetworkIcon,
				},
			},
		})({
			$icon: projectIcon,
		}),

		defineResolver({
			entityType: EntityType.AssetInstance,
			resolve: {
				NetworkKindAssetKey: {
					appliesTo: trustWalletNativeAssetSelectors,
					resolve: async ({ $network, kind }) => {
						if (kind !== AssetInstanceKind.Native) throw new Error('TrustWalletAssets_Github: only native assets are mapped')
						const chain = trustWalletChain($network)
						if (chain == null) throw new Error('TrustWalletAssets_Github: asset network not mapped')
						const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
						const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
						if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid native asset logo URL for ${chain}`)
						return iconMedia
					},
				},
			},
		})({
			$icon: projectIcon,
		}),
	],
} satisfies RegisteredSourceResolverModule
