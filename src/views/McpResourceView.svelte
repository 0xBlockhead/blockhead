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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.McpResource> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.McpDeclared_Protocol,
		],
	}))
	const mcpResource = $derived(viewSelection({
		fields: {
			title: true,
			mimeType: true,
			name: true,
			subscribed: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || [(prefetched.name ?? ''), selection.entitySelector.uri].filter(Boolean).join(' ') || 'mcp resource')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import McpResourceContent_TimestampsView from '$/views/McpResourceContent_TimestampsView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
</script>


<EntityView
	entityType={EntityType.McpResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/mcp/server/[serverKey=stringSegment]/(mcpServer)/resource/[uri=absoluteUrl]',
				{
					serverKey: selection.entitySelector.$server.serverKey,
					uri: encodeURIComponent(selection.entitySelector.uri),
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
		<ResourceBoundary resource={mcpResource}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mcpResource}>
			{#snippet children(entity)}
				{(entity.mimeType ?? '') || (entity.title ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpResource}>
			{#snippet children(entity)}
				{@const subscribed = entity.subscribed}
				{#if subscribed != null}
					<span data-text="muted">
						{subscribed ? 'Yes' : 'No'}
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
				<dt>URI</dt>
				<dd>
					<a
						href={selection.entitySelector.uri}
						target="_blank"
						rel="noreferrer noopener"
					>
						<TruncatedValue value={selection.entitySelector.uri} />
					</a>
				</dd>
			</div>

			<ResourceBoundary
				resource={mcpResource}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpResource}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpResource}
			>
				{#snippet children(entity)}
					{@const mimeType = entity.mimeType}
					{#if mimeType != null}
						<div>
							<dt>mime type</dt>
							<dd>
								{mimeType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpResource}
			>
				{#snippet children(entity)}
					{@const subscribed = entity.subscribed}
					{#if subscribed != null}
						<div>
							<dt>subscribed</dt>
							<dd>
								{subscribed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const contentTimestampsResource = selection.$$contentTimestamps}
		<ResourceBoundary
			resource={contentTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<McpResourceContent_TimestampsView
						selection={contentTimestampsResource}
						countResource={contentTimestampsResource.count}
						title='content timestamps'
						id='content-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
