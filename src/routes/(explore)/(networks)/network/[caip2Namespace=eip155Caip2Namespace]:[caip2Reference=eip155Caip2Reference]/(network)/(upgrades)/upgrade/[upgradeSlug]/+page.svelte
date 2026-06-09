<script lang="ts">
	// Types/constants
	import {
		ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
		networkUpgrades,
	} from '$/constants/EthereumNetworkUpgrades.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'

	// State
	let {
		params,
	} = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'

	const chainId = $derived(evmChainIdFromCaip2(`${params.caip2Namespace}:${params.caip2Reference}`))


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<Page>
	<NetworkUpgradeView
		entityId={{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			upgradeId: ((() => {
				const segment = params.upgradeSlug
				const direct = networkUpgrades.find((networkUpgrade) => {
					const id = networkUpgrade[EntityMetaKey.Id]
					if (evmChainIdFromCaip2(`${id.$network.caip2.namespace}:${id.$network.caip2.reference}`) !== chainId) return false
					const slugRaw = networkUpgrade.slug
					const slug = (
						typeof slugRaw === 'string' && slugRaw.length > 0 ?
							slugRaw
						:
							String(id.upgradeId).trim().toLowerCase().replace(/\s+/g, '-')
					)
					const { upgradeId } = id
					const segmentSlug = String(segment).trim().toLowerCase().replace(/\s+/g, '-')
					const slugSegment = String(slug).trim().toLowerCase().replace(/\s+/g, '-')
					const upgradeIdSegment = String(upgradeId).trim().toLowerCase().replace(/\s+/g, '-')
					return (
						segment === upgradeId
						|| segment === slug
						|| segment.toLowerCase() === upgradeId.toLowerCase()
						|| segment.toLowerCase() === slug.toLowerCase()
						|| segmentSlug === slugSegment
						|| segmentSlug === upgradeIdSegment
					)
				})?.[EntityMetaKey.Id].upgradeId

				if (direct != null) {
					return direct
				}

				if (
					chainId === 1
					|| chainId === 11_155_111
					|| chainId === 17_000
				) {
					const aliasRow = ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug[
						String(segment).trim().toLowerCase().replace(/\s+/g, '-')
					]
					if (aliasRow != null) {
						return (
							networkUpgrades.find((networkUpgrade) => (
								evmChainIdFromCaip2(`${networkUpgrade[EntityMetaKey.Id].$network.caip2.namespace}:${networkUpgrade[EntityMetaKey.Id].$network.caip2.reference}`) === chainId
								&& networkUpgrade[EntityMetaKey.Id].upgradeId === aliasRow.umbrellaUpgradeId
							))
							?.[EntityMetaKey.Id].upgradeId
						)
					}
				}

				return undefined
			})() ?? params.upgradeSlug)
		}}
	/>
</Page>
