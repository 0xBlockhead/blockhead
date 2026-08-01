<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.McpServer>, 'prefetched'> = $props()

	const mcpServer = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.McpDeclared_Protocol,
		],
	})({
		fields: {
			transportKind: true,
			endpointUrl: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.serverKey || 'mcp server')
	const viewDomId = $derived('mcp-server-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
	import McpToolsView from '$/views/McpToolsView.svelte'
	import McpPromptsView from '$/views/McpPromptsView.svelte'
	import McpResourcesView from '$/views/McpResourcesView.svelte'
	import McpResourceTemplatesView from '$/views/McpResourceTemplatesView.svelte'
	import McpServer_TimestampsView from '$/views/McpServer_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.McpServer}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={mcpServer}>
			{#snippet children(entity)}
				{(entity.transportKind ?? '') || selection.entitySelector.serverKey || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mcpServer}>
			{#snippet children(entity)}
				{@const endpointUrl = entity.endpointUrl}
				{#if endpointUrl != null}
					<span data-text="muted">
						<a
							href={endpointUrl}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={endpointUrl} />
						</a>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>server key</dt>
				<dd>
					{selection.entitySelector.serverKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$source}
			>
				{#snippet children(blockheadSource)}
					{#if blockheadSource != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									layout={EntityLayout.Value}
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
					{#if mcpServerPackageVersion != null}
						<div>
							<dt>package version</dt>
							<dd>
								<McpServerPackageVersionView
									selection={select(EntityType.McpServerPackageVersion, mcpServerPackageVersion[EntityMetaKey.Selector])}
									prefetched={mcpServerPackageVersion}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServer}
			>
				{#snippet children(entity)}
					{@const transportKind = entity.transportKind}
					{#if transportKind != null}
						<div>
							<dt>transport kind</dt>
							<dd>
								{transportKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServer}
			>
				{#snippet children(entity)}
					{@const endpointUrl = entity.endpointUrl}
					{#if endpointUrl != null}
						<div>
							<dt>endpoint URL</dt>
							<dd>
								<a
									href={endpointUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpointUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-mcp-capabilities'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'mcp-tools',
						label: 'Tools',
					},
					{
						id: 'mcp-prompts',
						label: 'Prompts',
					},
				]
			}
			data-card
			class='network-view-collapsible-capabilities'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Capabilities</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMcpTools({ id, label })}
				<McpToolsView
					selection={selection.$$tools}
					collapsible={false}
					title={label}
					emptyText='No MCP tools.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMcpPrompts({ id, label })}
				<McpPromptsView
					selection={selection.$$prompts}
					collapsible={false}
					title={label}
					emptyText='No MCP prompts.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-mcp-resources'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'mcp-resource-list',
						label: 'Resources',
					},
					{
						id: 'mcp-resource-templates',
						label: 'Resource templates',
					},
				]
			}
			data-card
			class='network-view-collapsible-resources'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMcpResourceList({ id, label })}
				<McpResourcesView
					selection={selection.$$resources}
					collapsible={false}
					title={label}
					emptyText='No MCP resources.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMcpResourceTemplates({ id, label })}
				<McpResourceTemplatesView
					selection={selection.$$resourceTemplates}
					collapsible={false}
					title={label}
					emptyText='No MCP resource templates.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-mcp-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'mcp-server-observations',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMcpServerObservations({ id, label })}
				<McpServer_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No MCP server observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
