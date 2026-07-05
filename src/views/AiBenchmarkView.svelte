<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AiBenchmark>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiBenchmark>>
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
	const aiBenchmark = $derived(selection({
		fields: {
			label: true,
			taskType: true,
			metricName: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((prefetched.benchmarkId) ?? ''), String((prefetched.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark')
	const viewDomId = $derived('ai-benchmark-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
		<ResourceBoundary resource={aiBenchmark}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.benchmarkId) ?? ''), String((prefetched.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiBenchmark}>
			{#snippet Pending()}
				{[String((prefetched.taskType) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.benchmarkId) ?? ''), String((prefetched.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.taskType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiBenchmark}>
			{#snippet Pending()}
				{@const metricName0 = prefetched.metricName}
				{#if metricName0 !== undefined && metricName0 !== null}
					<span data-text="muted">
						{String((metricName0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							benchmarkId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const benchmarkId = prefetched.benchmarkId}
					{#if benchmarkId !== undefined && benchmarkId !== null}
						<div>
							<dt>benchmark ID</dt>
							<dd>
								{String((benchmarkId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							benchmarkUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const benchmarkUri = prefetched.benchmarkUri}
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
							sourceBenchmarkId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceBenchmarkId = prefetched.sourceBenchmarkId}
					{#if sourceBenchmarkId !== undefined && sourceBenchmarkId !== null}
						<div>
							<dt>source benchmark ID</dt>
							<dd>
								{String((sourceBenchmarkId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							taskType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const taskType = prefetched.taskType}
					{#if taskType !== undefined && taskType !== null}
						<div>
							<dt>task type</dt>
							<dd>
								{String((taskType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							metricName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metricName = prefetched.metricName}
					{#if metricName !== undefined && metricName !== null}
						<div>
							<dt>metric name</dt>
							<dd>
								{String((metricName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							metricType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const metricType = prefetched.metricType}
					{#if metricType !== undefined && metricType !== null}
						<div>
							<dt>metric type</dt>
							<dd>
								{String((metricType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.AiDataset, false>('$dataset')}
			>
				{#snippet children(aiDataset)}
					{#if aiDataset != null && aiDataset[EntityMetaKey.Selector] != null}
						<div>
							<dt>dataset</dt>
							<dd>
								<AiDatasetView
									selection={select(EntityType.AiDataset, aiDataset[EntityMetaKey.Selector])}
									prefetched={aiDataset}
									layout={EntityLayout.Title}
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
		{#if detailsOpen}
			<AiDocumentsView
				selection={selection[EntityProxyField]<EntityType.AiDocument>('$$documents')}
				title='documents'
				emptyText='No linked documents.'
				id='AiDocumentsView-$$documents'
			/>
		{/if}
	{/snippet}
</EntityView>
