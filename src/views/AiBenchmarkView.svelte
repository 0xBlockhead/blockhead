<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.AiBenchmark>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiBenchmark>>
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
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.benchmarkId) ?? ''), String((pendingEntity.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark')
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
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.benchmarkId) ?? ''), String((pendingEntity.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
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
				{[String((pendingEntity.taskType) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.benchmarkId) ?? ''), String((pendingEntity.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
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
				{@const metricName0 = pendingEntity.metricName}
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
					{@const benchmarkId = pendingEntity.benchmarkId}
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
					{@const benchmarkUri = pendingEntity.benchmarkUri}
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
					{@const source = pendingEntity.source}
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
					{@const sourceBenchmarkId = pendingEntity.sourceBenchmarkId}
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
					{@const label = pendingEntity.label}
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
					{@const taskType = pendingEntity.taskType}
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
					{@const metricName = pendingEntity.metricName}
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
					{@const metricType = pendingEntity.metricType}
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
					{@const license = pendingEntity.license}
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
				resource={selection.$dataset}
			>
				{#snippet Pending()}{/snippet}

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
