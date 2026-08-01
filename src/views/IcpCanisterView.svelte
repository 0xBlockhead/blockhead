<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IcpCanister> = $props()

	const viewDomId = $derived('icp-canister-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'ICP canister'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<IcpNetworkView
						selection={select(EntityType.IcpNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>canister ID</dt>
				<dd>
					{selection.entitySelector.canisterId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionIcpCanisterMethods({ id, label, open })}
				<IcpCanisterMethodsView
					selection={selection.$$methods}
					collapsible={false}
					title={label}
					emptyText='No methods.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpCanisterMetadata({ id, label, open })}
				<IcpCanisterMetadataEntriesView
					selection={selection.$$metadata}
					collapsible={false}
					title={label}
					emptyText='No metadata.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpCanisterLogs({ id, label, open })}
				<IcpCanisterLog_TimestampsView
					selection={selection.$$logs}
					collapsible={false}
					title={label}
					emptyText='No logs.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionIcpCanisterCertifiedStates({ id, label, open })}
				<IcpCertifiedStatesView
					selection={selection.$$certifiedStates}
					collapsible={false}
					title={label}
					emptyText='No certified states.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpCanisterRequestStatuses({ id, label, open })}
				<IcpRequestStatusesView
					selection={selection.$$requestStatuses}
					collapsible={false}
					title={label}
					emptyText='No request statuses.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionIcpCanisterTimestamps({ id, label, open })}
				<IcpCanister_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
