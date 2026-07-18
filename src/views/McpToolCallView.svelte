<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.McpToolCall>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.McpToolCall>>
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
	const mcpToolCall = $derived(selection({
		sources: selection.sources,
		fields: {
			startedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.callId) ?? '')].filter(Boolean).join(' ') || 'mcp tool call')
	const viewDomId = $derived('mcp-tool-call-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import McpToolCall_TimestampsView from '$/views/McpToolCall_TimestampsView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
	import McpToolView from '$/views/McpToolView.svelte'
</script>


<EntityView
	entityType={EntityType.McpToolCall}
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
			{[String((pendingEntity.callId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={mcpToolCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.callId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$tool}
					>
						{#snippet children(mcpTool)}
							{#if mcpTool != null && mcpTool[EntityMetaKey.Selector] != null}
								<McpToolView
									selection={select(EntityType.McpTool, mcpTool[EntityMetaKey.Selector])}
									prefetched={mcpTool}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={mcpToolCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$tool}
					>
						{#snippet children(mcpTool)}
							{#if mcpTool != null && mcpTool[EntityMetaKey.Selector] != null}
								<McpToolView
									selection={select(EntityType.McpTool, mcpTool[EntityMetaKey.Selector])}
									prefetched={mcpTool}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const startedAt0 = pendingEntity.startedAt}
			{#if startedAt0 !== undefined && startedAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(startedAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={mcpToolCall}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startedAt0 = resolvedEntity.startedAt}
					{#if startedAt0 !== undefined && startedAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(startedAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>server</dt>
				<dd>
					<McpServerView
						selection={select(EntityType.McpServer, selection.entitySelector.$server, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>call ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									callId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const callId = resolvedEntity.callId}
							{#if callId !== undefined && callId !== null}
								{String((callId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$tool}
			>
				{#snippet children(mcpTool)}
					{#if mcpTool != null && mcpTool[EntityMetaKey.Selector] != null}
						<div>
							<dt>tool</dt>
							<dd>
								<McpToolView
									selection={select(EntityType.McpTool, mcpTool[EntityMetaKey.Selector])}
									prefetched={mcpTool}
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
							inputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputHashAlgorithm = resolvedEntity.inputHashAlgorithm}
					{#if inputHashAlgorithm !== undefined && inputHashAlgorithm !== null}
						<div>
							<dt>input hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((inputHashAlgorithm) ?? '')} />
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
							inputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputHash = resolvedEntity.inputHash}
					{#if inputHash !== undefined && inputHash !== null}
						<div>
							<dt>input hash</dt>
							<dd>
								<TruncatedValue value={String((inputHash) ?? '')} />
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
							outputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputHashAlgorithm = resolvedEntity.outputHashAlgorithm}
					{#if outputHashAlgorithm !== undefined && outputHashAlgorithm !== null}
						<div>
							<dt>output hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((outputHashAlgorithm) ?? '')} />
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
							outputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputHash = resolvedEntity.outputHash}
					{#if outputHash !== undefined && outputHash !== null}
						<div>
							<dt>output hash</dt>
							<dd>
								<TruncatedValue value={String((outputHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<McpToolCall_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No MCP tool call observations.'
				id='McpToolCall_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
