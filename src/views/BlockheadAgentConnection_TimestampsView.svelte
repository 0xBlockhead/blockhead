<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			fields: {
				timestampMs: true,
				health: true,
				latencyMs: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentConnectionTimestamp })}
		{@const blockheadAgentConnectionTimestampSelector = blockheadAgentConnectionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentConnection_Timestamp}
			entitySelector={blockheadAgentConnectionTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadAgentConnectionTimestampSelector.timestampMs) || 'blockhead agent connection timestamp'}
			{/snippet}

			{#snippet Value()}
				{(blockheadAgentConnectionTimestamp.health ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadAgentConnectionTimestamp.latencyMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
