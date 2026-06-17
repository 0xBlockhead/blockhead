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

	const epochEntitySelector = $derived(
		{
			$network: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
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
		'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber]',
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
