<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
	}: EntitySelectionViewProps<EntityType.AiDataset> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const aiDataset = $derived(selection({
		fields: {
			label: true,
			modality: true,
			datasetUri: true,
			datasetName: true,
			huggingFaceDatasetId: true,
			license: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || [String(pendingEntity.datasetUri ?? ''), (pendingEntity.datasetName ?? ''), (pendingEntity.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiArtifactView from '$/views/AiArtifactView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDataset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiDataset}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiDataset}>
			{#snippet children(entity)}
				{(entity.modality ?? '') || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiDataset}>
			{#snippet children(entity)}
				{@const license0 = entity.license}
				{#if license0 != null}
					<span data-text="muted">
						{license0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={aiDataset}
			>
				{#snippet children(entity)}
					{@const datasetUri = entity.datasetUri}
					{#if datasetUri != null}
						<div>
							<dt>dataset URI</dt>
							<dd>
								<a
									href={String(datasetUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(datasetUri)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiDataset}
			>
				{#snippet children(entity)}
					{@const huggingFaceDatasetId = entity.huggingFaceDatasetId}
					{#if huggingFaceDatasetId != null}
						<div>
							<dt>hugging face dataset ID</dt>
							<dd>
								{huggingFaceDatasetId}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiDataset}
			>
				{#snippet children(entity)}
					{@const datasetName = entity.datasetName}
					{#if datasetName != null}
						<div>
							<dt>dataset name</dt>
							<dd>
								{datasetName}
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
				{#snippet children(entity)}
					{@const datasetDigest = entity.datasetDigest}
					{#if datasetDigest != null}
						<div>
							<dt>dataset digest</dt>
							<dd>
								<TruncatedValue value={datasetDigest} />
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
				resource={aiDataset}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiDataset}
			>
				{#snippet children(entity)}
					{@const license = entity.license}
					{#if license != null}
						<div>
							<dt>license</dt>
							<dd>
								{license}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiDataset}
			>
				{#snippet children(entity)}
					{@const modality = entity.modality}
					{#if modality != null}
						<div>
							<dt>modality</dt>
							<dd>
								{modality}
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
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
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
				{#snippet children(entity)}
					{@const isLiveDataset = entity.isLiveDataset}
					{#if isLiveDataset != null}
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
						id='documents'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
