<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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

	const marketPrice = $derived(selection({
		fields: {
			$parentMarket: true,
			...(open && {
				$$quotes: true,
			}),
		},
	}))
	const titleFallback = $derived('Market price')
	const viewDomId = $derived('market-price-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<MarketView
				selection={select(EntityType.Market, selection.entitySelector.$market)}
				href={
						resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
							marketVenue: entity.$marketVenue.marketVenueId,
							baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
							base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
							quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
							quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
							marketKind: entity.marketKind,
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={marketPrice}>
				{#snippet Pending()}
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: entity.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
								base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
								quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
								marketKind: entity.marketKind,
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: entity.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
								base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
								quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
								marketKind: entity.marketKind,
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<MarketView
				selection={select(EntityType.Market, selection.entitySelector.$market)}
				href={
						resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
							marketVenue: entity.$marketVenue.marketVenueId,
							baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
							base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
							quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
							quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
							marketKind: entity.marketKind,
						})
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={marketPrice}>
				{#snippet Pending()}
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: entity.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
								base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
								quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
								marketKind: entity.marketKind,
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: entity.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
								base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
								quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
								marketKind: entity.marketKind,
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
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
									Source.Constants_Internal,
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
									[({ fieldRow }) => fieldRow.entitySelector.timestampMs ?? fieldRow.timestampMs, 'desc'],
								],
							}).first()
						}
						placeholderText='Loading latest quote...'
					>
						{#snippet Pending()}
							<span data-text="muted">-</span>
						{/snippet}

						{#snippet children(marketTimestamp)}
							{#if marketTimestamp != null}
								{@const marketTimestampSelector = marketTimestamp.entitySelector}
								<Market_TimestampView
									selection={
										select(EntityType.Market_Timestamp, marketTimestampSelector, {
											sources: [
												Source.Constants_Internal,
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
										resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
											marketVenue: entity.$market.$marketVenue.marketVenueId,
											baseKind: marketAssetRouteLabelByKind[entity.$market.$base.kind],
											base: entity.$market.$base.kind === MarketAssetKind.Coin ? entity.$market.$base.$coin.coinId : entity.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$base.$coinInstance.type] : entity.$market.$base.$currency.iso4217,
											quoteKind: marketAssetRouteLabelByKind[entity.$market.$quote.kind],
											quote: entity.$market.$quote.kind === MarketAssetKind.Coin ? entity.$market.$quote.$coin.coinId : entity.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$quote.$coinInstance.type] : entity.$market.$quote.$currency.iso4217,
											marketKind: entity.$market.marketKind,
											timestampMs: String(({ ...marketTimestampSelector, ...marketTimestamp }).timestampMs),
											feedKey: String(({ ...marketTimestampSelector, ...marketTimestamp }).feedKey),
										})
									}
									prefetched={{ ...marketTimestampSelector, ...marketTimestamp }}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">-</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.Market, false>('$parentMarket')}
					>
						{#snippet children(market)}
							<MarketView
								selection={select(EntityType.Market, market.entitySelector)}
								prefetched={market}
								href={
									resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
										marketVenue: entity.$marketVenue.marketVenueId,
										baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
										base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
										quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
										quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
										marketKind: entity.marketKind,
									})
								}
								layout={EntityLayout.Title}
								open={false}
							/>
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
								Source.Constants_Internal,
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
