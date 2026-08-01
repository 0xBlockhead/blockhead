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
		id = 'IcpCanisterMetadataEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.IcpCanisterMetadata> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMetadata}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMetadata })}
		<EntityView
			entityType={EntityType.IcpCanisterMetadata}
			entitySelector={icpCanisterMetadata[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP canister metadata
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
