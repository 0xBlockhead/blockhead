<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AiDataset>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AiDataset>
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
	const aiDataset = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			modality: true,
			license: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			modality: true,
			license: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.datasetUri) ?? ''), String((pendingEntity.datasetName) ?? ''), String((pendingEntity.huggingFaceDatasetId) ?? '')].filter(Boolean).join(' ') || 'AI dataset')
	const viewDomId = $derived('ai-dataset-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDataset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'modality') && Object.hasOwn(prefetched, 'datasetUri') && Object.hasOwn(prefetched, 'datasetName') && Object.hasOwn(prefetched, 'huggingFaceDatasetId') && Object.hasOwn(prefetched, 'license')}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiDataset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'modality') && Object.hasOwn(prefetched, 'datasetUri') && Object.hasOwn(prefetched, 'datasetName') && Object.hasOwn(prefetched, 'huggingFaceDatasetId') && Object.hasOwn(prefetched, 'license')}
			{[String((pendingEntity.modality) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiDataset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.modality) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'modality') && Object.hasOwn(prefetched, 'datasetUri') && Object.hasOwn(prefetched, 'datasetName') && Object.hasOwn(prefetched, 'huggingFaceDatasetId') && Object.hasOwn(prefetched, 'license')}
			{@const license0 = pendingEntity.license}
			{#if license0 !== undefined && license0 !== null}
				<span data-text="muted">
					{String((license0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiDataset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const license0 = resolvedEntity.license}
					{#if license0 !== undefined && license0 !== null}
						<span data-text="muted">
							{String((license0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							datasetUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetUri = resolvedEntity.datasetUri}
					{#if datasetUri !== undefined && datasetUri !== null}
						<div>
							<dt>dataset URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(datasetUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(datasetUri)} />
								</svelte:element>
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
							huggingFaceDatasetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const huggingFaceDatasetId = resolvedEntity.huggingFaceDatasetId}
					{#if huggingFaceDatasetId !== undefined && huggingFaceDatasetId !== null}
						<div>
							<dt>hugging face dataset ID</dt>
							<dd>
								{String((huggingFaceDatasetId) ?? '')}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source = resolvedEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
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
							datasetName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetName = resolvedEntity.datasetName}
					{#if datasetName !== undefined && datasetName !== null}
						<div>
							<dt>dataset name</dt>
							<dd>
								{String((datasetName) ?? '')}
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
							datasetDigest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetDigest = resolvedEntity.datasetDigest}
					{#if datasetDigest !== undefined && datasetDigest !== null}
						<div>
							<dt>dataset digest</dt>
							<dd>
								<TruncatedValue value={String((datasetDigest) ?? '')} />
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
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
							license: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const license = resolvedEntity.license}
					{#if license !== undefined && license !== null}
						<div>
							<dt>license</dt>
							<dd>
								{String((license) ?? '')}
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
							modality: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const modality = resolvedEntity.modality}
					{#if modality !== undefined && modality !== null}
						<div>
							<dt>modality</dt>
							<dd>
								{String((modality) ?? '')}
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
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
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
							isLiveDataset: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isLiveDataset = resolvedEntity.isLiveDataset}
					{#if isLiveDataset !== undefined && isLiveDataset !== null}
						<div>
							<dt>is live dataset</dt>
							<dd>
								{isLiveDataset ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aiDatasetAiDocumentsViewDocumentsResource = selection.$$documents}
		<ResourceBoundary
			resource={aiDatasetAiDocumentsViewDocumentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AiDocumentsView
					selection={aiDatasetAiDocumentsViewDocumentsResource}
					countResource={aiDatasetAiDocumentsViewDocumentsResource.count}
					title='documents'
					id='AiDocumentsView-documents'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
