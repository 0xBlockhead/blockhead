<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'global AI model catalogs',
		open = $bindable(true),
		id = 'GlobalAiModelCatalogs-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAiModelCatalog> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAiModelCatalog}
	{id}
	{title}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: globalAiModelCatalog })}
		<EntityView
			entityType={EntityType._GlobalAiModelCatalog}
			entitySelector={globalAiModelCatalog[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				global AI model catalog
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
