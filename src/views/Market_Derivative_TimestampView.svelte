<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetByKind } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Market_Derivative_Timestamp>, 'prefetched'> = $props()

	const market = $derived(selection.entitySelector.$market)
	const marketDerivativeTimestamp = $derived(selection({
		fields: {
			markPrice: true,
			$market: {
				fields: {
					$quote: {
						fields: {
							assetKey: true,
						},
					},
				},
			},
			indexPrice: true,
			fundingRate: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Derivative_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.feedKey || 'market derivative timestamp')}
	href={
		href === undefined ?
			resolve(
				'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
				{
					marketVenue: market.$marketVenue.marketVenueId,
					baseKind: String(marketAssetByKind[market.$base.kind].label),
					base: market.$base.assetKey,
					quoteKind: String(marketAssetByKind[market.$quote.kind].label),
					quote: market.$quote.assetKey,
					marketKind: market.marketKind,
					timestampMs: String(selection.entitySelector.timestampMs),
					feedKey: encodeURIComponent(selection.entitySelector.feedKey),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet children(entity)}
				{@const markPrice = entity.markPrice}
				{#if markPrice != null}
					{markPrice}
					<span>{selection.entitySelector.$market.$quote.assetKey == null ? '' : ` ${selection.entitySelector.$market.$quote.assetKey}`}</span>
				{/if}
				{@const indexPrice = entity.indexPrice}
				{#if indexPrice != null}
					{indexPrice}
					<span>{selection.entitySelector.$market.$quote.assetKey == null ? '' : ` ${selection.entitySelector.$market.$quote.assetKey}`}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet children(entity)}
				{@const fundingRate = entity.fundingRate}
				{#if fundingRate != null}
					<span data-text="muted">
						{fundingRate}
						<span>%</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Feed key</dt>
				<dd>
					{selection.entitySelector.feedKey}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={marketDerivativeTimestamp}
			>
				{#snippet children(entity)}
					{@const fundingRate = entity.fundingRate}
					{#if fundingRate != null}
						<div>
							<dt>Funding rate</dt>
							<dd>
								{fundingRate}
								<span>%</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							openInterestUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openInterestUsd = entity.openInterestUsd}
					{#if openInterestUsd != null}
						<div>
							<dt>Open interest USD</dt>
							<dd>
								{openInterestUsd}
								<span> USD</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							indexBasisPercent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const indexBasisPercent = entity.indexBasisPercent}
					{#if indexBasisPercent != null}
						<div>
							<dt>Index basis percent</dt>
							<dd>
								{indexBasisPercent}
								<span>%</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={marketDerivativeTimestamp}
			>
				{#snippet children(entity)}
					{@const markPrice = entity.markPrice}
					{#if markPrice != null}
						<div>
							<dt>Mark price</dt>
							<dd>
								{markPrice}
								<span>{selection.entitySelector.$market.$quote.assetKey == null ? '' : ` ${selection.entitySelector.$market.$quote.assetKey}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={marketDerivativeTimestamp}
			>
				{#snippet children(entity)}
					{@const indexPrice = entity.indexPrice}
					{#if indexPrice != null}
						<div>
							<dt>Index price</dt>
							<dd>
								{indexPrice}
								<span>{selection.entitySelector.$market.$quote.assetKey == null ? '' : ` ${selection.entitySelector.$market.$quote.assetKey}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expiredAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiredAtMs = entity.expiredAtMs}
					{#if expiredAtMs != null}
						<div>
							<dt>Expired at</dt>
							<dd>
								{expiredAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTradedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastTradedAtMs = entity.lastTradedAtMs}
					{#if lastTradedAtMs != null}
						<div>
							<dt>Last traded at</dt>
							<dd>
								{lastTradedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerAssetId = entity.providerAssetId}
					{#if providerAssetId != null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{providerAssetId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transport = entity.transport}
					{#if transport != null}
						<div>
							<dt>Transport</dt>
							<dd>
								{transport}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Parent market</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentMarket}
					>
						{#snippet children(market)}
							{@const marketInitial = untrack(() => market)}
							<MarketView
								selection={select(EntityType.Market, (market ?? marketInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
