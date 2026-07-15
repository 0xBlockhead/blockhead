<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.McpServer>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.McpServer>>
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
	const titleFallback = $derived([String((pendingEntity.serverKey) ?? '')].filter(Boolean).join(' ') || 'mcp server')
	const viewDomId = $derived('mcp-server-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
				{[String((pendingEntity.serverKey) ?? '')].filter(Boolean).join(' ') || title || 'mcp server'}
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
				{[String((pendingEntity.transportKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.serverKey) ?? '')].filter(Boolean).join(' ') || title || 'mcp server'}
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
				{@const endpointUrl0 = pendingEntity.endpointUrl}
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
							{@const serverKey = pendingEntity.serverKey}
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
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadSource)}
					{#if blockheadSource != null && blockheadSource[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source</dt>
							<dd>
								<BlockheadSourceView
									selection={select(EntityType.BlockheadSource, blockheadSource[EntityMetaKey.Selector])}
									prefetched={blockheadSource}
									href={
										(blockheadSource[EntityMetaKey.Selector].id !== undefined ? resolve('/~/manage/source/[sourceId=stringSegment]', {
											sourceId: String(blockheadSource[EntityMetaKey.Selector].id ?? ''),
										}) : undefined)
									}
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
				{#snippet Pending()}{/snippet}

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
					{@const transportKind = pendingEntity.transportKind}
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
					{@const endpointUrl = pendingEntity.endpointUrl}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Capabilities</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMcpTools({ id, label, open })}
					<McpToolsView
						selection={
							selection.$$tools({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No MCP tools.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMcpPrompts({ id, label, open })}
					<McpPromptsView
						selection={
							selection.$$prompts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No MCP prompts.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Resources</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMcpResourceList({ id, label, open })}
					<McpResourcesView
						selection={
							selection.$$resources({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No MCP resources.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionMcpResourceTemplates({ id, label, open })}
					<McpResourceTemplatesView
						selection={
							selection.$$resourceTemplates({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No MCP resource templates.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionMcpServerObservations({ id, label, open })}
					<McpServer_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No MCP server observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
