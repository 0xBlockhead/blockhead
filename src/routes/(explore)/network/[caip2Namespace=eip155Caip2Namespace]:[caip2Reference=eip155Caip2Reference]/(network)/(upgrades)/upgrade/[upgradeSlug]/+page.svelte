<script lang="ts">
	// Types/constants
	import {
		evmChainIdFromCaip2RouteParams,
		evmChainIdFromNetworkId,
		networkIdFromCaip2RouteParams,
	} from '$/lib/caip.ts'


	// Types/constants
	import {
		ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
		networkUpgrades,
	} from '$/constants/EthereumNetworkUpgrades.ts'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// State
	const chainId = $derived(evmChainIdFromCaip2RouteParams(params))

	const resolvedUpgradeId = $derived(
		(() => {
			const segment = params.upgradeSlug
			const direct = networkUpgrades.find((networkUpgrade) => {
				const id = networkUpgrade[EntityMetaKey.Id]
				if (evmChainIdFromNetworkId(id.$network) !== chainId) return false
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
							evmChainIdFromNetworkId(networkUpgrade[EntityMetaKey.Id].$network) === chainId
							&& networkUpgrade[EntityMetaKey.Id].upgradeId === aliasRow.umbrellaUpgradeId
						))
						?.[EntityMetaKey.Id].upgradeId
					)
				}
			}

			return undefined
		})() ?? params.upgradeSlug,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'
</script>


<Page>
	<NetworkUpgradeView
		entityId={{
			$network: networkIdFromCaip2RouteParams(params),
			upgradeId: resolvedUpgradeId,
		}}
	/>
</Page>
