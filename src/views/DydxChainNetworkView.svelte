<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DydxChainNetwork>>
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
	const dydxChainNetwork = $derived(selection({
		sources: [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
	}))
	const titleFallback = $derived('dydx chain network')
	const viewDomId = $derived('dydx-chain-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dydxChainNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
							network: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Chain activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDydxChainObservations({ id, label, open })}
					<DydxChainNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No dYdX network observations.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Markets and trading</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDydxMarkets({ id, label, open })}
					<DydxChainMarketsView
						selection={
							selection.$$markets({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No dYdX markets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionDydxOrders({ id, label, open })}
					<DydxChainOrdersView
						selection={
							selection.$$orders({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No dYdX orders.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionDydxPositions({ id, label, open })}
					<DydxChainPerpetualPosition_TimestampsView
						selection={
							selection.$$positions({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No dYdX position observations.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionDydxSubaccounts({ id, label, open })}
					<DydxChainSubaccountsView
						selection={
							selection.$$subaccounts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No dYdX subaccounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
