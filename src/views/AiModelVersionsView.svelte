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
	}: EntityListViewProps<EntityType.AiModelVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiModelVersion}
	bind:open
	resource={
		selection({
			...{
				fields: {
					versionId: true,
					$model: true,
					revision: true,
					$artifact: true,
					quantization: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: aiModelVersion })}
		{@const aiModelVersionSelector = aiModelVersion[EntityMetaKey.Selector]}
		{@const model = aiModelVersionSelector.$model}
		{@const artifact = aiModelVersionSelector.$artifact}
		<EntityView
			entityType={EntityType.AiModelVersion}
			entitySelector={aiModelVersionSelector}
			href={
				'versionId' in aiModelVersionSelector
				&& '$model' in aiModelVersionSelector
				&& 'providerId' in model.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/model/[providerModelId=stringSegment]/(aiModel)/version/[versionId=stringSegment]',
						{
							providerId: model.$provider.providerId,
							providerModelId: model.providerModelId,
							versionId: aiModelVersionSelector.versionId,
						}
					)
				:
					'$artifact' in aiModelVersionSelector
					&& 'digestAlgorithm' in artifact
					&& 'digest' in artifact ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/model-version',
							{
								digestAlgorithm: artifact.digestAlgorithm,
								digest: artifact.digest,
							}
						)
					:
						'huggingFaceRepo' in aiModelVersionSelector
						&& 'revision' in aiModelVersionSelector ?
							resolve(
								'/(ai)/ai/model-version/huggingface/[huggingFaceRepo=stringSegment]/[revision=stringSegment]',
								{
									huggingFaceRepo: aiModelVersionSelector.huggingFaceRepo,
									revision: aiModelVersionSelector.revision,
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				{(aiModelVersion.versionId ?? '') || [(aiModelVersion.revision ?? ''), aiModelVersion.$artifact == null ? '' : (aiModelVersion.$artifact.artifactType ?? '') || [(aiModelVersion.$artifact.providerArtifactId ?? ''), (aiModelVersion.$artifact.ociDigest ?? ''), (aiModelVersion.$artifact.ipfsCid ?? ''), (aiModelVersion.$artifact.arweaveId ?? ''), (aiModelVersion.$artifact.gitObject ?? ''), (aiModelVersion.$artifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ') || 'AI model version'}
			{/snippet}

			{#snippet Value()}
				{aiModelVersion.$model == null ? '' : (aiModelVersion.$model.label ?? '') || aiModelVersion.$model.providerModelId || 'AI model'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiModelVersion.quantization ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
