<!-- Generated from APP.ts. -->

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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarAsset>, 'prefetched'> = $props()

	const viewDomId = $derived('stellar-asset-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarAsset}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>asset key</dt>
				<dd>
					{selection.entitySelector.assetKey}
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
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
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

			{#snippet SectionStellarAssetClaimableBalances({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarClaimableBalance}
					collapsible={false}
					title={label}
					emptyText='No claimable balances.'
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

			{#snippet SectionStellarAssetLiquidityPools({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarLiquidityPool}
					collapsible={false}
					title={label}
					emptyText='No liquidity pools.'
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

			{#snippet SectionStellarAssetTrustlines({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarTrustline}
					collapsible={false}
					title={label}
					emptyText='No trustlines.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$trustlines()}
				>
					{#snippet Item({ item: stellarTrustline })}
						<EntityView
							entityType={EntityType.StellarTrustline}
							entitySelector={stellarTrustline[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
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

			{#snippet SectionStellarAssetOffers({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarOffer}
					collapsible={false}
					title={label}
					emptyText='No offers.'
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

			{#snippet SectionStellarAssetTrades({ id, label })}
				<EntitiesList
					entityType={EntityType.StellarTrade}
					collapsible={false}
					title={label}
					emptyText='No trades.'
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
	{/snippet}
</EntityView>
