<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A point-in-time runtime and subsystem observation for a Bittensor network.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BittensorNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNetwork_Timestamp}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				timestampMs: true,
				finalizedBlockNumber: true,
				runtimeSpecName: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorNetworkTimestamp })}
		{@const bittensorNetworkTimestampSelector = bittensorNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BittensorNetwork_Timestamp}
			entitySelector={bittensorNetworkTimestampSelector}
		>
			{#snippet Title()}
				{String(bittensorNetworkTimestampSelector.timestampMs) || 'Bittensor network observation'}
			{/snippet}

			{#snippet Value()}
				{String(bittensorNetworkTimestamp.finalizedBlockNumber ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(bittensorNetworkTimestamp.runtimeSpecName ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
