<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.Market_Derivative_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Market_Derivative_Timestamp>
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
	const marketDerivativeTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			markPrice: true,
			indexPrice: true,
			fundingRate: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			markPrice: true,
			indexPrice: true,
			fundingRate: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || 'market derivative timestamp')
	const viewDomId = $derived('market-derivative-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Derivative_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'feedKey' in selection.entitySelector
			&& selection.entitySelector.feedKey != null
			&& selection.entitySelector != null && '$market' in selection.entitySelector
			&& selection.entitySelector.$market != null && 'marketKind' in selection.entitySelector.$market
			&& selection.entitySelector.$market.marketKind != null
			&& selection.entitySelector.$market != null && '$base' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$base != null && 'assetKey' in selection.entitySelector.$market.$base
			&& selection.entitySelector.$market.$base.assetKey != null
			&& selection.entitySelector.$market != null && '$quote' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$quote != null && 'assetKey' in selection.entitySelector.$market.$quote
			&& selection.entitySelector.$market.$quote.assetKey != null
			&& selection.entitySelector.$market != null && '$marketVenue' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$market.$marketVenue
			&& selection.entitySelector.$market.$marketVenue.marketVenueId != null
			&& selection.entitySelector != null && '$base' in selection.entitySelector
			&& selection.entitySelector.$base != null && 'kind' in selection.entitySelector.$base
			&& selection.entitySelector.$base.kind != null
			&& selection.entitySelector != null && '$quote' in selection.entitySelector
			&& selection.entitySelector.$quote != null && 'kind' in selection.entitySelector.$quote
			&& selection.entitySelector.$quote.kind != null ?
				resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			feedKey: encodeURIComponent(String(selection.entitySelector.feedKey ?? '')),
			marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
			base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
			quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
			marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$quote.kind)] ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'markPrice') && Object.hasOwn(prefetched, 'indexPrice') && Object.hasOwn(prefetched, 'fundingRate')}
			{[String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'markPrice') && Object.hasOwn(prefetched, 'indexPrice') && Object.hasOwn(prefetched, 'fundingRate')}
			{[String((pendingEntity.markPrice) ?? ''), String((pendingEntity.indexPrice) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.markPrice) ?? ''), String((resolvedEntity.indexPrice) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.feedKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'markPrice') && Object.hasOwn(prefetched, 'indexPrice') && Object.hasOwn(prefetched, 'fundingRate')}
			{@const fundingRate0 = pendingEntity.fundingRate}
			{#if fundingRate0 !== undefined && fundingRate0 !== null}
				<span data-text="muted">
					{String((fundingRate0) ?? '')}
					<span>%</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundingRate0 = resolvedEntity.fundingRate}
					{#if fundingRate0 !== undefined && fundingRate0 !== null}
						<span data-text="muted">
							{String((fundingRate0) ?? '')}
							<span>%</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									feedKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feedKey = resolvedEntity.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fundingRate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundingRate = resolvedEntity.fundingRate}
					{#if fundingRate !== undefined && fundingRate !== null}
						<div>
							<dt>Funding rate</dt>
							<dd>
								{String((fundingRate) ?? '')}
								<span>%</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							openInterestUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const openInterestUsd = resolvedEntity.openInterestUsd}
					{#if openInterestUsd !== undefined && openInterestUsd !== null}
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
						sources: selection.sources,
						fields: {
							indexBasisPercent: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexBasisPercent = resolvedEntity.indexBasisPercent}
					{#if indexBasisPercent !== undefined && indexBasisPercent !== null}
						<div>
							<dt>Index basis percent</dt>
							<dd>
								{String((indexBasisPercent) ?? '')}
								<span>%</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							markPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const markPrice = resolvedEntity.markPrice}
					{#if markPrice !== undefined && markPrice !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							indexPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const indexPrice = resolvedEntity.indexPrice}
					{#if indexPrice !== undefined && indexPrice !== null}
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
						sources: selection.sources,
						fields: {
							expiredAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiredAtMs = resolvedEntity.expiredAtMs}
					{#if expiredAtMs !== undefined && expiredAtMs !== null}
						<div>
							<dt>Expired at</dt>
							<dd>
								{String((expiredAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							lastTradedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastTradedAtMs = resolvedEntity.lastTradedAtMs}
					{#if lastTradedAtMs !== undefined && lastTradedAtMs !== null}
						<div>
							<dt>Last traded at</dt>
							<dd>
								{String((lastTradedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerAssetId = resolvedEntity.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transport = resolvedEntity.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
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
						href={
							(
								selection.entitySelector.$market != null && 'marketKind' in selection.entitySelector.$market
								&& selection.entitySelector.$market.marketKind != null
								&& selection.entitySelector.$market != null && '$base' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$base != null && 'assetKey' in selection.entitySelector.$market.$base
								&& selection.entitySelector.$market.$base.assetKey != null
								&& selection.entitySelector.$market != null && '$quote' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$quote != null && 'assetKey' in selection.entitySelector.$market.$quote
								&& selection.entitySelector.$market.$quote.assetKey != null
								&& selection.entitySelector.$market != null && '$marketVenue' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$market.$marketVenue
								&& selection.entitySelector.$market.$marketVenue.marketVenueId != null
								&& selection.entitySelector.$market.$base != null && 'kind' in selection.entitySelector.$market.$base
								&& selection.entitySelector.$market.$base.kind != null
								&& selection.entitySelector.$market.$quote != null && 'kind' in selection.entitySelector.$market.$quote
								&& selection.entitySelector.$market.$quote.kind != null ?
									resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
								base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
								quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
							})
							:
									undefined
							)
						}
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
							{#if market != null && market[EntityMetaKey.Selector] != null}
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(
											market[EntityMetaKey.Selector] != null && 'marketKind' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].marketKind != null
											&& market[EntityMetaKey.Selector] != null && '$base' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$base != null && 'assetKey' in market[EntityMetaKey.Selector].$base
											&& market[EntityMetaKey.Selector].$base.assetKey != null
											&& market[EntityMetaKey.Selector] != null && '$quote' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$quote != null && 'assetKey' in market[EntityMetaKey.Selector].$quote
											&& market[EntityMetaKey.Selector].$quote.assetKey != null
											&& market[EntityMetaKey.Selector] != null && '$marketVenue' in market[EntityMetaKey.Selector]
											&& market[EntityMetaKey.Selector].$marketVenue != null && 'marketVenueId' in market[EntityMetaKey.Selector].$marketVenue
											&& market[EntityMetaKey.Selector].$marketVenue.marketVenueId != null
											&& market[EntityMetaKey.Selector].$base != null && 'kind' in market[EntityMetaKey.Selector].$base
											&& market[EntityMetaKey.Selector].$base.kind != null
											&& market[EntityMetaKey.Selector].$quote != null && 'kind' in market[EntityMetaKey.Selector].$quote
											&& market[EntityMetaKey.Selector].$quote.kind != null ?
												resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										})
										:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
