<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadAgentProviderCall>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadAgentProviderCall>
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
	const blockheadAgentProviderCall = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			status: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInTurn) ?? '') ? 'Call #' + String((pendingEntity.indexInTurn) ?? '') : '') || 'blockhead agent provider call')
	const viewDomId = $derived('blockhead-agent-provider-call-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTurn ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.indexInTurn}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Call </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'status')}
			{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadAgentProviderCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>turn</dt>
				<dd>
					<BlockheadAgentConversationTurnView
						selection={select(EntityType.BlockheadAgentConversationTurn, selection.entitySelector.$turn)}
						href={
							(
								selection.entitySelector.$turn != null && 'id' in selection.entitySelector.$turn
								&& selection.entitySelector.$turn.id != null
								&& selection.entitySelector.$turn != null && '$conversation' in selection.entitySelector.$turn
								&& selection.entitySelector.$turn.$conversation != null && 'id' in selection.entitySelector.$turn.$conversation
								&& selection.entitySelector.$turn.$conversation.id != null ?
									resolve('/~/agents/conversation/[conversationId=stringSegment]/turn/[turnId=stringSegment]', {
								turnId: String(selection.entitySelector.$turn.id ?? ''),
								conversationId: String(selection.entitySelector.$turn.$conversation.id ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>index in turn</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInTurn: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTurn = resolvedEntity.indexInTurn}
							{#if indexInTurn !== undefined && indexInTurn !== null}
								<NumberValue
									value={indexInTurn}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$connection}
			>
				{#snippet children(blockheadAgentConnection)}
					{#if blockheadAgentConnection != null && blockheadAgentConnection[EntityMetaKey.Selector] != null}
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
					{#if aiModelProvider != null && aiModelProvider[EntityMetaKey.Selector] != null}
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
				resource={selection.$operation}
			>
				{#snippet children(aiProviderApiOperation)}
					{#if aiProviderApiOperation != null && aiProviderApiOperation[EntityMetaKey.Selector] != null}
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
					{#if mcpToolCall != null && mcpToolCall[EntityMetaKey.Selector] != null}
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
					{#if a2aTask != null && a2aTask[EntityMetaKey.Selector] != null}
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
					{#if acpSession != null && acpSession[EntityMetaKey.Selector] != null}
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
					{#if acpPromptTurn != null && acpPromptTurn[EntityMetaKey.Selector] != null}
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
					selection({
						sources: selection.sources,
						fields: {
							providerRequestId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerRequestId = resolvedEntity.providerRequestId}
					{#if providerRequestId !== undefined && providerRequestId !== null}
						<div>
							<dt>provider request ID</dt>
							<dd>
								{String((providerRequestId) ?? '')}
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
							providerResponseId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerResponseId = resolvedEntity.providerResponseId}
					{#if providerResponseId !== undefined && providerResponseId !== null}
						<div>
							<dt>provider response ID</dt>
							<dd>
								{String((providerResponseId) ?? '')}
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
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
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
							startedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startedAt = resolvedEntity.startedAt}
					{#if startedAt !== undefined && startedAt !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							latencyMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latencyMs = resolvedEntity.latencyMs}
					{#if latencyMs !== undefined && latencyMs !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							requestHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestHashAlgorithm = resolvedEntity.requestHashAlgorithm}
					{#if requestHashAlgorithm !== undefined && requestHashAlgorithm !== null}
						<div>
							<dt>request hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((requestHashAlgorithm) ?? '')} />
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
							requestHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestHash = resolvedEntity.requestHash}
					{#if requestHash !== undefined && requestHash !== null}
						<div>
							<dt>request hash</dt>
							<dd>
								<TruncatedValue value={String((requestHash) ?? '')} />
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
							responseHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseHashAlgorithm = resolvedEntity.responseHashAlgorithm}
					{#if responseHashAlgorithm !== undefined && responseHashAlgorithm !== null}
						<div>
							<dt>response hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((responseHashAlgorithm) ?? '')} />
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
							responseHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseHash = resolvedEntity.responseHash}
					{#if responseHash !== undefined && responseHash !== null}
						<div>
							<dt>response hash</dt>
							<dd>
								<TruncatedValue value={String((responseHash) ?? '')} />
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
							inputTokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputTokenCount = resolvedEntity.inputTokenCount}
					{#if inputTokenCount !== undefined && inputTokenCount !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							outputTokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputTokenCount = resolvedEntity.outputTokenCount}
					{#if outputTokenCount !== undefined && outputTokenCount !== null}
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
