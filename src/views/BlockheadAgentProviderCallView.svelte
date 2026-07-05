<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentProviderCall>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAgentProviderCall>>
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
	const blockheadAgentProviderCall = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((String((selection.entitySelector.indexInTurn ?? prefetched.indexInTurn) ?? '') ? 'Call #' + String((selection.entitySelector.indexInTurn ?? prefetched.indexInTurn) ?? '') : '') || 'blockhead agent provider call')
	const viewDomId = $derived('blockhead-agent-provider-call-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
</script>


<EntityView
	entityType={EntityType.BlockheadAgentProviderCall}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.indexInTurn ?? prefetched.indexInTurn ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.indexInTurn ?? prefetched.indexInTurn}
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
		<ResourceBoundary resource={blockheadAgentProviderCall}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || title || 'blockhead agent provider call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
						href={
							(selection.entitySelector.$turn.$conversation !== undefined && selection.entitySelector.$turn.$conversation.id !== undefined && selection.entitySelector.$turn.id !== undefined ? resolve('/~/agents/conversation/[conversationId]/turn/[turnId]', {
								conversationId: String(selection.entitySelector.$turn.$conversation.id ?? ''),
								turnId: String(selection.entitySelector.$turn.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
								fields: {
									indexInTurn: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTurn = selection.entitySelector.indexInTurn ?? prefetched.indexInTurn}
							{#if indexInTurn !== undefined && indexInTurn !== null}
								<NumberValue value={Number(indexInTurn)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTurn = resolvedEntity.indexInTurn}
							{#if indexInTurn !== undefined && indexInTurn !== null}
								<NumberValue value={Number(indexInTurn)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadAgentConnection, false>('$connection')}
			>
				{#snippet children(blockheadAgentConnection)}
					{#if blockheadAgentConnection != null && blockheadAgentConnection[EntityMetaKey.Selector] != null}
						<div>
							<dt>connection</dt>
							<dd>
								<BlockheadAgentConnectionView
									selection={select(EntityType.BlockheadAgentConnection, blockheadAgentConnection[EntityMetaKey.Selector])}
									prefetched={blockheadAgentConnection}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AiModelProvider, false>('$provider')}
			>
				{#snippet children(aiModelProvider)}
					{#if aiModelProvider != null && aiModelProvider[EntityMetaKey.Selector] != null}
						<div>
							<dt>provider</dt>
							<dd>
								<AiModelProviderView
									selection={select(EntityType.AiModelProvider, aiModelProvider[EntityMetaKey.Selector])}
									prefetched={aiModelProvider}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AiModel, false>('$model')}
			>
				{#snippet children(aiModel)}
					{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
						<div>
							<dt>model</dt>
							<dd>
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AiProviderApiOperation, false>('$operation')}
			>
				{#snippet children(aiProviderApiOperation)}
					{#if aiProviderApiOperation != null && aiProviderApiOperation[EntityMetaKey.Selector] != null}
						<div>
							<dt>operation</dt>
							<dd>
								<AiProviderApiOperationView
									selection={select(EntityType.AiProviderApiOperation, aiProviderApiOperation[EntityMetaKey.Selector])}
									prefetched={aiProviderApiOperation}
									layout={EntityLayout.Title}
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
						fields: {
							providerRequestId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerRequestId = prefetched.providerRequestId}
					{#if providerRequestId !== undefined && providerRequestId !== null}
						<div>
							<dt>provider request ID</dt>
							<dd>
								{String((providerRequestId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerResponseId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerResponseId = prefetched.providerResponseId}
					{#if providerResponseId !== undefined && providerResponseId !== null}
						<div>
							<dt>provider response ID</dt>
							<dd>
								{String((providerResponseId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startedAt = prefetched.startedAt}
					{#if startedAt !== undefined && startedAt !== null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={Number(startedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const completedAt = prefetched.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							latencyMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latencyMs = prefetched.latencyMs}
					{#if latencyMs !== undefined && latencyMs !== null}
						<div>
							<dt>latency ms</dt>
							<dd>
								<NumberValue value={Number(latencyMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latencyMs = resolvedEntity.latencyMs}
					{#if latencyMs !== undefined && latencyMs !== null}
						<div>
							<dt>latency ms</dt>
							<dd>
								<NumberValue value={Number(latencyMs)} />
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
							requestHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestHashAlgorithm = prefetched.requestHashAlgorithm}
					{#if requestHashAlgorithm !== undefined && requestHashAlgorithm !== null}
						<div>
							<dt>request hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((requestHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							requestHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestHash = prefetched.requestHash}
					{#if requestHash !== undefined && requestHash !== null}
						<div>
							<dt>request hash</dt>
							<dd>
								<TruncatedValue value={String((requestHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							responseHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseHashAlgorithm = prefetched.responseHashAlgorithm}
					{#if responseHashAlgorithm !== undefined && responseHashAlgorithm !== null}
						<div>
							<dt>response hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((responseHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							responseHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseHash = prefetched.responseHash}
					{#if responseHash !== undefined && responseHash !== null}
						<div>
							<dt>response hash</dt>
							<dd>
								<TruncatedValue value={String((responseHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							inputTokenCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputTokenCount = prefetched.inputTokenCount}
					{#if inputTokenCount !== undefined && inputTokenCount !== null}
						<div>
							<dt>input token count</dt>
							<dd>
								<NumberValue value={Number(inputTokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputTokenCount = resolvedEntity.inputTokenCount}
					{#if inputTokenCount !== undefined && inputTokenCount !== null}
						<div>
							<dt>input token count</dt>
							<dd>
								<NumberValue value={Number(inputTokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							outputTokenCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputTokenCount = prefetched.outputTokenCount}
					{#if outputTokenCount !== undefined && outputTokenCount !== null}
						<div>
							<dt>output token count</dt>
							<dd>
								<NumberValue value={Number(outputTokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputTokenCount = resolvedEntity.outputTokenCount}
					{#if outputTokenCount !== undefined && outputTokenCount !== null}
						<div>
							<dt>output token count</dt>
							<dd>
								<NumberValue value={Number(outputTokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
