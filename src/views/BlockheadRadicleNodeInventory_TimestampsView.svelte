<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Radicle node inventory observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadRadicleNodeInventory_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				status: true,
				timestampMs: true,
				repositoryCount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadRadicleNodeInventoryTimestamp })}
		{@const blockheadRadicleNodeInventoryTimestampSelector = blockheadRadicleNodeInventoryTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
			entitySelector={blockheadRadicleNodeInventoryTimestampSelector}
		>
			{#snippet Title()}
				{blockheadRadicleNodeInventoryTimestamp.status || 'blockhead radicle node inventory timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadRadicleNodeInventoryTimestampSelector.timestampMs)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadRadicleNodeInventoryTimestamp.repositoryCount ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
