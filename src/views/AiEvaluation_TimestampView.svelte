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
			selection: RegisteredEntityProxyResource<EntityType.AiEvaluation_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiEvaluation_Timestamp>>
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
	const aiEvaluationTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			value: true,
			unit: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.metricName) ?? '')].filter(Boolean).join(' ') || 'AI evaluation timestamp')
	const viewDomId = $derived('ai-evaluation-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiBenchmarkView from '$/views/AiBenchmarkView.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
	import AiModelVersionView from '$/views/AiModelVersionView.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.AiEvaluation_Timestamp}
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
			{[String((pendingEntity.metricName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiEvaluationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.metricName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.value) ?? ''), String((pendingEntity.unit) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.metricName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiEvaluationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.value) ?? ''), String((resolvedEntity.unit) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.metricName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const subjectKind0 = pendingEntity.subjectKind}
			{#if subjectKind0 !== undefined && subjectKind0 !== null}
				<span data-text="muted">
					{String((subjectKind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiEvaluationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subjectKind0 = resolvedEntity.subjectKind}
					{#if subjectKind0 !== undefined && subjectKind0 !== null}
						<span data-text="muted">
							{String((subjectKind0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									subjectKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subjectKind = resolvedEntity.subjectKind}
							{#if subjectKind !== undefined && subjectKind !== null}
								{String((subjectKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>benchmark</dt>
				<dd>
					<AiBenchmarkView
						selection={select(EntityType.AiBenchmark, selection.entitySelector.$benchmark, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>metric name</dt>
				<dd>
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
								{String((metricName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const value = resolvedEntity.value}
					{#if value !== undefined && value !== null}
						<div>
							<dt>Value</dt>
							<dd>
								{String((value) ?? '')}
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
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unit = resolvedEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
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
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
				resource={selection.$modelVersion}
			>
				{#snippet children(aiModelVersion)}
					{#if aiModelVersion != null && aiModelVersion[EntityMetaKey.Selector] != null}
						<div>
							<dt>model version</dt>
							<dd>
								<AiModelVersionView
									selection={select(EntityType.AiModelVersion, aiModelVersion[EntityMetaKey.Selector])}
									prefetched={aiModelVersion}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$a2aAgentService}
			>
				{#snippet children(a2aAgentService)}
					{#if a2aAgentService != null && a2aAgentService[EntityMetaKey.Selector] != null}
						<div>
							<dt>A2A agent service</dt>
							<dd>
								<A2aAgentServiceView
									selection={select(EntityType.A2aAgentService, a2aAgentService[EntityMetaKey.Selector])}
									prefetched={a2aAgentService}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$mcpServer}
			>
				{#snippet children(mcpServer)}
					{#if mcpServer != null && mcpServer[EntityMetaKey.Selector] != null}
						<div>
							<dt>mcp server</dt>
							<dd>
								<McpServerView
									selection={select(EntityType.McpServer, mcpServer[EntityMetaKey.Selector])}
									prefetched={mcpServer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$eip8004Registration}
			>
				{#snippet children(eip8004AgentRegistration)}
					{#if eip8004AgentRegistration != null && eip8004AgentRegistration[EntityMetaKey.Selector] != null}
						<div>
							<dt>eip8004 registration</dt>
							<dd>
								<Eip8004AgentRegistrationView
									selection={select(EntityType.Eip8004AgentRegistration, eip8004AgentRegistration[EntityMetaKey.Selector])}
									prefetched={eip8004AgentRegistration}
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
							sourceRunId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceRunId = resolvedEntity.sourceRunId}
					{#if sourceRunId !== undefined && sourceRunId !== null}
						<div>
							<dt>source run ID</dt>
							<dd>
								{String((sourceRunId) ?? '')}
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
							sourceResultId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceResultId = resolvedEntity.sourceResultId}
					{#if sourceResultId !== undefined && sourceResultId !== null}
						<div>
							<dt>source result ID</dt>
							<dd>
								{String((sourceResultId) ?? '')}
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
							step: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const step = resolvedEntity.step}
					{#if step !== undefined && step !== null}
						<div>
							<dt>step</dt>
							<dd>
								{String((step) ?? '')}
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
							split: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const split = resolvedEntity.split}
					{#if split !== undefined && split !== null}
						<div>
							<dt>split</dt>
							<dd>
								{String((split) ?? '')}
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
							method: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const method = resolvedEntity.method}
					{#if method !== undefined && method !== null}
						<div>
							<dt>method</dt>
							<dd>
								{String((method) ?? '')}
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
							harnessVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const harnessVersion = resolvedEntity.harnessVersion}
					{#if harnessVersion !== undefined && harnessVersion !== null}
						<div>
							<dt>harness version</dt>
							<dd>
								{String((harnessVersion) ?? '')}
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
							datasetType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetType = resolvedEntity.datasetType}
					{#if datasetType !== undefined && datasetType !== null}
						<div>
							<dt>dataset type</dt>
							<dd>
								{String((datasetType) ?? '')}
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
							datasetConfig: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetConfig = resolvedEntity.datasetConfig}
					{#if datasetConfig !== undefined && datasetConfig !== null}
						<div>
							<dt>dataset config</dt>
							<dd>
								{String((datasetConfig) ?? '')}
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
							datasetSplit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const datasetSplit = resolvedEntity.datasetSplit}
					{#if datasetSplit !== undefined && datasetSplit !== null}
						<div>
							<dt>dataset split</dt>
							<dd>
								{String((datasetSplit) ?? '')}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sourceName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceName = resolvedEntity.sourceName}
					{#if sourceName !== undefined && sourceName !== null}
						<div>
							<dt>source name</dt>
							<dd>
								{String((sourceName) ?? '')}
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
							sourceUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceUrl = resolvedEntity.sourceUrl}
					{#if sourceUrl !== undefined && sourceUrl !== null}
						<div>
							<dt>source URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(sourceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(sourceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
