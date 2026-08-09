<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalAgentNetwork>, 'prefetched'> = $props()

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
	href={
		href === undefined ?
			resolve(
				'/~/agent-network/[networkId=stringSegment]',
				{
					networkId: selection.entitySelector.networkId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network ID</dt>
				<dd>
					{selection.entitySelector.networkId}
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

	{#snippet Details()}
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

			{#snippet SectionAgentAcpPrograms({ id, label })}
				<AcpAgentProgramsView
					selection={selection.$$acpPrograms}
					collapsible={false}
					title={label}
					emptyText='No ACP programs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAgentA2aCards({ id, label })}
				<A2aAgentCardsView
					selection={selection.$$a2aCards}
					collapsible={false}
					title={label}
					emptyText='No A2A cards.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAgentMcpServers({ id, label })}
				<McpServersView
					selection={selection.$$mcpServers}
					collapsible={false}
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

			{#snippet SectionAgentEip8004({ id, label })}
				<Eip8004AgentRegistrationsView
					selection={selection.$$eip8004Registrations}
					collapsible={false}
					title={label}
					emptyText='No EIP-8004 registrations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAgentBlockheadProfiles({ id, label })}
				<BlockheadAgentProfilesView
					selection={selection.$$blockheadProfiles}
					collapsible={false}
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

			{#snippet SectionAgentHubObservations({ id, label })}
				<GlobalAgentNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No agent network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
