<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.McpToolCall_Timestamp>, 'prefetched'> = $props()

	const toolCall = $derived(selection.entitySelector.$toolCall)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.McpDeclared_Protocol,
		],
	}))
	const mcpToolCallTimestamp = $derived(viewSelection({
		fields: {
			status: true,
			isError: true,
			error: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import McpToolCallView from '$/views/McpToolCallView.svelte'
</script>


<EntityView
	entityType={EntityType.McpToolCall_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/mcp/server/[serverKey=stringSegment]/(mcpServer)/tool-call/[callId=stringSegment]/(mcpToolCall)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					serverKey: toolCall.$server.serverKey,
					callId: toolCall.callId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mcpToolCallTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.isError ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpToolCallTimestamp}>
			{#snippet children(entity)}
				{@const error = entity.error}
				{#if error != null}
					<span data-text="muted">
						{error}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>tool call</dt>
				<dd>
					<McpToolCallView
						selection={select(EntityType.McpToolCall, selection.entitySelector.$toolCall)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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
				resource={mcpToolCallTimestamp}
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
				resource={mcpToolCallTimestamp}
			>
				{#snippet children(entity)}
					{@const isError = entity.isError}
					{#if isError != null}
						<div>
							<dt>is error</dt>
							<dd>
								{isError ? 'Yes' : 'No'}
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

			<ResourceBoundary
				resource={mcpToolCallTimestamp}
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
	{/snippet}
</EntityView>
