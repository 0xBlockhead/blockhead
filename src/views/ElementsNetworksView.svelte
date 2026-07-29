<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['Elements/Liquid-specific view over a canonical Network row, including federation metadata, settlement network, native asset, and registry assets.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ElementsNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsNetwork}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				$network: true,
				federationName: true,
			},
		})
	}
>
	{#snippet Item({ item: elementsNetwork })}
		{@const elementsNetworkSelector = elementsNetwork[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsNetwork}
			entitySelector={elementsNetworkSelector}
		>
			{#snippet Title()}
				{elementsNetwork.$network.name || (elementsNetworkSelector.$network.caip2 == null ? '' : `${elementsNetworkSelector.$network.caip2.namespace}:${elementsNetworkSelector.$network.caip2.reference}`) || 'Network'}
			{/snippet}

			{#snippet Value()}
				{elementsNetwork.federationName ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
