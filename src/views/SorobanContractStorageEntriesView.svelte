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
		id = 'SorobanContractStorageEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SorobanContractStorageEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SorobanContractStorageEntry}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: sorobanContractStorageEntry })}
		<EntityView
			entityType={EntityType.SorobanContractStorageEntry}
			entitySelector={sorobanContractStorageEntry[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
