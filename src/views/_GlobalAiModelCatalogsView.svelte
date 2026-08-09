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
		{@const globalAiModelCatalogSelector = globalAiModelCatalog[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalAiModelCatalog}
			entitySelector={globalAiModelCatalogSelector}
			href={
				resolve(
					'/~/ai/model-catalog/[catalogId=stringSegment]',
					{
						catalogId: globalAiModelCatalogSelector.catalogId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
