<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarTrade>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/trade/[tradeId=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					tradeId: selection.entitySelector.tradeId,
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
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
						{@const stellarAccountInitial = untrack(() => stellarAccount)}
						<div>
							<dt>base account</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, (stellarAccount ?? stellarAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarAccountInitial = untrack(() => stellarAccount)}
						<div>
							<dt>counter account</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, (stellarAccount ?? stellarAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarOfferInitial = untrack(() => stellarOffer)}
						<div>
							<dt>base offer</dt>
							<dd>
								<StellarOfferView
									selection={select(EntityType.StellarOffer, (stellarOffer ?? stellarOfferInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarOfferInitial = untrack(() => stellarOffer)}
						<div>
							<dt>counter offer</dt>
							<dd>
								<StellarOfferView
									selection={select(EntityType.StellarOffer, (stellarOffer ?? stellarOfferInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarLiquidityPoolInitial = untrack(() => stellarLiquidityPool)}
						<div>
							<dt>base liquidity pool</dt>
							<dd>
								<StellarLiquidityPoolView
									selection={select(EntityType.StellarLiquidityPool, (stellarLiquidityPool ?? stellarLiquidityPoolInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarLiquidityPoolInitial = untrack(() => stellarLiquidityPool)}
						<div>
							<dt>counter liquidity pool</dt>
							<dd>
								<StellarLiquidityPoolView
									selection={select(EntityType.StellarLiquidityPool, (stellarLiquidityPool ?? stellarLiquidityPoolInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarAssetInitial = untrack(() => stellarAsset)}
						<div>
							<dt>base asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, (stellarAsset ?? stellarAssetInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarAssetInitial = untrack(() => stellarAsset)}
						<div>
							<dt>counter asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, (stellarAsset ?? stellarAssetInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarTransactionInitial = untrack(() => stellarTransaction)}
						<div>
							<dt>transaction</dt>
							<dd>
								<StellarTransactionView
									selection={select(EntityType.StellarTransaction, (stellarTransaction ?? stellarTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const stellarOperationInitial = untrack(() => stellarOperation)}
						<div>
							<dt>operation</dt>
							<dd>
								<StellarOperationView
									selection={select(EntityType.StellarOperation, (stellarOperation ?? stellarOperationInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
