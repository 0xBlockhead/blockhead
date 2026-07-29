<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.StellarTrade> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
	import StellarOfferView from '$/views/StellarOfferView.svelte'
	import StellarLiquidityPoolView from '$/views/StellarLiquidityPoolView.svelte'
	import StellarAssetView from '$/views/StellarAssetView.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
	import StellarOperationView from '$/views/StellarOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTrade}
	entitySelector={selection.entitySelector}
	title={title ?? 'stellar trade'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		stellar trade
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
				<dt>trade ID</dt>
				<dd>
					{selection.entitySelector.tradeId}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ledgerCloseTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerCloseTimeMs = entity.ledgerCloseTimeMs}
					{#if ledgerCloseTimeMs != null}
						<div>
							<dt>ledger close time ms</dt>
							<dd>
								{ledgerCloseTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseAccount}
			>
				{#snippet children(stellarAccount)}
					{#if stellarAccount != null}
						<div>
							<dt>base account</dt>
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

			<ResourceBoundary
				resource={selection.$counterAccount}
			>
				{#snippet children(stellarAccount)}
					{#if stellarAccount != null}
						<div>
							<dt>counter account</dt>
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

			<ResourceBoundary
				resource={selection.$baseOffer}
			>
				{#snippet children(stellarOffer)}
					{#if stellarOffer != null}
						<div>
							<dt>base offer</dt>
							<dd>
								<StellarOfferView
									selection={select(EntityType.StellarOffer, stellarOffer[EntityMetaKey.Selector])}
									prefetched={stellarOffer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterOffer}
			>
				{#snippet children(stellarOffer)}
					{#if stellarOffer != null}
						<div>
							<dt>counter offer</dt>
							<dd>
								<StellarOfferView
									selection={select(EntityType.StellarOffer, stellarOffer[EntityMetaKey.Selector])}
									prefetched={stellarOffer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseLiquidityPool}
			>
				{#snippet children(stellarLiquidityPool)}
					{#if stellarLiquidityPool != null}
						<div>
							<dt>base liquidity pool</dt>
							<dd>
								<StellarLiquidityPoolView
									selection={select(EntityType.StellarLiquidityPool, stellarLiquidityPool[EntityMetaKey.Selector])}
									prefetched={stellarLiquidityPool}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterLiquidityPool}
			>
				{#snippet children(stellarLiquidityPool)}
					{#if stellarLiquidityPool != null}
						<div>
							<dt>counter liquidity pool</dt>
							<dd>
								<StellarLiquidityPoolView
									selection={select(EntityType.StellarLiquidityPool, stellarLiquidityPool[EntityMetaKey.Selector])}
									prefetched={stellarLiquidityPool}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$baseAsset}
			>
				{#snippet children(stellarAsset)}
					{#if stellarAsset != null}
						<div>
							<dt>base asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$counterAsset}
			>
				{#snippet children(stellarAsset)}
					{#if stellarAsset != null}
						<div>
							<dt>counter asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseAmount = entity.baseAmount}
					{#if baseAmount != null}
						<div>
							<dt>base amount</dt>
							<dd>
								{baseAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counterAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const counterAmount = entity.counterAmount}
					{#if counterAmount != null}
						<div>
							<dt>counter amount</dt>
							<dd>
								{counterAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceNumerator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceNumerator = entity.priceNumerator}
					{#if priceNumerator != null}
						<div>
							<dt>price numerator</dt>
							<dd>
								{priceNumerator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priceDenominator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priceDenominator = entity.priceDenominator}
					{#if priceDenominator != null}
						<div>
							<dt>price denominator</dt>
							<dd>
								{priceDenominator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(stellarTransaction)}
					{#if stellarTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<StellarTransactionView
									selection={select(EntityType.StellarTransaction, stellarTransaction[EntityMetaKey.Selector])}
									prefetched={stellarTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operation}
			>
				{#snippet children(stellarOperation)}
					{#if stellarOperation != null}
						<div>
							<dt>operation</dt>
							<dd>
								<StellarOperationView
									selection={select(EntityType.StellarOperation, stellarOperation[EntityMetaKey.Selector])}
									prefetched={stellarOperation}
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
</EntityView>
