<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'global AI artifact catalog observations',
		open = $bindable(true),
		id = 'GlobalAiArtifactCatalog_Timestamps-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._GlobalAiArtifactCatalog_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
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
	{#snippet Item({ item: globalAiArtifactCatalogTimestamp })}
		{@const globalAiArtifactCatalogTimestampSelector = globalAiArtifactCatalogTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
			entitySelector={globalAiArtifactCatalogTimestampSelector}
		>
			{#snippet Title()}
				{String(globalAiArtifactCatalogTimestampSelector.timestampMs) || 'global AI artifact catalog timestamp'}
			{/snippet}

			{#snippet Value()}
				{(globalAiArtifactCatalogTimestamp.status ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{globalAiArtifactCatalogTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
