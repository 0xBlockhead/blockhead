<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import {
		ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
		networkUpgrades,
	} from '$/constants/EthereumNetworkUpgrades.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'

	// State
	let {
		params,
	} = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'

	const chainId = $derived(evmChainIdFromCaip2(params.caip2))


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<Page>
	<NetworkUpgradeView
		selection={select(EntityType.EthereumNetworkUpgrade, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			upgradeId: ((() => {
				const segment = params.upgradeSlug
				const direct = networkUpgrades.find((networkUpgrade) => {
					if (networkUpgrade.chainId !== chainId) return false
					const slug = (
						networkUpgrade.slug.length > 0 ?
							networkUpgrade.slug
						:
							String(networkUpgrade.upgradeId).trim().toLowerCase().replace(/\s+/g, '-')
					)
					const { upgradeId } = networkUpgrade
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
				})?.upgradeId

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
								networkUpgrade.chainId === chainId
								&& networkUpgrade.upgradeId === aliasRow.umbrellaUpgradeId
							))
							?.upgradeId
						)
					}
				}

				return undefined
			})() ?? params.upgradeSlug)
		})}
	/>
</Page>
