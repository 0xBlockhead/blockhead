<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { networkForkIdFromChainIdAndUrlSegment } from '$/constants/EthereumExecutionForks.ts'
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'


	// State
	let {
		children,
		params,
	} = $props()

	const resolvedForkId = $derived(
		networkForkIdFromChainIdAndUrlSegment(
			Number(params.networkId),
			params.forkSlug,
		) ?? params.forkSlug,
	)

	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(explore)/(forks)/fork/[networkId]/[forkSlug]', params)}
	id={stringify({
		$network: {
			chainId: Number(params.networkId),
		},
		forkId: resolvedForkId,
	})}
>
	{#snippet Summary({ open: _open })}
		<NetworkForkView
			entityId={{
				$network: { chainId: Number(params.networkId) },
				forkId: resolvedForkId,
			}}
			href={resolve('/(explore)/(forks)/fork/[networkId]/[forkSlug]', params)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
