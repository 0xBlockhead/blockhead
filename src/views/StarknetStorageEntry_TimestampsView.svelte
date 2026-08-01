<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.StarknetStorageEntry_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetStorageEntry_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$entry: true,
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetStorageEntryTimestamp })}
		{@const starknetStorageEntryTimestampSelector = starknetStorageEntryTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetStorageEntry_Timestamp}
			entitySelector={starknetStorageEntryTimestampSelector}
		>
			{#snippet Title()}
				{starknetStorageEntryTimestampSelector.$entry.storageKey || 'starknet storage entry'}
			{/snippet}

			{#snippet Value()}
				{starknetStorageEntryTimestampSelector.blockNumber}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetStorageEntryTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
