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
		{@const artifact = aiDatasetSelector.$artifact}
		<EntityView
			entityType={EntityType.AiDataset}
			entitySelector={aiDatasetSelector}
			href={
				'$artifact' in aiDatasetSelector
				&& 'digestAlgorithm' in artifact
				&& 'digest' in artifact ?
					resolve(
						'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/dataset',
						{
							digestAlgorithm: artifact.digestAlgorithm,
							digest: artifact.digest,
						}
					)
				:
					'source' in aiDatasetSelector
					&& 'datasetName' in aiDatasetSelector
					&& 'datasetDigest' in aiDatasetSelector ?
						resolve(
							'/(ai)/ai/dataset/source/[source=stringSegment]/[datasetName=stringSegment]/[datasetDigest=stringSegment]',
							{
								source: aiDatasetSelector.source,
								datasetName: aiDatasetSelector.datasetName,
								datasetDigest: aiDatasetSelector.datasetDigest,
							}
						)
					:
						'huggingFaceDatasetId' in aiDatasetSelector
						&& 'revision' in aiDatasetSelector ?
							resolve(
								'/(ai)/ai/dataset/huggingface/[huggingFaceDatasetId=stringSegment]/[revision=stringSegment]',
								{
									huggingFaceDatasetId: aiDatasetSelector.huggingFaceDatasetId,
									revision: aiDatasetSelector.revision,
								}
							)
						:
							'datasetUri' in aiDatasetSelector ?
								resolve(
									'/(ai)/ai/dataset/uri/[datasetUri=absoluteUrl]',
									{
										datasetUri: encodeURIComponent(aiDatasetSelector.datasetUri),
									}
								)
							:
								undefined
			}
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
