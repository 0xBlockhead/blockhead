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
		<EntityView
			entityType={EntityType.AiDataset}
			entitySelector={aiDataset[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{(aiDataset.label ?? '') || [(aiDataset.datasetUri ?? ''), (aiDataset.datasetName ?? ''), (aiDataset.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset'}
			{/snippet}

			{#snippet Value()}
				{aiDataset.modality ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiDataset.license ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
