<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalAgentNetwork> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'global agent network'
	const viewDomId = $derived('-global-agent-network-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global agent network
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network ID</dt>
				<dd>
					{pendingEntity.networkId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolKind = entity.protocolKind}
					{#if protocolKind != null}
						<div>
							<dt>protocol kind</dt>
							<dd>
								{protocolKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					open={open}
					title={label}
					emptyText='No ACP programs.'
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
					open={open}
					title={label}
					emptyText='No A2A cards.'
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
					open={open}
					title={label}
					emptyText='No MCP servers.'
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
					open={open}
					title={label}
					emptyText='No EIP-8004 registrations.'
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
					open={open}
					title={label}
					emptyText='No Blockhead agent profiles.'
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
					open={open}
					title={label}
					emptyText='No agent network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
