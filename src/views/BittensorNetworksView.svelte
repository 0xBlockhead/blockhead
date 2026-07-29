<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['Bittensor network-specific view over a canonical Network row, with runtime observations, finalized blocks, and subnets from declared Bittensor JSON-RPC sources.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BittensorNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNetwork}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorNetwork })}
		{@const bittensorNetworkSelector = bittensorNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BittensorNetwork}
			entitySelector={bittensorNetworkSelector}
		>
			{#snippet Title()}
				{bittensorNetwork.$network.name || (bittensorNetworkSelector.$network.caip2 == null ? '' : `${bittensorNetworkSelector.$network.caip2.namespace}:${bittensorNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
