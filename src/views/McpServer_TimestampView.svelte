<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.McpServer_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.McpDeclared_Protocol,
		],
	}))
	const mcpServerTimestamp = $derived(viewSelection({
		fields: {
			health: true,
			error: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
</script>


<EntityView
	entityType={EntityType.McpServer_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/mcp/server/[serverKey=stringSegment]/(mcpServer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					serverKey: selection.entitySelector.$server.serverKey,
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
		<ResourceBoundary resource={mcpServerTimestamp}>
			{#snippet children(entity)}
				{(entity.health ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpServerTimestamp}>
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
				<dt>server</dt>
				<dd>
					<McpServerView
						selection={select(EntityType.McpServer, selection.entitySelector.$server)}
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
				resource={mcpServerTimestamp}
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{protocolVersion}
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
							toolCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toolCount = entity.toolCount}
					{#if toolCount != null}
						<div>
							<dt>tool count</dt>
							<dd>
								<NumberValue
									value={toolCount}
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
							resourceCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resourceCount = entity.resourceCount}
					{#if resourceCount != null}
						<div>
							<dt>resource count</dt>
							<dd>
								<NumberValue
									value={resourceCount}
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
							promptCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const promptCount = entity.promptCount}
					{#if promptCount != null}
						<div>
							<dt>prompt count</dt>
							<dd>
								<NumberValue
									value={promptCount}
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
							nextCursor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextCursor = entity.nextCursor}
					{#if nextCursor != null}
						<div>
							<dt>next cursor</dt>
							<dd>
								{nextCursor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServerTimestamp}
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
							toolsListChanged: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toolsListChanged = entity.toolsListChanged}
					{#if toolsListChanged != null}
						<div>
							<dt>tools list changed</dt>
							<dd>
								{toolsListChanged ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							resourcesListChanged: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resourcesListChanged = entity.resourcesListChanged}
					{#if resourcesListChanged != null}
						<div>
							<dt>resources list changed</dt>
							<dd>
								{resourcesListChanged ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							resourcesSubscribe: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resourcesSubscribe = entity.resourcesSubscribe}
					{#if resourcesSubscribe != null}
						<div>
							<dt>resources subscribe</dt>
							<dd>
								{resourcesSubscribe ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							promptsListChanged: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const promptsListChanged = entity.promptsListChanged}
					{#if promptsListChanged != null}
						<div>
							<dt>prompts list changed</dt>
							<dd>
								{promptsListChanged ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
