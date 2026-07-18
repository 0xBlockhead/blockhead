<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType._GlobalAgentNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalAgentNetwork>>
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
	const globalAgentNetwork = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('global agent network')
	const viewDomId = $derived('-global-agent-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AcpAgentProgramsView from '$/views/AcpAgentProgramsView.svelte'
	import A2aAgentCardsView from '$/views/A2aAgentCardsView.svelte'
	import McpServersView from '$/views/McpServersView.svelte'
	import Eip8004AgentRegistrationsView from '$/views/Eip8004AgentRegistrationsView.svelte'
	import BlockheadAgentProfilesView from '$/views/BlockheadAgentProfilesView.svelte'
	import GlobalAgentNetwork_TimestampsView from '$/views/_GlobalAgentNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAgentNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={globalAgentNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									networkId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const networkId = resolvedEntity.networkId}
							{#if networkId !== undefined && networkId !== null}
								{String((networkId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							protocolKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolKind = resolvedEntity.protocolKind}
					{#if protocolKind !== undefined && protocolKind !== null}
						<div>
							<dt>protocol kind</dt>
							<dd>
								{String((protocolKind) ?? '')}
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
				id={viewDomId + '-carousel-agent-protocols'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'agent-acp-programs',
							label: 'ACP programs',
						},
						{
							id: 'agent-a2a-cards',
							label: 'A2A cards',
						},
						{
							id: 'agent-mcp-servers',
							label: 'MCP servers',
						},
					]
				}
				data-card
				class='network-view-collapsible-agent-protocols'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Agent protocols</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAgentAcpPrograms({ id, label, open })}
					<AcpAgentProgramsView
						selection={selection.$$acpPrograms}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No ACP programs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAgentA2aCards({ id, label, open })}
					<A2aAgentCardsView
						selection={selection.$$a2aCards}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No A2A cards.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAgentMcpServers({ id, label, open })}
					<McpServersView
						selection={selection.$$mcpServers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No MCP servers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-agent-registrations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'agent-eip8004',
							label: 'EIP-8004 registrations',
						},
						{
							id: 'agent-blockhead-profiles',
							label: 'Blockhead profiles',
						},
					]
				}
				data-card
				class='network-view-collapsible-registrations'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Registrations and profiles</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAgentEip8004({ id, label, open })}
					<Eip8004AgentRegistrationsView
						selection={selection.$$eip8004Registrations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No EIP-8004 registrations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAgentBlockheadProfiles({ id, label, open })}
					<BlockheadAgentProfilesView
						selection={selection.$$blockheadProfiles}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Blockhead agent profiles.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-agent-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'agent-hub-observations',
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

				{#snippet SectionAgentHubObservations({ id, label, open })}
					<GlobalAgentNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No agent network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
