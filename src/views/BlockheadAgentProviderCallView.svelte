<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadAgentProviderCall> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAgentProviderCall = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.indexInTurn ?? '') ? 'Call #' + String(pendingEntity.indexInTurn ?? '') : '') || 'blockhead agent provider call')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
	import McpToolCallView from '$/views/McpToolCallView.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
	import AcpPromptTurnView from '$/views/AcpPromptTurnView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentProviderCall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTurn ?? '')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Call </span>
			<span data-badge="small">
				#{String(pendingEntity.indexInTurn)}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentProviderCall}>
			{#snippet children(entity)}
				{(entity.status ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>turn</dt>
				<dd>
					<BlockheadAgentConversationTurnView
						selection={select(EntityType.BlockheadAgentConversationTurn, selection.entitySelector.$turn)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>index in turn</dt>
				<dd>
					<NumberValue
						value={pendingEntity.indexInTurn}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connection}
			>
				{#snippet children(blockheadAgentConnection)}
					{#if blockheadAgentConnection != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConnection}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$provider}
			>
				{#snippet children(aiModelProvider)}
					{#if aiModelProvider != null}
						<div>
							<dt>provider</dt>
							<dd>
								<AiModelProviderView
									selection={select(EntityType.AiModelProvider, aiModelProvider[EntityMetaKey.Selector])}
									prefetched={aiModelProvider}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operation}
			>
				{#snippet children(aiProviderApiOperation)}
					{#if aiProviderApiOperation != null}
						<div>
							<dt>operation</dt>
							<dd>
								<AiProviderApiOperationView
									selection={select(EntityType.AiProviderApiOperation, aiProviderApiOperation[EntityMetaKey.Selector])}
									prefetched={aiProviderApiOperation}
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
				resource={selection.$mcpToolCall}
			>
				{#snippet children(mcpToolCall)}
					{#if mcpToolCall != null}
						<div>
							<dt>MCP tool call</dt>
							<dd>
								<McpToolCallView
									selection={select(EntityType.McpToolCall, mcpToolCall[EntityMetaKey.Selector])}
									prefetched={mcpToolCall}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$a2aTask}
			>
				{#snippet children(a2aTask)}
					{#if a2aTask != null}
						<div>
							<dt>A2A task</dt>
							<dd>
								<A2aTaskView
									selection={select(EntityType.A2aTask, a2aTask[EntityMetaKey.Selector])}
									prefetched={a2aTask}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$acpSession}
			>
				{#snippet children(acpSession)}
					{#if acpSession != null}
						<div>
							<dt>ACP session</dt>
							<dd>
								<AcpSessionView
									selection={select(EntityType.AcpSession, acpSession[EntityMetaKey.Selector])}
									prefetched={acpSession}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$acpPromptTurn}
			>
				{#snippet children(acpPromptTurn)}
					{#if acpPromptTurn != null}
						<div>
							<dt>ACP prompt turn</dt>
							<dd>
								<AcpPromptTurnView
									selection={select(EntityType.AcpPromptTurn, acpPromptTurn[EntityMetaKey.Selector])}
									prefetched={acpPromptTurn}
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
					viewSelection({
						fields: {
							providerRequestId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerRequestId = entity.providerRequestId}
					{#if providerRequestId != null}
						<div>
							<dt>provider request ID</dt>
							<dd>
								{providerRequestId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerResponseId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerResponseId = entity.providerResponseId}
					{#if providerResponseId != null}
						<div>
							<dt>provider response ID</dt>
							<dd>
								{providerResponseId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadAgentProviderCall}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startedAt = entity.startedAt}
					{#if startedAt != null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							latencyMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const latencyMs = entity.latencyMs}
					{#if latencyMs != null}
						<div>
							<dt>latency ms</dt>
							<dd>
								<NumberValue
									value={latencyMs}
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
					viewSelection({
						fields: {
							requestHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestHashAlgorithm = entity.requestHashAlgorithm}
					{#if requestHashAlgorithm != null}
						<div>
							<dt>request hash algorithm</dt>
							<dd>
								<TruncatedValue value={requestHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requestHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestHash = entity.requestHash}
					{#if requestHash != null}
						<div>
							<dt>request hash</dt>
							<dd>
								<TruncatedValue value={String(requestHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							responseHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseHashAlgorithm = entity.responseHashAlgorithm}
					{#if responseHashAlgorithm != null}
						<div>
							<dt>response hash algorithm</dt>
							<dd>
								<TruncatedValue value={responseHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							responseHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const responseHash = entity.responseHash}
					{#if responseHash != null}
						<div>
							<dt>response hash</dt>
							<dd>
								<TruncatedValue value={String(responseHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inputTokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputTokenCount = entity.inputTokenCount}
					{#if inputTokenCount != null}
						<div>
							<dt>input token count</dt>
							<dd>
								<NumberValue
									value={inputTokenCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputTokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputTokenCount = entity.outputTokenCount}
					{#if outputTokenCount != null}
						<div>
							<dt>output token count</dt>
							<dd>
								<NumberValue
									value={outputTokenCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
