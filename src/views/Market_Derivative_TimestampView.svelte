<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.Market_Derivative_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market_Derivative_Timestamp>>
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
	const marketDerivativeTimestamp = $derived(selection({
		fields: {
			markPrice: true,
			indexPrice: true,
			fundingRate: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || 'market derivative timestamp')
	const viewDomId = $derived('market-derivative-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$market !== undefined && pendingEntity.$market.marketKind !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.assetKey !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.assetKey !== undefined && pendingEntity.$market.$marketVenue !== undefined && pendingEntity.$market.$marketVenue.marketVenueId !== undefined && pendingEntity.$base !== undefined && pendingEntity.$base.kind !== undefined && pendingEntity.$quote !== undefined && pendingEntity.$quote.kind !== undefined && pendingEntity.timestampMs !== undefined && pendingEntity.feedKey !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
			marketKind: String(pendingEntity.$market.marketKind ?? ''),
			base: String(pendingEntity.$market.$base.assetKey ?? ''),
			quote: String(pendingEntity.$market.$quote.assetKey ?? ''),
			marketVenue: String(pendingEntity.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$quote.kind)] ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			feedKey: String(pendingEntity.feedKey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market derivative timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.markPrice) ?? ''), String((pendingEntity.indexPrice) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market derivative timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.markPrice) ?? ''), String((resolvedEntity.indexPrice) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.feedKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={marketDerivativeTimestamp}>
			{#snippet Pending()}
				{@const fundingRate0 = pendingEntity.fundingRate}
				{#if fundingRate0 !== undefined && fundingRate0 !== null}
					<span data-text="muted">
						{String((fundingRate0) ?? '')}
						<span>%</span>
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Feed key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feedKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const feedKey = pendingEntity.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
						fields: {
							fundingRate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fundingRate = pendingEntity.fundingRate}
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
						fields: {
							openInterestUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const openInterestUsd = pendingEntity.openInterestUsd}
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
						fields: {
							indexBasisPercent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const indexBasisPercent = pendingEntity.indexBasisPercent}
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
						fields: {
							markPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const markPrice = pendingEntity.markPrice}
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
						fields: {
							indexPrice: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const indexPrice = pendingEntity.indexPrice}
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
						fields: {
							expiredAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiredAtMs = pendingEntity.expiredAtMs}
					{#if expiredAtMs !== undefined && expiredAtMs !== null}
						<div>
							<dt>Expired at</dt>
							<dd>
								{String((expiredAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							lastTradedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastTradedAtMs = pendingEntity.lastTradedAtMs}
					{#if lastTradedAtMs !== undefined && lastTradedAtMs !== null}
						<div>
							<dt>Last traded at</dt>
							<dd>
								{String((lastTradedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerAssetId = pendingEntity.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transport = pendingEntity.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						selection={select(EntityType.Market, selection.entitySelector.$market, {})}
						href={
							(selection.entitySelector.$market.marketKind !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.assetKey !== undefined && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.assetKey !== undefined && selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base.kind !== undefined && selection.entitySelector.$market.$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
								base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
								quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
							}) : undefined)
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
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
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
