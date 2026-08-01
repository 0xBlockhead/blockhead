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
		id = 'StarknetStorageEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StarknetStorageEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetStorageEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				storageKey: true,
				$contract: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetStorageEntry })}
		{@const starknetStorageEntrySelector = starknetStorageEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StarknetStorageEntry}
			entitySelector={starknetStorageEntrySelector}
		>
			{#snippet Title()}
				{starknetStorageEntrySelector.storageKey || 'starknet storage entry'}
			{/snippet}

			{#snippet Value()}
				{starknetStorageEntrySelector.$contract.address || 'starknet contract'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
