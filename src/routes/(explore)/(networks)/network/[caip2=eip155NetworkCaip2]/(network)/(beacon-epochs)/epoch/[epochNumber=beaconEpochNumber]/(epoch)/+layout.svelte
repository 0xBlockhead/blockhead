<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
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


	// Functions
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<ParentPageCollapsible
	href={
		resolve(
			'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber=beaconEpochNumber]',
			params
		)
	}
	id={stringify(epochEntitySelector)}
>
	{#snippet Summary({ open: _open })}
		<BeaconEpochView
			selection={
				select(
					EntityType.BeaconEpoch,
					epochEntitySelector
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
