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

	const slotEntityId = $derived(
		{
			$network: { chainId: Number(params.networkId) },
			slot: Number(params.slotNumber),
		},
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
		params,
	)}
	id={stringify(slotEntityId)}
>
	{#snippet Summary({ open: _open })}
		<BeaconSlotView
			entityId={slotEntityId}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
