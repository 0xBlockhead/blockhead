<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


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
	}: EntitySelectionViewProps<EntityType.Market_Derivative_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const marketDerivativeTimestamp = $derived(selection({
		fields: {
			markPrice: true,
			indexPrice: true,
			fundingRate: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.feedKey ?? '') || 'market derivative timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Derivative_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
			{
				marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId),
				baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)]),
				base: String(selection.entitySelector.$market.$base.assetKey),
				quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)]),
				quote: String(selection.entitySelector.$market.$quote.assetKey),
				marketKind: String(selection.entitySelector.$market.marketKind),
				timestampMs: String(selection.entitySelector.timestampMs),
				feedKey: encodeURIComponent(String(selection.entitySelector.feedKey)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.feedKey ?? '') || 'market derivative timestamp'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet children(entity)}
				{[String(entity.markPrice ?? ''), String(entity.indexPrice ?? '')].filter(Boolean).join(' ') || pendingEntity.feedKey || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet children(entity)}
				{@const fundingRate0 = entity.fundingRate}
				{#if fundingRate0 != null}
					<span data-text="muted">
						{String(fundingRate0)}
						<span>%</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed key</dt>
				<dd>
					{pendingEntity.feedKey}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
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
								{String(fundingRate)}
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
								<NumberValue
									value={Number(openInterestUsd)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
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
								{String(indexBasisPercent)}
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
								<NumberValue
									value={Number(markPrice) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
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
								<NumberValue
									value={Number(indexPrice) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
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
								{String(expiredAtMs)}
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
								{String(lastTradedAtMs)}
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
						open={false}
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
							<MarketView
								selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
								prefetched={market}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
