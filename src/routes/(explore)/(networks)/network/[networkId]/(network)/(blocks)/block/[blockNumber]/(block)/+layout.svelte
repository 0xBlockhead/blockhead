<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'


	// Props
	let {
		children,
		params,
	} = $props()

	const blockEntityId = $derived(
		{
			$network: { chainId: Number(params.networkId) },
			blockNumber: BigInt(params.blockNumber),
		},
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
		params,
	)}
	id={stringify(blockEntityId)}
>
	{#snippet Summary({ open: _open })}
		<EvmBlockView
			entityId={blockEntityId}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
				params,
			)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
