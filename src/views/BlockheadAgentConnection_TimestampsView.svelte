<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAgentConnection_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentConnection_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					health: true,
					latencyMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentConnectionTimestamp })}
		{@const blockheadAgentConnectionTimestampSelector = blockheadAgentConnectionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentConnection_Timestamp}
			entitySelector={blockheadAgentConnectionTimestampSelector}
			href={
				resolve(
					'/~/agent/connection/[connectionId=stringSegment]/(blockheadAgentConnection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						connectionId: blockheadAgentConnectionTimestampSelector.$connection.connectionId,
						timestampMs: String(blockheadAgentConnectionTimestampSelector.timestampMs),
						source: blockheadAgentConnectionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadAgentConnectionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentConnectionTimestamp.health ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentConnectionTimestamp.latencyMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
