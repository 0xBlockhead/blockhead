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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.DydxChainSubaccount>, 'prefetched'> = $props()

	const viewDomId = $derived('dydx-chain-subaccount-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import DydxChainNetworkView from '$/views/DydxChainNetworkView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import DydxChainPerpetualPosition_TimestampsView from '$/views/DydxChainPerpetualPosition_TimestampsView.svelte'
	import DydxChainOrdersView from '$/views/DydxChainOrdersView.svelte'
	import DydxChainSubaccount_TimestampsView from '$/views/DydxChainSubaccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainSubaccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'dydx chain subaccount'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<CosmosAccountView
			selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.subaccountNumber}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<DydxChainNetworkView
						selection={select(EntityType.DydxChainNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>subaccount number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.subaccountNumber}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-dydx-subaccount-trading'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-subaccount-positions',
						label: 'Positions',
					},
					{
						id: 'dydx-subaccount-orders',
						label: 'Orders',
					},
				]
			}
			data-card
			class='network-view-collapsible-trading'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Trading</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionDydxSubaccountPositions({ id, label })}
				<DydxChainPerpetualPosition_TimestampsView
					selection={selection.$$positions}
					collapsible={false}
					title={label}
					emptyText='No dYdX position observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionDydxSubaccountOrders({ id, label })}
				<DydxChainOrdersView
					selection={selection.$$orders}
					collapsible={false}
					title={label}
					emptyText='No dYdX orders.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-dydx-subaccount-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'dydx-subaccount-timestamps',
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

			{#snippet SectionDydxSubaccountTimestamps({ id, label })}
				<DydxChainSubaccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No dYdX subaccount observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
