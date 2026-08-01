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
		id = 'GlobalAiArtifactCatalogs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAiArtifactCatalog> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAiArtifactCatalog}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalAiArtifactCatalog })}
		<EntityView
			entityType={EntityType._GlobalAiArtifactCatalog}
			entitySelector={globalAiArtifactCatalog[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
