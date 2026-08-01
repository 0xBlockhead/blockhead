<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
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
				<EntitiesList
					entityType={EntityType.StellarNetwork_Timestamp}
					collapsible={false}
					title={label}
					emptyText='No Stellar network observations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$timestamps()}
				>
					{#snippet Item({ item: stellarNetworkTimestamp })}
						<EntityView
							entityType={EntityType.StellarNetwork_Timestamp}
							entitySelector={stellarNetworkTimestamp[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarChainLedgers({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarLedger}
					collapsible={false}
					title={label}
					emptyText='No Stellar ledgers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$ledgers()}
				>
					{#snippet Item({ item: stellarLedger })}
						<EntityView
							entityType={EntityType.StellarLedger}
							entitySelector={stellarLedger[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarChainTransactions({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarTransaction}
					collapsible={false}
					title={label}
					emptyText='No Stellar transactions.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$transactions()}
				>
					{#snippet Item({ item: stellarTransaction })}
						<EntityView
							entityType={EntityType.StellarTransaction}
							entitySelector={stellarTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarChainOperations({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarOperation}
					collapsible={false}
					title={label}
					emptyText='No Stellar operations.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$operations()}
				>
					{#snippet Item({ item: stellarOperation })}
						<EntityView
							entityType={EntityType.StellarOperation}
							entitySelector={stellarOperation[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.StellarAccount}
					collapsible={false}
					title={label}
					emptyText='No Stellar accounts.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$accounts()}
				>
					{#snippet Item({ item: stellarAccount })}
						<EntityView
							entityType={EntityType.StellarAccount}
							entitySelector={stellarAccount[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarAssets({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarAsset}
					collapsible={false}
					title={label}
					emptyText='No Stellar assets.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$assets()}
				>
					{#snippet Item({ item: stellarAsset })}
						<EntityView
							entityType={EntityType.StellarAsset}
							entitySelector={stellarAsset[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarClaimables({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarClaimableBalance}
					collapsible={false}
					title={label}
					emptyText='No Stellar claimable balances.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$claimableBalances()}
				>
					{#snippet Item({ item: stellarClaimableBalance })}
						<EntityView
							entityType={EntityType.StellarClaimableBalance}
							entitySelector={stellarClaimableBalance[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.StellarLiquidityPool}
					collapsible={false}
					title={label}
					emptyText='No Stellar liquidity pools.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$liquidityPools()}
				>
					{#snippet Item({ item: stellarLiquidityPool })}
						<EntityView
							entityType={EntityType.StellarLiquidityPool}
							entitySelector={stellarLiquidityPool[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarOffers({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarOffer}
					collapsible={false}
					title={label}
					emptyText='No Stellar offers.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$offers()}
				>
					{#snippet Item({ item: stellarOffer })}
						<EntityView
							entityType={EntityType.StellarOffer}
							entitySelector={stellarOffer[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionStellarTrades({ id, label, open })}
				<EntitiesList
					entityType={EntityType.StellarTrade}
					collapsible={false}
					title={label}
					emptyText='No Stellar trades.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$trades()}
				>
					{#snippet Item({ item: stellarTrade })}
						<EntityView
							entityType={EntityType.StellarTrade}
							entitySelector={stellarTrade[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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
				<EntitiesList
					entityType={EntityType.SorobanContract}
					collapsible={false}
					title={label}
					emptyText='No Soroban contracts.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$contracts()}
				>
					{#snippet Item({ item: sorobanContract })}
						<EntityView
							entityType={EntityType.SorobanContract}
							entitySelector={sorobanContract[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
