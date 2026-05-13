<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { networkUpgradeIdFromChainIdAndUrlSegment } from '$/constants/EthereumUpgrades.ts'
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'


	// State
	let {
		children,
		params,
	} = $props()

	const resolvedUpgradeId = $derived(
		networkUpgradeIdFromChainIdAndUrlSegment(
			Number(params.networkId),
			params.upgradeSlug,
		) ?? params.upgradeSlug,
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkUpgradeView from '$/views/NetworkUpgradeView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
		{ networkId: params.networkId, upgradeSlug: params.upgradeSlug },
	)}
	id={stringify({
		$network: {
			chainId: Number(params.networkId),
		},
		upgradeId: resolvedUpgradeId,
	})}
>
	{#snippet Summary({ open: _open })}
		<NetworkUpgradeView
			entityId={{
				$network: { chainId: Number(params.networkId) },
				upgradeId: resolvedUpgradeId,
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
				{ networkId: params.networkId, upgradeSlug: params.upgradeSlug },
			)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
