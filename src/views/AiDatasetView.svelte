<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.AiDataset> = $props()

	const artifact = $derived(selection.entitySelector.$artifact)
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
	const titleFallback = $derived((prefetched.label ?? '') || [(prefetched.datasetUri ?? ''), (prefetched.datasetName ?? ''), (prefetched.huggingFaceDatasetId ?? '')].filter(Boolean).join(' ') || 'AI dataset')


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
	href={
		href === undefined ?
			(
				'$artifact' in selection.entitySelector
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
					'source' in selection.entitySelector
					&& 'datasetName' in selection.entitySelector
					&& 'datasetDigest' in selection.entitySelector ?
						resolve(
							'/(ai)/ai/dataset/source/[source=stringSegment]/[datasetName=stringSegment]/[datasetDigest=stringSegment]',
							{
								source: selection.entitySelector.source,
								datasetName: selection.entitySelector.datasetName,
								datasetDigest: selection.entitySelector.datasetDigest,
							}
						)
					:
						'huggingFaceDatasetId' in selection.entitySelector
						&& 'revision' in selection.entitySelector ?
							resolve(
								'/(ai)/ai/dataset/huggingface/[huggingFaceDatasetId=stringSegment]/[revision=stringSegment]',
								{
									huggingFaceDatasetId: selection.entitySelector.huggingFaceDatasetId,
									revision: selection.entitySelector.revision,
								}
							)
						:
							'datasetUri' in selection.entitySelector ?
								resolve(
									'/(ai)/ai/dataset/uri/[datasetUri=absoluteUrl]',
									{
										datasetUri: encodeURIComponent(selection.entitySelector.datasetUri),
									}
								)
							:
								undefined
			)
		:
			href ?? undefined
	}
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
				{@const license = entity.license}
				{#if license != null}
					<span data-text="muted">
						{license}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>dataset URI</dt>
				<dd>
					<ResourceBoundary
						resource={aiDataset}
					>
						{#snippet children(entity)}
							<a
								href={entity.datasetUri}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.datasetUri} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>hugging face dataset ID</dt>
				<dd>
					<ResourceBoundary
						resource={aiDataset}
					>
						{#snippet children(entity)}
							{entity.huggingFaceDatasetId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>revision</dt>
				<dd>
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
							{entity.revision}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
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
							{entity.source}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>dataset name</dt>
				<dd>
					<ResourceBoundary
						resource={aiDataset}
					>
						{#snippet children(entity)}
							{entity.datasetName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>dataset digest</dt>
				<dd>
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
							<TruncatedValue value={entity.datasetDigest} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>artifact</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$artifact}
					>
						{#snippet children(aiArtifact)}
							<AiArtifactView
								selection={select(EntityType.AiArtifact, aiArtifact[EntityMetaKey.Selector])}
								prefetched={aiArtifact}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
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

	{#snippet Details()}
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
