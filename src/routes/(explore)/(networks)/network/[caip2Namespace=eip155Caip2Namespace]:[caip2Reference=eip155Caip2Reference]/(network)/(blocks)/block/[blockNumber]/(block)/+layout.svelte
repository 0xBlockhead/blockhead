<script lang="ts">
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const blockEntitySelector = $derived(
		{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			blockNumber: BigInt(params.blockNumber),
		},
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blocks)/block/[blockNumber]',
		params,
	)}
	id={stringify(blockEntitySelector)}
>
	{#snippet Summary({ open: _open })}
		<EvmBlockView
			selector={blockEntitySelector}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
