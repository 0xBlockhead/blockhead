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
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CodexDataset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CodexDataset}
	bind:open
	resource={
		selection({
			fields: {
				filename: true,
				mimetype: true,
				cid: true,
				datasetSizeBytes: true,
			},
		})
	}
>
	{#snippet Item({ item: codexDataset })}
		{@const codexDatasetSelector = codexDataset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CodexDataset}
			entitySelector={codexDatasetSelector}
		>
			{#snippet Title()}
				{(codexDataset.filename ?? '') || codexDatasetSelector.cid || 'codex dataset'}
			{/snippet}

			{#snippet Value()}
				{(codexDataset.mimetype ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(codexDataset.datasetSizeBytes ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
