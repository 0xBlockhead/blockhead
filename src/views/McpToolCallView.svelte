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
		sources: [
			Source.McpDeclared_Protocol,
		],
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
		<ResourceBoundary resource={mcpToolCall}>
			{#snippet Pending()}
				{[String((pendingEntity.callId) ?? '')].filter(Boolean).join(' ') || title || 'mcp tool call'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.callId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mcpToolCall}>
			{#snippet Pending()}
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
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpToolCall}>
			{#snippet Pending()}
				{@const startedAt0 = pendingEntity.startedAt}
				{#if startedAt0 !== undefined && startedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startedAt0)} />
					</span>
				{/if}
			{/snippet}

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
								fields: {
									callId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const callId = pendingEntity.callId}
							{#if callId !== undefined && callId !== null}
								{String((callId) ?? '')}
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

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
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startedAt = pendingEntity.startedAt}
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
					{@const completedAt = pendingEntity.completedAt}
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
							inputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputHashAlgorithm = pendingEntity.inputHashAlgorithm}
					{#if inputHashAlgorithm !== undefined && inputHashAlgorithm !== null}
						<div>
							<dt>input hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((inputHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							inputHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputHash = pendingEntity.inputHash}
					{#if inputHash !== undefined && inputHash !== null}
						<div>
							<dt>input hash</dt>
							<dd>
								<TruncatedValue value={String((inputHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							outputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputHashAlgorithm = pendingEntity.outputHashAlgorithm}
					{#if outputHashAlgorithm !== undefined && outputHashAlgorithm !== null}
						<div>
							<dt>output hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((outputHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							outputHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputHash = pendingEntity.outputHash}
					{#if outputHash !== undefined && outputHash !== null}
						<div>
							<dt>output hash</dt>
							<dd>
								<TruncatedValue value={String((outputHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
