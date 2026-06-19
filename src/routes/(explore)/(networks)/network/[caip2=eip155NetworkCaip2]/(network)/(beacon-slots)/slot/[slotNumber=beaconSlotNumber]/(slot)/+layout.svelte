<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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

	const slotEntitySelector = $derived(
		{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			slot: Number(params.slotNumber),
		} as const,
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-slots)/slot/[slotNumber=beaconSlotNumber]',
		params,
	)}
	id={stringify(slotEntitySelector)}
>
	{#snippet Summary({ open: _open })}
		<BeaconSlotView
			selection={select(EntityType.BeaconSlot, slotEntitySelector)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
