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
	}: EntitySelectionViewProps<EntityType.IcpSubnet> = $props()

	const viewDomId = $derived('icp-subnet-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IcpNetworkView from '$/views/IcpNetworkView.svelte'
	import IcpSubnetCanisterRange_TimestampsView from '$/views/IcpSubnetCanisterRange_TimestampsView.svelte'
	import IcpCanistersView from '$/views/IcpCanistersView.svelte'
	import IcpSubnet_TimestampsView from '$/views/IcpSubnet_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpSubnet}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'ICP subnet'}
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
				<dt>subnet ID</dt>
				<dd>
					{selection.entitySelector.subnetId}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-icp-subnet-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'icp-subnet-canister-ranges',
						label: 'Canister Ranges',
					},
					{
						id: 'icp-subnet-canisters',
						label: 'Canisters',
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

			{#snippet SectionIcpSubnetCanisterRanges({ id, label, open })}
				<IcpSubnetCanisterRange_TimestampsView
					selection={selection.$$canisterRanges}
					collapsible={false}
					title={label}
					emptyText='No canister ranges.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpSubnetCanisters({ id, label, open })}
				<IcpCanistersView
					selection={selection.$$canisters}
					collapsible={false}
					title={label}
					emptyText='No canisters.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-icp-subnet-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'icp-subnet-timestamps',
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

			{#snippet SectionIcpSubnetTimestamps({ id, label, open })}
				<IcpSubnet_TimestampsView
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
