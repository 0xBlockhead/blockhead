<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiModelVersion> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.HuggingFaceHub_Rest,
			Source.Mlflow_Rest,
		],
	}))
	const aiModelVersion = $derived(viewSelection({
		fields: {
			versionId: true,
			huggingFaceRepo: true,
			revision: true,
			mlflowRegisteredModelName: true,
			mlflowModelVersion: true,
			quantization: true,
		},
	}))
	const titleFallback = $derived((prefetched.versionId ?? '') || (prefetched.revision ?? '') || 'AI model version')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiModelVersion}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiModelVersion}>
			{#snippet children(entity)}
				{(entity.versionId ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$model}
		>
			{#snippet children(aiModel)}
				{#if aiModel != null}
					<AiModelView
						selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
						prefetched={aiModel}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiModelVersion}>
			{#snippet children(entity)}
				{@const quantization = entity.quantization}
				{#if quantization != null}
					<span data-text="muted">
						{quantization}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$model}
			>
				{#snippet children(aiModel)}
					{#if aiModel != null}
						<div>
							<dt>model</dt>
							<dd>
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelVersion}
			>
				{#snippet children(entity)}
					{@const versionId = entity.versionId}
					{#if versionId != null}
						<div>
							<dt>version ID</dt>
							<dd>
								{versionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
									prefetched={aiArtifact}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelVersion}
			>
				{#snippet children(entity)}
					{@const huggingFaceRepo = entity.huggingFaceRepo}
					{#if huggingFaceRepo != null}
						<div>
							<dt>hugging face repo</dt>
							<dd>
								{huggingFaceRepo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelVersion}
			>
				{#snippet children(entity)}
					{@const revision = entity.revision}
					{#if revision != null}
						<div>
							<dt>revision</dt>
							<dd>
								{revision}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aiModelVersion}
			>
				{#snippet children(entity)}
					{@const mlflowRegisteredModelName = entity.mlflowRegisteredModelName}
					{#if mlflowRegisteredModelName != null}
						<div>
							<dt>mlflow registered model name</dt>
							<dd>
								{mlflowRegisteredModelName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelVersion}
			>
				{#snippet children(entity)}
					{@const mlflowModelVersion = entity.mlflowModelVersion}
					{#if mlflowModelVersion != null}
						<div>
							<dt>mlflow model version</dt>
							<dd>
								{mlflowModelVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							onnxIrVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onnxIrVersion = entity.onnxIrVersion}
					{#if onnxIrVersion != null}
						<div>
							<dt>onnx ir version</dt>
							<dd>
								{onnxIrVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							trainingCutoff: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const trainingCutoff = entity.trainingCutoff}
					{#if trainingCutoff != null}
						<div>
							<dt>training cutoff</dt>
							<dd>
								<Timestamp timestamp={trainingCutoff} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelVersion}
			>
				{#snippet children(entity)}
					{@const quantization = entity.quantization}
					{#if quantization != null}
						<div>
							<dt>quantization</dt>
							<dd>
								{quantization}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fineTuneKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fineTuneKind = entity.fineTuneKind}
					{#if fineTuneKind != null}
						<div>
							<dt>fine tune kind</dt>
							<dd>
								{fineTuneKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const documentsResource = selection.$$documents}
		<ResourceBoundary
			resource={documentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiDocumentsView
						selection={documentsResource}
						countResource={documentsResource.count}
						title='documents'
						id='documents'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
