<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AiDataset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiDataset}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				modality: true,
				datasetUri: true,
				datasetName: true,
				huggingFaceDatasetId: true,
				license: true,
			},
		})
	}
>
	{#snippet Item({ item: aiDataset })}
		{@const aiDatasetSelector = aiDataset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiDataset}
			entitySelector={aiDatasetSelector}
		>
			{#snippet Title()}
				{(aiDataset.label ?? '') || [String(aiDatasetSelector.datasetUri ?? ''), (aiDatasetSelector.datasetName ?? ''), (aiDatasetSelector.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset'}
			{/snippet}

			{#snippet Value()}
				{(aiDataset.modality ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(aiDataset.license ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
