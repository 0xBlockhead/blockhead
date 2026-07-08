<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.McpServer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.McpServer>>
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
	const mcpServer = $derived(selection({
		sources: [
			Source.Eip8004Scan_Rest,
			Source.McpDeclared_Protocol,
		],
		fields: {
			transportKind: true,
			endpointUrl: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.serverKey ?? prefetched.serverKey) ?? '')].filter(Boolean).join(' ') || 'mcp server')
	const viewDomId = $derived('mcp-server-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import McpToolsView from '$/views/McpToolsView.svelte'
	import McpResourcesView from '$/views/McpResourcesView.svelte'
	import McpResourceTemplatesView from '$/views/McpResourceTemplatesView.svelte'
	import McpPromptsView from '$/views/McpPromptsView.svelte'
	import McpServer_TimestampsView from '$/views/McpServer_TimestampsView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
</script>


<EntityView
	entityType={EntityType.McpServer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mcpServer}>
			{#snippet Pending()}
				{[String((selection.entitySelector.serverKey ?? prefetched.serverKey) ?? '')].filter(Boolean).join(' ') || title || 'mcp server'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.serverKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mcpServer}>
			{#snippet Pending()}
				{[String((prefetched.transportKind) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.serverKey ?? prefetched.serverKey) ?? '')].filter(Boolean).join(' ') || title || 'mcp server'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transportKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.serverKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpServer}>
			{#snippet Pending()}
				{@const endpointUrl0 = prefetched.endpointUrl}
				{#if endpointUrl0 !== undefined && endpointUrl0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(endpointUrl0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpointUrl0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const endpointUrl0 = resolvedEntity.endpointUrl}
				{#if endpointUrl0 !== undefined && endpointUrl0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(endpointUrl0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpointUrl0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>server key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									serverKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const serverKey = selection.entitySelector.serverKey ?? prefetched.serverKey}
							{#if serverKey !== undefined && serverKey !== null}
								{String((serverKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const serverKey = resolvedEntity.serverKey}
							{#if serverKey !== undefined && serverKey !== null}
								{String((serverKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null && blockheadSource[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$packageVersion}
			>
				{#snippet children(mcpServerPackageVersion)}
					{#if mcpServerPackageVersion != null && mcpServerPackageVersion[EntityMetaKey.Selector] != null}
						<div>
							<dt>package version</dt>
							<dd>
								<McpServerPackageVersionView
									selection={select(EntityType.McpServerPackageVersion, mcpServerPackageVersion[EntityMetaKey.Selector])}
									prefetched={mcpServerPackageVersion}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transportKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transportKind = prefetched.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind = resolvedEntity.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endpointUrl = prefetched.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpointUrl = resolvedEntity.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<McpToolsView
				selection={selection.$$tools}
				title='tools'
				emptyText='No MCP tools.'
				id='McpToolsView-tools'
			/>

			<McpResourcesView
				selection={selection.$$resources}
				title='resources'
				emptyText='No MCP resources.'
				id='McpResourcesView-resources'
			/>

			<McpResourceTemplatesView
				selection={selection.$$resourceTemplates}
				title='resource templates'
				emptyText='No MCP resource templates.'
				id='McpResourceTemplatesView-resource-templates'
			/>

			<McpPromptsView
				selection={selection.$$prompts}
				title='prompts'
				emptyText='No MCP prompts.'
				id='McpPromptsView-prompts'
			/>

			<McpServer_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No MCP server observations.'
				id='McpServer_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
