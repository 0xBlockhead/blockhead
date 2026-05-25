<script lang="ts">
	// Types/constants
	import {
		ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
		networkUpgrades,
	} from '$/constants/NetworkUpgrades.ts'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		params,
	} = $props()


	// State
	const chainId = $derived(Number(params.networkId))

	const resolvedUpgradeId = $derived(
		(() => {
			const segment = params.upgradeSlug
			const direct = networkUpgrades.find((networkUpgrade) => {
				const id = networkUpgrade[EntityMetaKey.Id]
				if (id.$network.chainId !== chainId) return false
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
							networkUpgrade[EntityMetaKey.Id].$network.chainId === chainId
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
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
		{ networkId: params.networkId, upgradeSlug: params.upgradeSlug },
	)}
	id={stringify({
		$network: {
			chainId,
		},
		upgradeId: resolvedUpgradeId,
	})}
>
	{#snippet Summary({ open: _open })}
		<NetworkUpgradeView
			entityId={{
				$network: { chainId },
				upgradeId: resolvedUpgradeId,
			}}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
