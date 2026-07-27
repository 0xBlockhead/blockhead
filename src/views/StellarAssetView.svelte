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
	}: EntitySelectionViewProps<EntityType.StellarAsset> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'stellar asset'
	const viewDomId = $derived('stellar-asset-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
	import StellarClaimableBalancesView from '$/views/StellarClaimableBalancesView.svelte'
	import StellarLiquidityPoolsView from '$/views/StellarLiquidityPoolsView.svelte'
	import StellarTrustlinesView from '$/views/StellarTrustlinesView.svelte'
	import StellarOffersView from '$/views/StellarOffersView.svelte'
	import StellarTradesView from '$/views/StellarTradesView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAsset}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		stellar asset
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>asset key</dt>
				<dd>
					{pendingEntity.assetKey}
				</dd>
			</div>

			<div>
				<dt>asset kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.assetKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetCode = entity.assetCode}
					{#if assetCode != null}
						<div>
							<dt>asset code</dt>
							<dd>
								{assetCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							issuer: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const issuer = entity.issuer}
					{#if issuer != null}
						<div>
							<dt>issuer</dt>
							<dd>
								<TruncatedValue value={issuer} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$issuerAccount}
			>
				{#snippet children(stellarAccount)}
					{#if stellarAccount != null}
						<div>
							<dt>issuer account</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, stellarAccount[EntityMetaKey.Selector])}
									prefetched={stellarAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-stellar-asset-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'stellar-asset-claimable-balances',
						label: 'Claimable Balances',
					},
					{
						id: 'stellar-asset-liquidity-pools',
						label: 'Liquidity Pools',
					},
					{
						id: 'stellar-asset-trustlines',
						label: 'Trustlines',
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

			{#snippet SectionStellarAssetClaimableBalances({ id, label, open })}
				<StellarClaimableBalancesView
					selection={selection.$$claimableBalances}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No claimable balances.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAssetLiquidityPools({ id, label, open })}
				<StellarLiquidityPoolsView
					selection={selection.$$liquidityPools}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No liquidity pools.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAssetTrustlines({ id, label, open })}
				<StellarTrustlinesView
					selection={selection.$$trustlines}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No trustlines.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-stellar-asset-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'stellar-asset-offers',
						label: 'Offers',
					},
					{
						id: 'stellar-asset-trades',
						label: 'Trades',
					},
				]
			}
			data-card
			class='network-view-collapsible-related'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionStellarAssetOffers({ id, label, open })}
				<StellarOffersView
					selection={selection.$$offers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No offers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionStellarAssetTrades({ id, label, open })}
				<StellarTradesView
					selection={selection.$$trades}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No trades.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
