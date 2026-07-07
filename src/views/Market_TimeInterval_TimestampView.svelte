<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market_TimeInterval_Timestamp>>
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
	const marketTimeIntervalTimestamp = $derived(selection({
		fields: {
			close: true,
		},
	}))
	const titleFallback = $derived([selection.entitySelector.timeInterval ?? prefetched.timeInterval == null ? '' : String((`${(selection.entitySelector.timeInterval ?? prefetched.timeInterval).value}${(selection.entitySelector.timeInterval ?? prefetched.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || 'OHLC candle')
	const viewDomId = $derived('market-time-interval-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$market !== undefined && pendingEntity.$market.$marketVenue !== undefined && pendingEntity.$market.$marketVenue.marketVenueId !== undefined && pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.kind !== undefined && (pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.kind !== undefined && (pendingEntity.$market.$base.kind === 'Coin' ? pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.$coin !== undefined && pendingEntity.$market.$base.$coin.coinId !== undefined : pendingEntity.$market.$base.kind === 'CoinInstance' ? pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.$coinInstance !== undefined && pendingEntity.$market.$base.$coinInstance.type !== undefined : pendingEntity.$market !== undefined && pendingEntity.$market.$base !== undefined && pendingEntity.$market.$base.$currency !== undefined && pendingEntity.$market.$base.$currency.iso4217 !== undefined)) && pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.kind !== undefined && (pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.kind !== undefined && (pendingEntity.$market.$quote.kind === 'Coin' ? pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.$coin !== undefined && pendingEntity.$market.$quote.$coin.coinId !== undefined : pendingEntity.$market.$quote.kind === 'CoinInstance' ? pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.$coinInstance !== undefined && pendingEntity.$market.$quote.$coinInstance.type !== undefined : pendingEntity.$market !== undefined && pendingEntity.$market.$quote !== undefined && pendingEntity.$market.$quote.$currency !== undefined && pendingEntity.$market.$quote.$currency.iso4217 !== undefined)) && pendingEntity.$market !== undefined && pendingEntity.$market.marketKind !== undefined && pendingEntity.timeInterval !== undefined && pendingEntity.timeInterval.unit !== undefined && pendingEntity.timeInterval !== undefined && pendingEntity.timeInterval.value !== undefined && pendingEntity.timestampMs !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]', {
			marketVenue: String(pendingEntity.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$market.$base.kind)] ?? ''),
			base: String((pendingEntity.$market.$base.kind === 'Coin' ? pendingEntity.$market.$base.$coin.coinId : pendingEntity.$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(pendingEntity.$market.$base.$coinInstance.type)] : pendingEntity.$market.$base.$currency.iso4217)),
			quoteKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$market.$quote.kind)] ?? ''),
			quote: String((pendingEntity.$market.$quote.kind === 'Coin' ? pendingEntity.$market.$quote.$coin.coinId : pendingEntity.$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(pendingEntity.$market.$quote.$coinInstance.type)] : pendingEntity.$market.$quote.$currency.iso4217)),
			marketKind: String(pendingEntity.$market.marketKind ?? ''),
			timeIntervalUnit: String(pendingEntity.timeInterval.unit ?? ''),
			timeIntervalValue: String(pendingEntity.timeInterval.value ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketTimeIntervalTimestamp}>
			{#snippet Pending()}
				{[selection.entitySelector.timeInterval ?? prefetched.timeInterval == null ? '' : String((`${(selection.entitySelector.timeInterval ?? prefetched.timeInterval).value}${(selection.entitySelector.timeInterval ?? prefetched.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || 'OHLC candle'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[resolvedEntity.timeInterval == null ? '' : String((`${(resolvedEntity.timeInterval).value}${(resolvedEntity.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketTimeIntervalTimestamp}>
			{#snippet Pending()}
				{@const close0 = prefetched.close}
				{#if close0 !== undefined && close0 !== null}
					<NumberValue
						value={Number(close0) / 1e8}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const close0 = resolvedEntity.close}
				{#if close0 !== undefined && close0 !== null}
					<NumberValue
						value={Number(close0) / 1e8}
						formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={marketTimeIntervalTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market, {})}
						href={
							(selection.entitySelector.$market.$marketVenue !== undefined && selection.entitySelector.$market.$marketVenue.marketVenueId !== undefined && selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.kind !== undefined && (selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.kind !== undefined && (selection.entitySelector.$market.$base.kind === 'Coin' ? selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.$coin !== undefined && selection.entitySelector.$market.$base.$coin.coinId !== undefined : selection.entitySelector.$market.$base.kind === 'CoinInstance' ? selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.$coinInstance !== undefined && selection.entitySelector.$market.$base.$coinInstance.type !== undefined : selection.entitySelector.$market.$base !== undefined && selection.entitySelector.$market.$base.$currency !== undefined && selection.entitySelector.$market.$base.$currency.iso4217 !== undefined)) && selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.kind !== undefined && (selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.kind !== undefined && (selection.entitySelector.$market.$quote.kind === 'Coin' ? selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.$coin !== undefined && selection.entitySelector.$market.$quote.$coin.coinId !== undefined : selection.entitySelector.$market.$quote.kind === 'CoinInstance' ? selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.$coinInstance !== undefined && selection.entitySelector.$market.$quote.$coinInstance.type !== undefined : selection.entitySelector.$market.$quote !== undefined && selection.entitySelector.$market.$quote.$currency !== undefined && selection.entitySelector.$market.$quote.$currency.iso4217 !== undefined)) && selection.entitySelector.$market.marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								base: String((selection.entitySelector.$market.$base.kind === 'Coin' ? selection.entitySelector.$market.$base.$coin.coinId : selection.entitySelector.$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(selection.entitySelector.$market.$base.$coinInstance.type)] : selection.entitySelector.$market.$base.$currency.iso4217)),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
								quote: String((selection.entitySelector.$market.$quote.kind === 'Coin' ? selection.entitySelector.$market.$quote.$coin.coinId : selection.entitySelector.$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(selection.entitySelector.$market.$quote.$coinInstance.type)] : selection.entitySelector.$market.$quote.$currency.iso4217)),
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Time Interval</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timeInterval: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timeInterval = selection.entitySelector.timeInterval ?? prefetched.timeInterval}
							{#if timeInterval !== undefined && timeInterval !== null}
								{timeInterval == null ? '' : String((`${(timeInterval).value}${(timeInterval).unit}`) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timeInterval = resolvedEntity.timeInterval}
							{#if timeInterval !== undefined && timeInterval !== null}
								{timeInterval == null ? '' : String((`${(timeInterval).value}${(timeInterval).unit}`) ?? '')}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
						sources: [
							Source.Coingecko_Rest,
							Source.Coingecko_OpenApi,
							Source.Coinpaprika_OpenApi,
							Source.CoinMarketCap_Rest,
						],
						fields: {
							open: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const open = prefetched.open}
					{#if open !== undefined && open !== null}
						<div>
							<dt>Open</dt>
							<dd>
								<NumberValue
									value={Number(open) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const open = resolvedEntity.open}
					{#if open !== undefined && open !== null}
						<div>
							<dt>Open</dt>
							<dd>
								<NumberValue
									value={Number(open) / 1e8}
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
						sources: [
							Source.Coingecko_Rest,
							Source.Coingecko_OpenApi,
							Source.Coinpaprika_OpenApi,
							Source.CoinMarketCap_Rest,
						],
						fields: {
							high: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const high = prefetched.high}
					{#if high !== undefined && high !== null}
						<div>
							<dt>High</dt>
							<dd>
								<NumberValue
									value={Number(high) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const high = resolvedEntity.high}
					{#if high !== undefined && high !== null}
						<div>
							<dt>High</dt>
							<dd>
								<NumberValue
									value={Number(high) / 1e8}
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
						sources: [
							Source.Coingecko_Rest,
							Source.Coingecko_OpenApi,
							Source.Coinpaprika_OpenApi,
							Source.CoinMarketCap_Rest,
						],
						fields: {
							low: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const low = prefetched.low}
					{#if low !== undefined && low !== null}
						<div>
							<dt>Low</dt>
							<dd>
								<NumberValue
									value={Number(low) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const low = resolvedEntity.low}
					{#if low !== undefined && low !== null}
						<div>
							<dt>Low</dt>
							<dd>
								<NumberValue
									value={Number(low) / 1e8}
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
						sources: [
							Source.Coingecko_Rest,
							Source.Coingecko_OpenApi,
							Source.Coinpaprika_OpenApi,
							Source.CoinMarketCap_Rest,
						],
						fields: {
							close: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const close = prefetched.close}
					{#if close !== undefined && close !== null}
						<div>
							<dt>Close</dt>
							<dd>
								<NumberValue
									value={Number(close) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const close = resolvedEntity.close}
					{#if close !== undefined && close !== null}
						<div>
							<dt>Close</dt>
							<dd>
								<NumberValue
									value={Number(close) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
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
						sources: [
							Source.Coinpaprika_OpenApi,
							Source.CoinMarketCap_Rest,
						],
						fields: {
							quoteVolume: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quoteVolume = prefetched.quoteVolume}
					{#if quoteVolume !== undefined && quoteVolume !== null}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<NumberValue
									value={Number(quoteVolume) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteVolume = resolvedEntity.quoteVolume}
					{#if quoteVolume !== undefined && quoteVolume !== null}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<NumberValue
									value={Number(quoteVolume) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.Market, false>('$parentMarket', {
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.Coinpaprika_OpenApi,
									Source.CoinMarketCap_Rest,
								],
							})
						}
					>
						{#snippet children(market)}
							{#if market[EntityMetaKey.Selector] != null}
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
											quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
