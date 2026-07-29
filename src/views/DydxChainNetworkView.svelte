<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntitySelectionViewProps<EntityType.DydxChainNetwork> = $props()

	const viewDomId = $derived('dydx-chain-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import DydxChainNetwork_TimestampsView from '$/views/DydxChainNetwork_TimestampsView.svelte'
	import DydxChainMarketsView from '$/views/DydxChainMarketsView.svelte'
	import DydxChainOrdersView from '$/views/DydxChainOrdersView.svelte'
	import DydxChainPerpetualPosition_TimestampsView from '$/views/DydxChainPerpetualPosition_TimestampsView.svelte'
	import DydxChainSubaccountsView from '$/views/DydxChainSubaccountsView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'dydx chain network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-dydx-chain-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-chain-observations',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-chain-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Chain activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDydxChainObservations({ id, label, open })}
				<DydxChainNetwork_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No dYdX network observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-dydx-markets-trading'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-markets',
						label: 'Markets',
					},
					{
						id: 'dydx-orders',
						label: 'Orders',
					},
					{
						id: 'dydx-positions',
						label: 'Positions',
					},
				]
			}
			data-card
			class='network-view-collapsible-markets-trading'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Markets and trading</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDydxMarkets({ id, label, open })}
				<DydxChainMarketsView
					selection={selection.$$markets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No dYdX markets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionDydxOrders({ id, label, open })}
				<DydxChainOrdersView
					selection={selection.$$orders}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No dYdX orders.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionDydxPositions({ id, label, open })}
				<DydxChainPerpetualPosition_TimestampsView
					selection={selection.$$positions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No dYdX position observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-dydx-accounts'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-subaccounts',
						label: 'Subaccounts',
					},
				]
			}
			data-card
			class='network-view-collapsible-accounts'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Accounts</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDydxSubaccounts({ id, label, open })}
				<DydxChainSubaccountsView
					selection={selection.$$subaccounts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No dYdX subaccounts.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
