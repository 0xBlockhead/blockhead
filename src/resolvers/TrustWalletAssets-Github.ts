import { mediaFromUrl } from '$/lib/media.ts'
import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityIdProjection } from '$/schema/$schema.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'

const trustWalletChainByNetworkSlug = new Map([
	['bitcoin', 'bitcoin'],
	['bitcoin-cash', 'bitcoincash'],
	['cosmos', 'cosmos'],
	['dogecoin', 'dogecoin'],
	['litecoin', 'litecoin'],
	['solana', 'solana'],
	['tron', 'tron'],
	['zcash', 'zcash'],
])

const trustWalletChainByEip155Reference = new Map([
	['1', 'ethereum'],
	['10', 'optimism'],
	['56', 'smartchain'],
	['100', 'xdai'],
	['137', 'polygon'],
	['250', 'fantom'],
	['8453', 'base'],
	['42161', 'arbitrum'],
	['43114', 'avalanchec'],
	['42220', 'celo'],
])

const trustWalletChain = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
) => (
	'networkSlug' in network ?
		trustWalletChainByNetworkSlug.get(network.networkSlug)
	: network.caip2.namespace === 'eip155' ?
		trustWalletChainByEip155Reference.get(network.caip2.reference)
	: network.caip2.namespace === 'solana' ?
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const chain = trustWalletChain(entityId)
				if (chain == null) throw new Error('TrustWalletAssets_Github: network not mapped')
				const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
				const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
				if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid logo URL for ${chain}`)
				return iconMedia
			}
			}
		})({
				fields: {
			$icon: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.TrustWalletAssets_Github, {
			entityType: EntityType.AssetInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (entityId.kind !== AssetInstanceKind.Native) throw new Error('TrustWalletAssets_Github: only native assets are mapped')
				const chain = trustWalletChain(entityId.$network)
				if (chain == null) throw new Error('TrustWalletAssets_Github: asset network not mapped')
				const { getChainLogoUrl } = await import('$/sources/TrustWalletAssets/Github/queries.ts')
				const iconMedia = mediaFromUrl(getChainLogoUrl(chain), MediaType.Image)
				if (iconMedia == null) throw new Error(`TrustWalletAssets_Github: invalid native asset logo URL for ${chain}`)
				return iconMedia
			}
			}
		})({
				fields: {
			$icon: (snapshot) => snapshot,
		},
			}),
	],
}
