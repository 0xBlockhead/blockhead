<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { MarketAssetKind, marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Market prices',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Market prices...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MarketPrices-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MarketPrice>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Each row is one spot or index quote stream for a market pair and venue.
	</p>

	<p>
		Provider feed identity lives on timestamped quote prints under <code>$$quotes</code>. Interval candles live on the market OHLC index.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
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
				fields: {
					$market: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MarketPrice}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(marketPrices)}
			{@const uniqueMarketPrices = [...new Map(marketPrices.values.map((marketPrice) => [marketPrice[EntityMetaKey.SelectorKey], marketPrice])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MarketPrice}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={marketPrices.values.length === uniqueMarketPrices.length && marketPrices.totalCount != null && marketPrices.totalCount >= uniqueMarketPrices.length ? marketPrices.totalCount : uniqueMarketPrices.length}
				getKey={(marketPrice) => marketPrice[EntityMetaKey.SelectorKey]}
				items={uniqueMarketPrices}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No market prices yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketPrice }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MarketPrice> })}
					{@const baseLabel = marketPrice.entitySelector.$market.$base.kind === MarketAssetKind.Coin ? marketPrice.entitySelector.$market.$base.$coin.coinId : marketPrice.entitySelector.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[String(marketPrice.entitySelector.$market.$base.$coinInstance.type)] : marketPrice.entitySelector.$market.$base.$currency.iso4217}
					{@const quoteLabel = marketPrice.entitySelector.$market.$quote.kind === MarketAssetKind.Coin ? marketPrice.entitySelector.$market.$quote.$coin.coinId : marketPrice.entitySelector.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[String(marketPrice.entitySelector.$market.$quote.$coinInstance.type)] : marketPrice.entitySelector.$market.$quote.$currency.iso4217}
					{@const marketPriceLabel = `${marketPrice.entitySelector.$market.$marketVenue.marketVenueId}:${baseLabel}/${quoteLabel}`}
					<MarketPriceView
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: String(marketPrice.entitySelector.$market.$marketVenue.marketVenueId),
								baseKind: String(marketAssetRouteLabelByKind[String(marketPrice.entitySelector.$market.$base.kind)]),
								base: String(baseLabel),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketPrice.entitySelector.$market.$quote.kind)]),
								quote: String(quoteLabel),
								marketKind: String(marketPrice.entitySelector.$market.marketKind),
							})
						}
						selection={select(EntityType.MarketPrice, marketPrice.entitySelector)}
						prefetched={marketPrice}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.MarketPrice}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
