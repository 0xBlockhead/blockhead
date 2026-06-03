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

	const epochEntityId = $derived(
		{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
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
		'/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(beacon-epochs)/epoch/[epochNumber]',
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
