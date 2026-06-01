<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const blockEntityId = $derived(
		{
			$network: networkIdFromCaip2RouteParams(params),
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
		'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(blocks)/block/[blockNumber]',
		params,
	)}
	id={stringify(blockEntityId)}
>
	{#snippet Summary({ open: _open })}
		<EvmBlockView
			entityId={blockEntityId}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
