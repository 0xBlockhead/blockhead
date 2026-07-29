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
	}: EntitySelectionViewProps<EntityType.StellarNetwork> = $props()

	const stellarNetwork = $derived(selection({
		fields: {
			passphrase: true,
		},
	}))
	const titleFallback = 'stellar network'
	const viewDomId = $derived('stellar-network-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
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

	{#snippet Value()}
		<ResourceBoundary resource={stellarNetwork}>
			{#snippet children(entity)}
				{(entity.passphrase ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
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

			<ResourceBoundary
				resource={stellarNetwork}
			>
				{#snippet children(entity)}
					{@const passphrase = entity.passphrase}
					{#if passphrase != null}
						<div>
							<dt>passphrase</dt>
							<dd>
								{passphrase}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					open={open}
					title={label}
					emptyText='No Stellar network observations.'
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
					open={open}
					title={label}
					emptyText='No Stellar ledgers.'
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
					open={open}
					title={label}
					emptyText='No Stellar transactions.'
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
					open={open}
					title={label}
					emptyText='No Stellar operations.'
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
					open={open}
					title={label}
					emptyText='No Stellar accounts.'
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
					open={open}
					title={label}
					emptyText='No Stellar assets.'
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
					open={open}
					title={label}
					emptyText='No Stellar claimable balances.'
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
					open={open}
					title={label}
					emptyText='No Stellar liquidity pools.'
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
					open={open}
					title={label}
					emptyText='No Stellar offers.'
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
					open={open}
					title={label}
					emptyText='No Stellar trades.'
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
					open={open}
					title={label}
					emptyText='No Soroban contracts.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
