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
			selection: RegisteredEntityProxyResource<EntityType.StellarNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.StellarNetwork>>
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
	const stellarNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			passphrase: true,
		},
	}))
	const titleFallback = $derived('stellar network')
	const viewDomId = $derived('stellar-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import StellarNetwork_TimestampsView from '$/views/StellarNetwork_TimestampsView.svelte'
	import StellarLedgersView from '$/views/StellarLedgersView.svelte'
	import StellarTransactionsView from '$/views/StellarTransactionsView.svelte'
	import StellarOperationsView from '$/views/StellarOperationsView.svelte'
	import StellarAccountsView from '$/views/StellarAccountsView.svelte'
	import StellarAssetsView from '$/views/StellarAssetsView.svelte'
	import StellarClaimableBalancesView from '$/views/StellarClaimableBalancesView.svelte'
	import StellarLiquidityPoolsView from '$/views/StellarLiquidityPoolsView.svelte'
	import StellarOffersView from '$/views/StellarOffersView.svelte'
	import StellarTradesView from '$/views/StellarTradesView.svelte'
	import SorobanContractsView from '$/views/SorobanContractsView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarNetwork}
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
		{:else}
			<ResourceBoundary resource={stellarNetwork}>
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
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.passphrase) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={stellarNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.passphrase) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							passphrase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const passphrase = resolvedEntity.passphrase}
					{#if passphrase !== undefined && passphrase !== null}
						<div>
							<dt>passphrase</dt>
							<dd>
								{String((passphrase) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-chain-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-chain-observations',
							label: 'Observations',
						},
						{
							id: 'stellar-chain-ledgers',
							label: 'Ledgers',
						},
						{
							id: 'stellar-chain-transactions',
							label: 'Transactions',
						},
						{
							id: 'stellar-chain-operations',
							label: 'Operations',
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

				{#snippet SectionStellarChainObservations({ id, label, open })}
					<StellarNetwork_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar network observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarChainLedgers({ id, label, open })}
					<StellarLedgersView
						selection={selection.$$ledgers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar ledgers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarChainTransactions({ id, label, open })}
					<StellarTransactionsView
						selection={selection.$$transactions}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar transactions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarChainOperations({ id, label, open })}
					<StellarOperationsView
						selection={selection.$$operations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar operations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-accounts-assets'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-accounts',
							label: 'Accounts',
						},
						{
							id: 'stellar-assets',
							label: 'Assets',
						},
						{
							id: 'stellar-claimables',
							label: 'Claimable balances',
						},
					]
				}
				data-card
				class='network-view-collapsible-accounts-assets'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Accounts and assets</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStellarAccounts({ id, label, open })}
					<StellarAccountsView
						selection={selection.$$accounts}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar accounts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarAssets({ id, label, open })}
					<StellarAssetsView
						selection={selection.$$assets}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar assets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarClaimables({ id, label, open })}
					<StellarClaimableBalancesView
						selection={selection.$$claimableBalances}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar claimable balances.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-liquidity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-liquidity-pools',
							label: 'Liquidity pools',
						},
						{
							id: 'stellar-offers',
							label: 'Offers',
						},
						{
							id: 'stellar-trades',
							label: 'Trades',
						},
					]
				}
				data-card
				class='network-view-collapsible-liquidity'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Liquidity, offers, and trades</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStellarLiquidityPools({ id, label, open })}
					<StellarLiquidityPoolsView
						selection={selection.$$liquidityPools}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar liquidity pools.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarOffers({ id, label, open })}
					<StellarOffersView
						selection={selection.$$offers}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar offers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionStellarTrades({ id, label, open })}
					<StellarTradesView
						selection={selection.$$trades}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Stellar trades.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-stellar-contracts'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'stellar-soroban-contracts',
							label: 'Contracts',
						},
					]
				}
				data-card
				class='network-view-collapsible-contracts'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Soroban contracts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionStellarSorobanContracts({ id, label, open })}
					<SorobanContractsView
						selection={selection.$$contracts}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Soroban contracts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
