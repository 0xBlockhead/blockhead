<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const epochEntityId = $derived(
		{
			$network: { chainId: evmChainIdFromCaip2RouteParams(params) },
			epoch: Number(params.epochNumber),
		},
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(beacon-epochs)/epoch/[epochNumber]',
		params,
	)}
	id={stringify(epochEntityId)}
>
	{#snippet Summary({ open: _open })}
		<BeaconEpochView
			entityId={epochEntityId}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
