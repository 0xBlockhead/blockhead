<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'global AI model catalog observations',
		open = $bindable(true),
		id = 'GlobalAiModelCatalog_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAiModelCatalog_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAiModelCatalog_Timestamp}
	{id}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: globalAiModelCatalogTimestamp })}
		{@const globalAiModelCatalogTimestampSelector = globalAiModelCatalogTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalAiModelCatalog_Timestamp}
			entitySelector={globalAiModelCatalogTimestampSelector}
		>
			{#snippet Title()}
				{globalAiModelCatalogTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{globalAiModelCatalogTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalAiModelCatalogTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
