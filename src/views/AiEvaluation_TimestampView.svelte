<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiEvaluation_Timestamp> = $props()

	const aiEvaluationTimestamp = $derived(selection({
		fields: {
			value: true,
			unit: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.metricName || 'AI evaluation timestamp')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={aiEvaluationTimestamp}>
			{#snippet children(entity)}
				{[String(entity.value ?? ''), (entity.unit ?? '')].filter(Boolean).join(' ') || selection.entitySelector.metricName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.subjectKind}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					{selection.entitySelector.subjectKind}
				</dd>
			</div>

			<div>
				<dt>benchmark</dt>
				<dd>
					<AiBenchmarkView
						selection={select(EntityType.AiBenchmark, selection.entitySelector.$benchmark)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>metric name</dt>
				<dd>
					{selection.entitySelector.metricName}
				</dd>
			</div>

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
				resource={aiEvaluationTimestamp}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiEvaluationTimestamp}
			>
				{#snippet children(entity)}
					{@const unit = entity.unit}
					{#if unit != null}
						<div>
							<dt>unit</dt>
							<dd>
								{unit}
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
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$model}
			>
				{#snippet children(aiModel)}
					{#if aiModel != null}
						<div>
							<dt>model</dt>
							<dd>
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Value}
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
					{#if aiModelVersion != null}
						<div>
							<dt>model version</dt>
							<dd>
								<AiModelVersionView
									selection={select(EntityType.AiModelVersion, aiModelVersion[EntityMetaKey.Selector])}
									prefetched={aiModelVersion}
									layout={EntityLayout.Value}
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
					{#if a2aAgentService != null}
						<div>
							<dt>A2A agent service</dt>
							<dd>
								<A2aAgentServiceView
									selection={select(EntityType.A2aAgentService, a2aAgentService[EntityMetaKey.Selector])}
									prefetched={a2aAgentService}
									layout={EntityLayout.Value}
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
					{#if mcpServer != null}
						<div>
							<dt>mcp server</dt>
							<dd>
								<McpServerView
									selection={select(EntityType.McpServer, mcpServer[EntityMetaKey.Selector])}
									prefetched={mcpServer}
									layout={EntityLayout.Value}
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
					{#if eip8004AgentRegistration != null}
						<div>
							<dt>eip8004 registration</dt>
							<dd>
								<Eip8004AgentRegistrationView
									selection={select(EntityType.Eip8004AgentRegistration, eip8004AgentRegistration[EntityMetaKey.Selector])}
									prefetched={eip8004AgentRegistration}
									layout={EntityLayout.Value}
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
							sourceRunId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceRunId = entity.sourceRunId}
					{#if sourceRunId != null}
						<div>
							<dt>source run ID</dt>
							<dd>
								{sourceRunId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceResultId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceResultId = entity.sourceResultId}
					{#if sourceResultId != null}
						<div>
							<dt>source result ID</dt>
							<dd>
								{sourceResultId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							step: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const step = entity.step}
					{#if step != null}
						<div>
							<dt>step</dt>
							<dd>
								{step}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							split: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const split = entity.split}
					{#if split != null}
						<div>
							<dt>split</dt>
							<dd>
								{split}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							method: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const method = entity.method}
					{#if method != null}
						<div>
							<dt>method</dt>
							<dd>
								{method}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							harnessVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const harnessVersion = entity.harnessVersion}
					{#if harnessVersion != null}
						<div>
							<dt>harness version</dt>
							<dd>
								{harnessVersion}
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
							datasetName: true,
						},
					})
				}
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
							datasetType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const datasetType = entity.datasetType}
					{#if datasetType != null}
						<div>
							<dt>dataset type</dt>
							<dd>
								{datasetType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							datasetConfig: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const datasetConfig = entity.datasetConfig}
					{#if datasetConfig != null}
						<div>
							<dt>dataset config</dt>
							<dd>
								{datasetConfig}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							datasetSplit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const datasetSplit = entity.datasetSplit}
					{#if datasetSplit != null}
						<div>
							<dt>dataset split</dt>
							<dd>
								{datasetSplit}
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
				resource={
					selection({
						fields: {
							sourceName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceName = entity.sourceName}
					{#if sourceName != null}
						<div>
							<dt>source name</dt>
							<dd>
								{sourceName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceUrl = entity.sourceUrl}
					{#if sourceUrl != null}
						<div>
							<dt>source URL</dt>
							<dd>
								<a
									href={sourceUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={sourceUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
