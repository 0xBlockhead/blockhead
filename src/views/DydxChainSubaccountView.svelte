<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.DydxChainSubaccount>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.DydxChainSubaccount>>
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
	const dydxChainSubaccount = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('dydx chain subaccount')
	const viewDomId = $derived('dydx-chain-subaccount-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DydxChainNetworkView from '$/views/DydxChainNetworkView.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
	import DydxChainPerpetualPosition_TimestampsView from '$/views/DydxChainPerpetualPosition_TimestampsView.svelte'
	import DydxChainOrdersView from '$/views/DydxChainOrdersView.svelte'
	import DydxChainSubaccount_TimestampsView from '$/views/DydxChainSubaccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainSubaccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						href={
						(selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$account.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$account.$network.caip2) ?? ''),
						}) : selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$account.address ?? ''),
							network: String(selection.entitySelector.$account.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={dydxChainSubaccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						href={
						(selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$account.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$account.$network.caip2) ?? ''),
						}) : selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$account.address ?? ''),
							network: String(selection.entitySelector.$account.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const subaccountNumber0 = pendingEntity.subaccountNumber}
					{#if subaccountNumber0 !== undefined && subaccountNumber0 !== null}
						<NumberValue
							value={subaccountNumber0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={dydxChainSubaccount}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subaccountNumber0 = resolvedEntity.subaccountNumber}
					{#if subaccountNumber0 !== undefined && subaccountNumber0 !== null}
						<NumberValue
							value={subaccountNumber0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<DydxChainNetworkView
						selection={select(EntityType.DydxChainNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$account.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$account.$network.caip2) ?? ''),
							}) : selection.entitySelector.$account.address !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$account.address ?? ''),
								network: String(selection.entitySelector.$account.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>subaccount number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									subaccountNumber: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subaccountNumber = resolvedEntity.subaccountNumber}
							{#if subaccountNumber !== undefined && subaccountNumber !== null}
								<NumberValue
									value={subaccountNumber}
								/>
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

				{#snippet SectionDydxSubaccountPositions({ id, label, open })}
					<DydxChainPerpetualPosition_TimestampsView
						selection={selection.$$positions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No dYdX position observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionDydxSubaccountOrders({ id, label, open })}
					<DydxChainOrdersView
						selection={selection.$$orders}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No dYdX orders.'
						open={open}
						title={label}
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

				{#snippet SectionDydxSubaccountTimestamps({ id, label, open })}
					<DydxChainSubaccount_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No dYdX subaccount observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
