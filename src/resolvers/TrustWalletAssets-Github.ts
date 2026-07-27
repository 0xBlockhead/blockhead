import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'

const trustWalletChainsByNetworkSlug = [
	[
		'bitcoin',
		'bitcoin',
	],
	[
		'bitcoin-cash',
		'bitcoincash',
	],
	[
		'cosmos',
		'cosmos',
	],
	[
		'dogecoin',
		'dogecoin',
	],
	[
		'litecoin',
		'litecoin',
	],
	[
		'solana',
		'solana',
	],
	[
		'tron',
		'tron',
	],
	[
		'zcash',
		'zcash',
	],
] as const

const trustWalletChainsByEip155Reference = [
	[
		'1',
		'ethereum',
	],
	[
		'10',
		'optimism',
	],
	[
		'56',
		'smartchain',
	],
	[
		'100',
		'xdai',
	],
	[
		'137',
		'polygon',
	],
	[
		'250',
		'fantom',
	],
	[
		'8453',
		'base',
	],
	[
		'42161',
		'arbitrum',
	],
	[
		'43114',
		'avalanchec',
	],
	[
		'42220',
		'celo',
	],
] as const

const eip155Namespace = 'eip155'
const solanaNamespace = 'solana'

const trustWalletChainByNetworkSlug = new Map(trustWalletChainsByNetworkSlug)
const trustWalletChainByEip155Reference = new Map(trustWalletChainsByEip155Reference)

const trustWalletChain = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string }
) => (
	'slug' in network ?
		trustWalletChainByNetworkSlug.get(network.slug)
	:
		network.caip2.namespace === eip155Namespace ?
			trustWalletChainByEip155Reference.get(network.caip2.reference)
		:
			network.caip2.namespace === solanaNamespace ?
				'solana'
			:
				undefined
)

export default {
	source: Source.TrustWalletAssets_Github,

	resolvers: [
		defineResolver(Source.TrustWalletAssets_Github, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: [
						...trustWalletChainsByEip155Reference.map(([reference]) => ({
							caip2: {
								namespace: eip155Namespace,
								reference,
							},
						})),
						{
							caip2: {
								namespace: solanaNamespace,
							},
						},
					],
					resolve: async (entitySelector) => {
						const chain = trustWalletChain(entitySelector)
						if (chain == null) throw new Error('TrustWalletAssets_Github: network not mapped')
						const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
						const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
						if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid logo URL for ${chain}`)
						return iconMedia
					},
				},
				Slug: {
					appliesTo: trustWalletChainsByNetworkSlug.map(([slug]) => ({
						slug,
					})),
					resolve: async (entitySelector) => {
						const chain = trustWalletChain(entitySelector)
						if (chain == null) throw new Error('TrustWalletAssets_Github: network not mapped')
						const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
						const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
						if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid logo URL for ${chain}`)
						return iconMedia
					},
				},
			},
		})({
				$icon: (snapshot) => snapshot,
			}),

		defineResolver(Source.TrustWalletAssets_Github, {
			entityType: EntityType.AssetInstance,
			resolve: {
				NetworkKindAssetKey: {
					appliesTo: [
						...trustWalletChainsByNetworkSlug.map(([slug]) => ({
							$network: {
								slug,
							},
							kind: AssetInstanceKind.Native,
						})),
						...trustWalletChainsByEip155Reference.map(([reference]) => ({
							$network: {
								caip2: {
									namespace: eip155Namespace,
									reference,
								},
							},
							kind: AssetInstanceKind.Native,
						})),
						{
							$network: {
								caip2: {
									namespace: solanaNamespace,
								},
							},
							kind: AssetInstanceKind.Native,
						},
					],
					resolve: async ({ $network, kind }) => {
						if (kind !== AssetInstanceKind.Native) throw new Error('TrustWalletAssets_Github: only native assets are mapped')
						const chain = trustWalletChain($network)
						if (chain == null) throw new Error('TrustWalletAssets_Github: asset network not mapped')
						const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
						const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
						if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid native asset logo URL for ${chain}`)
						return iconMedia
					},
				}
			},
		})({
				$icon: (snapshot) => snapshot,
			}),
	],
}
