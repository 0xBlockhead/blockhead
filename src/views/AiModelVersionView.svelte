<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.AiModelVersion>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiModelVersion>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const aiModelVersion = $derived(selection({
		sources: selection.sources,
		fields: {
			mlflowRegisteredModelName: true,
			mlflowModelVersion: true,
			quantization: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.versionId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.revision) ?? '')].filter(Boolean).join(' ') || 'AI model version')
	const viewDomId = $derived('ai-model-version-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiModelVersion}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.versionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiModelVersion}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.versionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$model}
					>
						{#snippet children(aiModel)}
							{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={aiModelVersion}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$model}
					>
						{#snippet children(aiModel)}
							{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const quantization0 = pendingEntity.quantization}
			{#if quantization0 !== undefined && quantization0 !== null}
				<span data-text="muted">
					{String((quantization0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiModelVersion}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quantization0 = resolvedEntity.quantization}
					{#if quantization0 !== undefined && quantization0 !== null}
						<span data-text="muted">
							{String((quantization0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$model}
			>
				{#snippet children(aiModel)}
					{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
						<div>
							<dt>model</dt>
							<dd>
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							versionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const versionId = resolvedEntity.versionId}
					{#if versionId !== undefined && versionId !== null}
						<div>
							<dt>version ID</dt>
							<dd>
								{String((versionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$artifact}
			>
				{#snippet children(aiArtifact)}
					{#if aiArtifact != null && aiArtifact[EntityMetaKey.Selector] != null}
						<div>
							<dt>artifact</dt>
							<dd>
								<AiArtifactView
									selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
									prefetched={aiArtifact}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							huggingFaceRepo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const huggingFaceRepo = resolvedEntity.huggingFaceRepo}
					{#if huggingFaceRepo !== undefined && huggingFaceRepo !== null}
						<div>
							<dt>hugging face repo</dt>
							<dd>
								{String((huggingFaceRepo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							revision: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const revision = resolvedEntity.revision}
					{#if revision !== undefined && revision !== null}
						<div>
							<dt>revision</dt>
							<dd>
								{String((revision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							mlflowRegisteredModelName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mlflowRegisteredModelName = resolvedEntity.mlflowRegisteredModelName}
					{#if mlflowRegisteredModelName !== undefined && mlflowRegisteredModelName !== null}
						<div>
							<dt>mlflow registered model name</dt>
							<dd>
								{String((mlflowRegisteredModelName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							mlflowModelVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mlflowModelVersion = resolvedEntity.mlflowModelVersion}
					{#if mlflowModelVersion !== undefined && mlflowModelVersion !== null}
						<div>
							<dt>mlflow model version</dt>
							<dd>
								{String((mlflowModelVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							onnxIrVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const onnxIrVersion = resolvedEntity.onnxIrVersion}
					{#if onnxIrVersion !== undefined && onnxIrVersion !== null}
						<div>
							<dt>onnx ir version</dt>
							<dd>
								{String((onnxIrVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							trainingCutoff: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const trainingCutoff = resolvedEntity.trainingCutoff}
					{#if trainingCutoff !== undefined && trainingCutoff !== null}
						<div>
							<dt>training cutoff</dt>
							<dd>
								<Timestamp timestamp={Number(trainingCutoff)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							quantization: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quantization = resolvedEntity.quantization}
					{#if quantization !== undefined && quantization !== null}
						<div>
							<dt>quantization</dt>
							<dd>
								{String((quantization) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fineTuneKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fineTuneKind = resolvedEntity.fineTuneKind}
					{#if fineTuneKind !== undefined && fineTuneKind !== null}
						<div>
							<dt>fine tune kind</dt>
							<dd>
								{String((fineTuneKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiDocumentsView
				selection={
						selection.$$documents({
							count: true,
						})
					}
				title='documents'
				emptyText='No linked documents.'
				id='AiDocumentsView-documents'
			/>
		{/if}
	{/snippet}
</EntityView>
