<script lang="ts">
	// Types/constants
	import {
		ethereumMainnetNetworkUpgradeSlugAliasBySegmentSlug,
		networkUpgrades,
	} from '$/constants/EthereumNetworkUpgrades.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'

	const chainId = $derived(evmChainIdFromCaip2(`${params.caip2Namespace}:${params.caip2Reference}`))

	const resolvedUpgradeId = $derived(
		(() => {
			const segment = params.upgradeSlug
			const direct = networkUpgrades.find((networkUpgrade) => {
				const id = networkUpgrade[EntityMetaKey.Selector]
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
			})?.[EntityMetaKey.Selector].upgradeId

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
							evmChainIdFromCaip2(`${networkUpgrade[EntityMetaKey.Selector].$network.caip2.namespace}:${networkUpgrade[EntityMetaKey.Selector].$network.caip2.reference}`) === chainId
							&& networkUpgrade[EntityMetaKey.Selector].upgradeId === aliasRow.umbrellaUpgradeId
						))
						?.[EntityMetaKey.Selector].upgradeId
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
			'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(upgrades)/upgrade/[upgradeSlug]',
		{
			caip2Namespace: params.caip2Namespace,
			caip2Reference: params.caip2Reference,
			upgradeSlug: params.upgradeSlug,
		},
	)}
	id={stringify({
		$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
		upgradeId: resolvedUpgradeId,
	})}
>
	{#snippet Summary({ open: _open })}
		<NetworkUpgradeView
			selector={{
				$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
				upgradeId: resolvedUpgradeId,
			}}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
