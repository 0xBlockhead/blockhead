<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpCanister>, 'prefetched'> = $props()

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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					canisterId: selection.entitySelector.canisterId,
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

			{#snippet SectionIcpCanisterMethods({ id, label })}
				<IcpCanisterMethodsView
					selection={selection.$$methods}
					collapsible={false}
					title={label}
					emptyText='No methods.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpCanisterMetadata({ id, label })}
				<IcpCanisterMetadataEntriesView
					selection={selection.$$metadata}
					collapsible={false}
					title={label}
					emptyText='No metadata.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpCanisterLogs({ id, label })}
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

			{#snippet SectionIcpCanisterCertifiedStates({ id, label })}
				<IcpCertifiedStatesView
					selection={selection.$$certifiedStates}
					collapsible={false}
					title={label}
					emptyText='No certified states.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpCanisterRequestStatuses({ id, label })}
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

			{#snippet SectionIcpCanisterTimestamps({ id, label })}
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
