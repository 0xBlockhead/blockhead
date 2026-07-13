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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanister>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpCanister>>
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
	const icpCanister = $derived(selection({}))
	const titleFallback = $derived('ICP canister')
	const viewDomId = $derived('icp-canister-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IcpNetworkView from '$/views/IcpNetworkView.svelte'
	import IcpCanisterMethodsView from '$/views/IcpCanisterMethodsView.svelte'
	import IcpCanisterMetadataEntriesView from '$/views/IcpCanisterMetadataEntriesView.svelte'
	import IcpCanisterLog_TimestampsView from '$/views/IcpCanisterLog_TimestampsView.svelte'
	import IcpCertifiedStatesView from '$/views/IcpCertifiedStatesView.svelte'
	import IcpRequestStatusesView from '$/views/IcpRequestStatusesView.svelte'
	import IcpCanister_TimestampsView from '$/views/IcpCanister_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanister}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpCanister}>
			{#snippet Pending()}
				{title || 'ICP canister'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<IcpNetworkView
						selection={select(EntityType.IcpNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>canister ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									canisterId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const canisterId = pendingEntity.canisterId}
							{#if canisterId !== undefined && canisterId !== null}
								{String((canisterId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const canisterId = resolvedEntity.canisterId}
							{#if canisterId !== undefined && canisterId !== null}
								{String((canisterId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-icp-canister-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'icp-canister-methods',
							label: 'Methods',
						},
						{
							id: 'icp-canister-metadata',
							label: 'Metadata',
						},
						{
							id: 'icp-canister-logs',
							label: 'Logs',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionIcpCanisterMethods({ id, label, open })}
					<IcpCanisterMethodsView
						selection={selection.$$methods}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No methods.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionIcpCanisterMetadata({ id, label, open })}
					<IcpCanisterMetadataEntriesView
						selection={selection.$$metadata}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No metadata.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionIcpCanisterLogs({ id, label, open })}
					<IcpCanisterLog_TimestampsView
						selection={selection.$$logs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No logs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-icp-canister-related'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'icp-canister-certified-states',
							label: 'Certified States',
						},
						{
							id: 'icp-canister-request-statuses',
							label: 'Request Statuses',
						},
					]
				}
				data-card
				class='network-view-collapsible-related'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Related</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionIcpCanisterCertifiedStates({ id, label, open })}
					<IcpCertifiedStatesView
						selection={selection.$$certifiedStates}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No certified states.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionIcpCanisterRequestStatuses({ id, label, open })}
					<IcpRequestStatusesView
						selection={selection.$$requestStatuses}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No request statuses.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-icp-canister-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'icp-canister-timestamps',
							label: 'Timestamps',
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

				{#snippet SectionIcpCanisterTimestamps({ id, label, open })}
					<IcpCanister_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
