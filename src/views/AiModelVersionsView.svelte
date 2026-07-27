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
			fields: {
				versionId: true,
				$model: true,
				revision: true,
				$artifact: true,
				quantization: true,
			},
		})
	}
>
	{#snippet Item({ item: aiModelVersion })}
		{@const aiModelVersionSelector = aiModelVersion[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiModelVersion}
			entitySelector={aiModelVersionSelector}
		>
			{#snippet Title()}
				{(aiModelVersionSelector.versionId ?? '') || ([(aiModelVersionSelector.revision ?? ''), aiModelVersion.$artifact == null ? '' : (aiModelVersion.$artifact.artifactType ?? '') || [(aiModelVersion.$artifact.providerArtifactId ?? ''), (aiModelVersion.$artifact.ociDigest ?? ''), (aiModelVersion.$artifact.ipfsCid ?? ''), (aiModelVersion.$artifact.arweaveId ?? ''), (aiModelVersion.$artifact.gitObject ?? ''), String(aiModelVersion.$artifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ')) || 'AI model version'}
			{/snippet}

			{#snippet Value()}
				{aiModelVersion.$model == null ? '' : (aiModelVersion.$model.label ?? '') || aiModelVersion.$model.providerModelId || 'AI model'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(aiModelVersion.quantization ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
