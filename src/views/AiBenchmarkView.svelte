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
	}: EntitySelectionViewProps<EntityType.AiBenchmark> = $props()

	const aiBenchmark = $derived(selection({
		fields: {
			label: true,
			taskType: true,
			benchmarkId: true,
			benchmarkUri: true,
			metricName: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || [(prefetched.benchmarkId ?? ''), (prefetched.benchmarkUri ?? '')].filter(Boolean).join(' ') || 'AI benchmark')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<EntityView
	entityType={EntityType.AiBenchmark}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'source' in selection.entitySelector
				&& 'sourceBenchmarkId' in selection.entitySelector ?
					resolve(
						'/(ai)/ai/benchmark/source/[source=stringSegment]/[sourceBenchmarkId=stringSegment]',
						{
							source: selection.entitySelector.source,
							sourceBenchmarkId: selection.entitySelector.sourceBenchmarkId,
						}
					)
				:
					'benchmarkId' in selection.entitySelector ?
						resolve(
							'/(ai)/ai/benchmark/id/[benchmarkId=stringSegment]',
							{
								benchmarkId: selection.entitySelector.benchmarkId,
							}
						)
					:
						'benchmarkUri' in selection.entitySelector ?
							resolve(
								'/(ai)/ai/benchmark/uri/[benchmarkUri=absoluteUrl]',
								{
									benchmarkUri: encodeURIComponent(selection.entitySelector.benchmarkUri),
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
		<ResourceBoundary resource={aiBenchmark}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiBenchmark}>
			{#snippet children(entity)}
				{(entity.taskType ?? '') || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiBenchmark}>
			{#snippet children(entity)}
				{@const metricName = entity.metricName}
				{#if metricName != null}
					<span data-text="muted">
						{metricName}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>benchmark ID</dt>
				<dd>
					<ResourceBoundary
						resource={aiBenchmark}
					>
						{#snippet children(entity)}
							{entity.benchmarkId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>benchmark URI</dt>
				<dd>
					<ResourceBoundary
						resource={aiBenchmark}
					>
						{#snippet children(entity)}
							<a
								href={entity.benchmarkUri}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.benchmarkUri} />
							</a>
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
				<dt>source benchmark ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sourceBenchmarkId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sourceBenchmarkId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={aiBenchmark}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={aiBenchmark}
			>
				{#snippet children(entity)}
					{@const taskType = entity.taskType}
					{#if taskType != null}
						<div>
							<dt>task type</dt>
							<dd>
								{taskType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiBenchmark}
			>
				{#snippet children(entity)}
					{@const metricName = entity.metricName}
					{#if metricName != null}
						<div>
							<dt>metric name</dt>
							<dd>
								{metricName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metricType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metricType = entity.metricType}
					{#if metricType != null}
						<div>
							<dt>metric type</dt>
							<dd>
								{metricType}
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
				resource={selection.$dataset}
			>
				{#snippet children(aiDataset)}
					{#if aiDataset != null}
						<div>
							<dt>dataset</dt>
							<dd>
								<AiDatasetView
									selection={select(EntityType.AiDataset, aiDataset[EntityMetaKey.Selector])}
									prefetched={aiDataset}
									layout={EntityLayout.Value}
								/>
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
