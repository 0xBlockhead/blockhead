<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'


	// State
	let {
		children,
		params,
	} = $props()

	const epochEntityId = $derived(
		{
			$network: { chainId: Number(params.networkId) },
			epoch: Number(params.epochNumber),
		},
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<ParentPageCollapsible
	href={resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
		params,
	)}
	id={stringify(epochEntityId)}
>
	{#snippet Summary({ open: _open })}
		<BeaconEpochView
			entityId={epochEntityId}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(beacon-epochs)/epoch/[epochNumber]',
				params,
			)}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
