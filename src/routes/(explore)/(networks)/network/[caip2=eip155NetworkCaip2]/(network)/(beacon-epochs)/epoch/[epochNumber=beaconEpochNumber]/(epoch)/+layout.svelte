<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()

	const epochEntitySelector = $derived(
		{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			epoch: Number(params.epochNumber),
		} as const,
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber=beaconEpochNumber]',
		params,
	)}
	id={stringify(epochEntitySelector)}
>
	{#snippet Summary({ open: _open })}
		<BeaconEpochView
			selector={epochEntitySelector}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
