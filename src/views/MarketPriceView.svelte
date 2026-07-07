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
			selection: EntityProxyResource<typeof schema, EntityType.MarketPrice>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MarketPrice>>
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
	const marketPrice = $derived(selection({
		fields: {
			$parentMarket: true,
		},
	}))
	const titleFallback = $derived('Market price')
	const viewDomId = $derived('market-price-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={marketPrice}>
			{#snippet Pending()}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
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
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
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
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={marketPrice}>
			{#snippet Pending()}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
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
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<MarketView
					selection={select(EntityType.Market, selection.entitySelector.$market)}
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
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Latest quote</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.Market_Timestamp>('$$quotes', {
								sources: [
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
									Source.Defillama_OpenApi,
									Source.Blockscout_Rest,
									Source.Defillama_Rest,
								],
								limit: 1,
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							})
						}
					>
						{#snippet children(marketTimestamps)}
							{@const marketTimestamp = marketTimestamps.values[0]}
							{#if marketTimestamp != null}
								{@const marketTimestampSelector = marketTimestamp[EntityMetaKey.Selector]}
								<Market_TimestampView
									selection={
										select(EntityType.Market_Timestamp, marketTimestampSelector, {
											sources: [
												Source.Coingecko_Rest,
												Source.Coingecko_OpenApi,
												Source.CoinMarketCap_Rest,
												Source.Coinpaprika_OpenApi,
												Source.Defillama_OpenApi,
												Source.Blockscout_Rest,
												Source.Defillama_Rest,
											],
										})
									}
									href={
										(marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId !== undefined && marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.kind !== undefined && (marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.kind !== undefined && (marketTimestamp[EntityMetaKey.Selector].$market.$base.kind === 'Coin' ? marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.$coin !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.$coin.coinId !== undefined : marketTimestamp[EntityMetaKey.Selector].$market.$base.kind === 'CoinInstance' ? marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.$coinInstance !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.$coinInstance.type !== undefined : marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.$currency !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$base.$currency.iso4217 !== undefined)) && marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind !== undefined && (marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind !== undefined && (marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind === 'Coin' ? marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.$coin !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.$coin.coinId !== undefined : marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind === 'CoinInstance' ? marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.$coinInstance !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.$coinInstance.type !== undefined : marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.$currency !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.$quote.$currency.iso4217 !== undefined)) && marketTimestamp[EntityMetaKey.Selector].$market !== undefined && marketTimestamp[EntityMetaKey.Selector].$market.marketKind !== undefined && marketTimestamp[EntityMetaKey.Selector].timestampMs !== undefined && marketTimestamp[EntityMetaKey.Selector].feedKey !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
											marketVenue: String(marketTimestamp[EntityMetaKey.Selector].$market.$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$market.$base.kind)] ?? ''),
											base: String((marketTimestamp[EntityMetaKey.Selector].$market.$base.kind === 'Coin' ? marketTimestamp[EntityMetaKey.Selector].$market.$base.$coin.coinId : marketTimestamp[EntityMetaKey.Selector].$market.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketTimestamp[EntityMetaKey.Selector].$market.$base.$coinInstance.type)] : marketTimestamp[EntityMetaKey.Selector].$market.$base.$currency.iso4217)),
											quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind)] ?? ''),
											quote: String((marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind === 'Coin' ? marketTimestamp[EntityMetaKey.Selector].$market.$quote.$coin.coinId : marketTimestamp[EntityMetaKey.Selector].$market.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketTimestamp[EntityMetaKey.Selector].$market.$quote.$coinInstance.type)] : marketTimestamp[EntityMetaKey.Selector].$market.$quote.$currency.iso4217)),
											marketKind: String(marketTimestamp[EntityMetaKey.Selector].$market.marketKind ?? ''),
											timestampMs: String(marketTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
											feedKey: String(marketTimestamp[EntityMetaKey.Selector].feedKey ?? ''),
										}) : undefined)
									}
									prefetched={{ ...marketTimestampSelector, ...marketTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

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
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection[EntityProxyField]<EntityType.Market, false>('$parentMarket', {
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.Coingecko_OpenApi,
									Source.CoinMarketCap_Rest,
									Source.Coinpaprika_OpenApi,
									Source.Defillama_OpenApi,
									Source.Defillama_Rest,
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

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<Market_TimestampsView
				selection={
						selection[EntityProxyField]<EntityType.Market_Timestamp>('$$quotes', {
							sources: [
								Source.Coingecko_Rest,
								Source.Coingecko_OpenApi,
								Source.CoinMarketCap_Rest,
								Source.Coinpaprika_OpenApi,
								Source.Defillama_OpenApi,
								Source.Blockscout_Rest,
								Source.Defillama_Rest,
							],
							limit: 64,
						})
					}
				title='Quote history'
				emptyText='No market quotes yet.'
				id='Market_TimestampsView-$$quotes'
			/>
		{/if}
	{/snippet}
</EntityView>
