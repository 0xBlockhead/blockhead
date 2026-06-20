<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import {
		ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
		networkUpgrades,
	} from '$/constants/EthereumNetworkUpgrades.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'

	const chainId = $derived(evmChainIdFromCaip2(params.caip2))

	const resolvedUpgradeId = $derived(
		(() => {
			const segment = params.upgradeSlug
			const direct = networkUpgrades.find((networkUpgrade) => {
				if (networkUpgrade.chainId !== chainId) return false
				const slug = (
					networkUpgrade.slug.length > 0 ?
						networkUpgrade.slug
					:
						String(networkUpgrade.upgradeId).toLowerCase().replace(/\s+/g, '-')
				)
				const { upgradeId } = networkUpgrade
				const segmentSlug = String(segment).toLowerCase().replace(/\s+/g, '-')
				const slugSegment = String(slug).toLowerCase().replace(/\s+/g, '-')
				const upgradeIdSegment = String(upgradeId).toLowerCase().replace(/\s+/g, '-')
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
					String(segment).toLowerCase().replace(/\s+/g, '-')
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
		})() ?? params.upgradeSlug,
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkUpgradeView from '$/views/EthereumNetworkUpgradeView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
			'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]',
		{
			caip2: params.caip2,
			upgradeSlug: params.upgradeSlug,
		},
	)}
	id={stringify({
		$network: eip155NetworkSelectorFromCaip2(params.caip2),
		upgradeId: resolvedUpgradeId,
	})}
>
	{#snippet Summary({ open: _open })}
		<NetworkUpgradeView
			selection={select(EntityType.EthereumNetworkUpgrade, {
				$network: eip155NetworkSelectorFromCaip2(params.caip2),
				upgradeId: resolvedUpgradeId,
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
