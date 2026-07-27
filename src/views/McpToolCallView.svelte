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
	}: EntitySelectionViewProps<EntityType.McpToolCall> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.McpDeclared_Protocol,
		],
	}))
	const mcpToolCall = $derived(viewSelection({
		fields: {
			startedAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.callId ?? '') || 'mcp tool call')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.callId ?? '') || 'mcp tool call'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$tool}
		>
			{#snippet children(mcpTool)}
				{#if mcpTool != null}
					<McpToolView
						selection={select(EntityType.McpTool, mcpTool[EntityMetaKey.Selector])}
						prefetched={mcpTool}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpToolCall}>
			{#snippet children(entity)}
				{@const startedAt0 = entity.startedAt}
				{#if startedAt0 != null}
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
						selection={select(EntityType.McpServer, selection.entitySelector.$server)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>call ID</dt>
				<dd>
					{pendingEntity.callId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$tool}
			>
				{#snippet children(mcpTool)}
					{#if mcpTool != null}
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
				resource={mcpToolCall}
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
							inputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputHashAlgorithm = entity.inputHashAlgorithm}
					{#if inputHashAlgorithm != null}
						<div>
							<dt>input hash algorithm</dt>
							<dd>
								<TruncatedValue value={inputHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							inputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputHash = entity.inputHash}
					{#if inputHash != null}
						<div>
							<dt>input hash</dt>
							<dd>
								<TruncatedValue value={String(inputHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputHashAlgorithm = entity.outputHashAlgorithm}
					{#if outputHashAlgorithm != null}
						<div>
							<dt>output hash algorithm</dt>
							<dd>
								<TruncatedValue value={outputHashAlgorithm} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputHash = entity.outputHash}
					{#if outputHash != null}
						<div>
							<dt>output hash</dt>
							<dd>
								<TruncatedValue value={String(outputHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const mcpToolCallMcpToolCallTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={mcpToolCallMcpToolCallTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<McpToolCall_TimestampsView
						selection={mcpToolCallMcpToolCallTimestampsViewTimestampsResource}
						countResource={mcpToolCallMcpToolCallTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
