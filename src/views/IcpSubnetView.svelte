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
	}: Omit<EntitySelectionViewProps<EntityType.IcpSubnet>, 'prefetched'> = $props()

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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					subnetId: selection.entitySelector.subnetId,
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

			{#snippet SectionIcpSubnetCanisterRanges({ id, label })}
				<IcpSubnetCanisterRange_TimestampsView
					selection={selection.$$canisterRanges}
					collapsible={false}
					title={label}
					emptyText='No canister ranges.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionIcpSubnetCanisters({ id, label })}
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

			{#snippet SectionIcpSubnetTimestamps({ id, label })}
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
