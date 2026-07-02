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
	import { MarketAssetKind, marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Markets',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Markets...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Markets-list',
		filterMarketVenueId,
		filterMarketKind,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Market>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
			filterMarketVenueId?: unknown
			filterMarketKind?: unknown
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
	import MarketView from '$/views/MarketView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		A market pairs a base asset with a quote so feeds can publish prices, volume, and related stats.
	</p>

	<p>
		Each row is a venue book with a kind: spot (CEX/DEX cash markets), perpetual (funding + open interest), or dated futures.
	</p>

	<p>
		Spot markets expose quote streams and OHLC where wired; perpetual and futures markets may include funding and open interest when a provider supplies them.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				limit: 8192,
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(markets)}
			{@const uniqueMarkets = [...new Map(markets.values.filter((market) => (filterMarketVenueId == null || market.entitySelector.$marketVenue.marketVenueId === filterMarketVenueId) && (filterMarketKind == null || market.entitySelector.marketKind === filterMarketKind)).map((market) => [market[EntityMetaKey.SelectorKey], market])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={markets.values.length === uniqueMarkets.length && markets.totalCount != null && markets.totalCount >= uniqueMarkets.length ? markets.totalCount : uniqueMarkets.length}
				getKey={(market) => market[EntityMetaKey.SelectorKey]}
				items={uniqueMarkets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No markets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: market }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market> })}
					{@const baseLabel = market.entitySelector.$base.kind === MarketAssetKind.Coin ? market.entitySelector.$base.$coin.coinId : market.entitySelector.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[String(market.entitySelector.$base.$coinInstance.type)] : market.entitySelector.$base.$currency.iso4217}
					{@const quoteLabel = market.entitySelector.$quote.kind === MarketAssetKind.Coin ? market.entitySelector.$quote.$coin.coinId : market.entitySelector.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[String(market.entitySelector.$quote.$coinInstance.type)] : market.entitySelector.$quote.$currency.iso4217}
					{@const marketLabel = `${market.entitySelector.$marketVenue.marketVenueId}:${baseLabel}/${quoteLabel}`}
					<MarketView
						href={
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: String(market.entitySelector.$marketVenue.marketVenueId),
								baseKind: String(marketAssetRouteLabelByKind[String(market.entitySelector.$base.kind)]),
								base: String(baseLabel),
								quoteKind: String(marketAssetRouteLabelByKind[String(market.entitySelector.$quote.kind)]),
								quote: String(quoteLabel),
								marketKind: String(market.entitySelector.marketKind),
							})
						}
						selection={select(EntityType.Market, market.entitySelector)}
						prefetched={market}
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
		entityType={EntityType.Market}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
