<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AiDataset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiDataset>>
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
	const aiDataset = $derived(selection({
		fields: {
			label: true,
			modality: true,
			license: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((prefetched.datasetUri) ?? ''), String((prefetched.datasetName) ?? ''), String((prefetched.huggingFaceDatasetId) ?? '')].filter(Boolean).join(' ') || 'AI dataset')
	const viewDomId = $derived('ai-dataset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={aiDataset}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.datasetUri) ?? ''), String((prefetched.datasetName) ?? ''), String((prefetched.huggingFaceDatasetId) ?? '')].filter(Boolean).join(' ') || 'AI dataset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiDataset}>
			{#snippet Pending()}
				{[String((prefetched.modality) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.datasetUri) ?? ''), String((prefetched.datasetName) ?? ''), String((prefetched.huggingFaceDatasetId) ?? '')].filter(Boolean).join(' ') || 'AI dataset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.modality) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiDataset}>
			{#snippet Pending()}
				{@const license0 = prefetched.license}
				{#if license0 !== undefined && license0 !== null}
					<span data-text="muted">
						{String((license0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							datasetUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const datasetUri = prefetched.datasetUri}
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
						fields: {
							huggingFaceDatasetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const huggingFaceDatasetId = prefetched.huggingFaceDatasetId}
					{#if huggingFaceDatasetId !== undefined && huggingFaceDatasetId !== null}
						<div>
							<dt>hugging face dataset ID</dt>
							<dd>
								{String((huggingFaceDatasetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							revision: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const revision = prefetched.revision}
					{#if revision !== undefined && revision !== null}
						<div>
							<dt>revision</dt>
							<dd>
								{String((revision) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const source = prefetched.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							datasetName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const datasetName = prefetched.datasetName}
					{#if datasetName !== undefined && datasetName !== null}
						<div>
							<dt>dataset name</dt>
							<dd>
								{String((datasetName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							datasetDigest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const datasetDigest = prefetched.datasetDigest}
					{#if datasetDigest !== undefined && datasetDigest !== null}
						<div>
							<dt>dataset digest</dt>
							<dd>
								<TruncatedValue value={String((datasetDigest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = prefetched.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							license: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const license = prefetched.license}
					{#if license !== undefined && license !== null}
						<div>
							<dt>license</dt>
							<dd>
								{String((license) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							modality: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const modality = prefetched.modality}
					{#if modality !== undefined && modality !== null}
						<div>
							<dt>modality</dt>
							<dd>
								{String((modality) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							isLiveDataset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isLiveDataset = prefetched.isLiveDataset}
					{#if isLiveDataset !== undefined && isLiveDataset !== null}
						<div>
							<dt>is live dataset</dt>
							<dd>
								{isLiveDataset ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<AiDocumentsView
				selection={selection.$$documents}
				title='documents'
				emptyText='No linked documents.'
				id='AiDocumentsView-documents'
			/>
		{/if}
	{/snippet}
</EntityView>
