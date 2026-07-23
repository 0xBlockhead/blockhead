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
			selection: RegisteredEntityProxyResource<EntityType.AiBenchmark>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AiBenchmark>
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
	const aiBenchmark = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			taskType: true,
			metricName: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			taskType: true,
			metricName: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.benchmarkId) ?? ''), String((pendingEntity.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark')
	const viewDomId = $derived('ai-benchmark-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiDatasetView from '$/views/AiDatasetView.svelte'
</script>


<EntityView
	entityType={EntityType.AiBenchmark}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'taskType') && Object.hasOwn(prefetched, 'benchmarkId') && Object.hasOwn(prefetched, 'benchmarkUri') && Object.hasOwn(prefetched, 'metricName')}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiBenchmark}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'taskType') && Object.hasOwn(prefetched, 'benchmarkId') && Object.hasOwn(prefetched, 'benchmarkUri') && Object.hasOwn(prefetched, 'metricName')}
			{[String((pendingEntity.taskType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiBenchmark}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.taskType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'taskType') && Object.hasOwn(prefetched, 'benchmarkId') && Object.hasOwn(prefetched, 'benchmarkUri') && Object.hasOwn(prefetched, 'metricName')}
			{@const metricName0 = pendingEntity.metricName}
			{#if metricName0 !== undefined && metricName0 !== null}
				<span data-text="muted">
					{String((metricName0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiBenchmark}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metricName0 = resolvedEntity.metricName}
					{#if metricName0 !== undefined && metricName0 !== null}
						<span data-text="muted">
							{String((metricName0) ?? '')}
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
							benchmarkId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const benchmarkId = resolvedEntity.benchmarkId}
					{#if benchmarkId !== undefined && benchmarkId !== null}
						<div>
							<dt>benchmark ID</dt>
							<dd>
								{String((benchmarkId) ?? '')}
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
							benchmarkUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const benchmarkUri = resolvedEntity.benchmarkUri}
					{#if benchmarkUri !== undefined && benchmarkUri !== null}
						<div>
							<dt>benchmark URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(benchmarkUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(benchmarkUri)} />
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
							sourceBenchmarkId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceBenchmarkId = resolvedEntity.sourceBenchmarkId}
					{#if sourceBenchmarkId !== undefined && sourceBenchmarkId !== null}
						<div>
							<dt>source benchmark ID</dt>
							<dd>
								{String((sourceBenchmarkId) ?? '')}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							taskType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const taskType = resolvedEntity.taskType}
					{#if taskType !== undefined && taskType !== null}
						<div>
							<dt>task type</dt>
							<dd>
								{String((taskType) ?? '')}
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
							metricName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metricName = resolvedEntity.metricName}
					{#if metricName !== undefined && metricName !== null}
						<div>
							<dt>metric name</dt>
							<dd>
								{String((metricName) ?? '')}
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
							metricType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metricType = resolvedEntity.metricType}
					{#if metricType !== undefined && metricType !== null}
						<div>
							<dt>metric type</dt>
							<dd>
								{String((metricType) ?? '')}
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
				resource={selection.$dataset}
			>
				{#snippet children(aiDataset)}
					{#if aiDataset != null && aiDataset[EntityMetaKey.Selector] != null}
						<div>
							<dt>dataset</dt>
							<dd>
								<AiDatasetView
									selection={select(EntityType.AiDataset, aiDataset[EntityMetaKey.Selector])}
									prefetched={aiDataset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aiBenchmarkAiDocumentsViewDocumentsResource = selection.$$documents}
		<ResourceBoundary
			resource={aiBenchmarkAiDocumentsViewDocumentsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<AiDocumentsView
					selection={aiBenchmarkAiDocumentsViewDocumentsResource}
					countResource={aiBenchmarkAiDocumentsViewDocumentsResource.count}
					title='documents'
					id='AiDocumentsView-documents'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
