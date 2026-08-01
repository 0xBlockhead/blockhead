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
	}: EntitySelectionViewProps<EntityType.IcpNetwork> = $props()

	const viewDomId = $derived('icp-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import IcpSubnetsView from '$/views/IcpSubnetsView.svelte'
	import IcpCanistersView from '$/views/IcpCanistersView.svelte'
	import IcpLedgerCanistersView from '$/views/IcpLedgerCanistersView.svelte'
	import IcpRequestStatusesView from '$/views/IcpRequestStatusesView.svelte'
	import IcpNetwork_TimestampsView from '$/views/IcpNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'ICP network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-icp-subnets'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'icp-subnet-list',
						label: 'Subnets',
					},
				]
			}
			data-card
			class='network-view-collapsible-subnets'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Subnets</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionIcpSubnetList({ id, label })}
				<IcpSubnetsView
					selection={selection.$$subnets}
					collapsible={false}
					title={label}
					emptyText='No ICP subnets.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-icp-canisters'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'icp-canister-list',
						label: 'Canisters',
					},
					{
						id: 'icp-ledger-canisters',
						label: 'Ledger canisters',
					},
				]
			}
			data-card
			class='network-view-collapsible-canisters'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Canisters</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionIcpCanisterList({ id, label })}
				<IcpCanistersView
					selection={selection.$$canisters}
					collapsible={false}
					title={label}
					emptyText='No ICP canisters.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpLedgerCanisters({ id, label })}
				<IcpLedgerCanistersView
					selection={selection.$$ledgerCanisters}
					collapsible={false}
					title={label}
					emptyText='No ICP ledger canisters.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-icp-requests'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'icp-request-statuses',
						label: 'Request statuses',
					},
				]
			}
			data-card
			class='network-view-collapsible-request-statuses'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Request statuses</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionIcpRequestStatuses({ id, label })}
				<IcpRequestStatusesView
					selection={selection.$$requestStatuses}
					collapsible={false}
					title={label}
					emptyText='No ICP request statuses.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-icp-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'icp-network-observations',
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

			{#snippet SectionIcpNetworkObservations({ id, label })}
				<IcpNetwork_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No ICP network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
