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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadAgentConnection_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.Local_Internal,
			Source.McpDeclared_Protocol,
			Source.OpenAI_Rest,
		],
	}))
	const blockheadAgentConnectionTimestamp = $derived(viewSelection({
		fields: {
			health: true,
			latencyMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadAgentConnectionView from '$/views/BlockheadAgentConnectionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConnection_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/agent/connection/[connectionId=stringSegment]/(blockheadAgentConnection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					connectionId: selection.entitySelector.$connection.connectionId,
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
		<ResourceBoundary resource={blockheadAgentConnectionTimestamp}>
			{#snippet children(entity)}
				{(entity.health ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAgentConnectionTimestamp}>
			{#snippet children(entity)}
				{@const latencyMs = entity.latencyMs}
				{#if latencyMs != null}
					<span data-text="muted">
						<NumberValue
							value={latencyMs}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection</dt>
				<dd>
					<BlockheadAgentConnectionView
						selection={select(EntityType.BlockheadAgentConnection, selection.entitySelector.$connection)}
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
				resource={blockheadAgentConnectionTimestamp}
			>
				{#snippet children(entity)}
					{@const health = entity.health}
					{#if health != null}
						<div>
							<dt>health</dt>
							<dd>
								{health}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadAgentConnectionTimestamp}
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
				resource={
					viewSelection({
						fields: {
							statusCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statusCode = entity.statusCode}
					{#if statusCode != null}
						<div>
							<dt>status code</dt>
							<dd>
								<NumberValue
									value={statusCode}
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
	{/snippet}
</EntityView>
