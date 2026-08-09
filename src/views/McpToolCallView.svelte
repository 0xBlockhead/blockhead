<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.McpToolCall>, 'prefetched'> = $props()

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
	title={title ?? (selection.entitySelector.callId || 'mcp tool call')}
	href={
		href === undefined ?
			resolve(
				'/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool-call/[callId=stringSegment]',
				{
					serverKey: selection.entitySelector.$server.serverKey,
					callId: selection.entitySelector.callId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$tool}
		>
			{#snippet children(mcpTool)}
				{#if mcpTool != null}
					<McpToolView
						selection={select(EntityType.McpTool, mcpTool[EntityMetaKey.Selector])}
						prefetched={mcpTool}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpToolCall}>
			{#snippet children(entity)}
				{@const startedAt = entity.startedAt}
				{#if startedAt != null}
					<span data-text="muted">
						<Timestamp timestamp={startedAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>server</dt>
				<dd>
					<McpServerView
						selection={select(EntityType.McpServer, selection.entitySelector.$server)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>call ID</dt>
				<dd>
					{selection.entitySelector.callId}
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
								<Timestamp timestamp={startedAt} />
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
								<Timestamp timestamp={completedAt} />
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
								{inputHashAlgorithm}
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
								<TruncatedValue value={inputHash} />
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
								{outputHashAlgorithm}
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
								<TruncatedValue value={outputHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<McpToolCall_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
