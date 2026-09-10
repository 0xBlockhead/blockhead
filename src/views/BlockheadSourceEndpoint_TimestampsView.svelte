<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Endpoint observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSourceEndpoint_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSourceEndpoint_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				available: true,
				reachable: true,
				latencyMs: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSourceEndpointTimestamp })}
		{@const blockheadSourceEndpointTimestampSelector = blockheadSourceEndpointTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSourceEndpoint_Timestamp}
			entitySelector={blockheadSourceEndpointTimestampSelector}
		>
			{#snippet Title()}
				{blockheadSourceEndpointTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadSourceEndpointTimestamp.available), String(blockheadSourceEndpointTimestamp.reachable)].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSourceEndpointTimestamp.latencyMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
