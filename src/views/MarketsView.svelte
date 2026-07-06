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
	import { marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Markets',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					$marketVenue: true,
					$base: true,
					$quote: true,
					marketKind: true,
				},
				limit: 8192,
			})
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
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(markets)}
			{@const uniqueMarkets = [...new Map(markets.values.filter((market) => (filterMarketVenueId == null || market[EntityMetaKey.Selector].$marketVenue.marketVenueId === filterMarketVenueId) && (filterMarketKind == null || market[EntityMetaKey.Selector].marketKind === filterMarketKind)).map((market) => [market[EntityMetaKey.SelectorKey], market])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Market}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={markets.totalCount}
				getKey={(market) => market[EntityMetaKey.SelectorKey]}
				items={uniqueMarkets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Markets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: market }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Market> })}
					{@const marketFields = { ...market[EntityMetaKey.Selector], ...market }}
					{@const marketHrefFields = { ...market, ...market[EntityMetaKey.Selector] }}
					<MarketView
						selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
						prefetched={marketFields}
						href={
							(marketHrefFields.$marketVenue !== undefined && marketHrefFields.$marketVenue.marketVenueId !== undefined && marketHrefFields.$base !== undefined && marketHrefFields.$base.kind !== undefined && (marketHrefFields.$base !== undefined && marketHrefFields.$base.kind !== undefined && (marketHrefFields.$base.kind === 'Coin' ? marketHrefFields.$base !== undefined && marketHrefFields.$base.$coin !== undefined && marketHrefFields.$base.$coin.coinId !== undefined : marketHrefFields.$base.kind === 'CoinInstance' ? marketHrefFields.$base !== undefined && marketHrefFields.$base.$coinInstance !== undefined && marketHrefFields.$base.$coinInstance.type !== undefined : marketHrefFields.$base !== undefined && marketHrefFields.$base.$currency !== undefined && marketHrefFields.$base.$currency.iso4217 !== undefined)) && marketHrefFields.$quote !== undefined && marketHrefFields.$quote.kind !== undefined && (marketHrefFields.$quote !== undefined && marketHrefFields.$quote.kind !== undefined && (marketHrefFields.$quote.kind === 'Coin' ? marketHrefFields.$quote !== undefined && marketHrefFields.$quote.$coin !== undefined && marketHrefFields.$quote.$coin.coinId !== undefined : marketHrefFields.$quote.kind === 'CoinInstance' ? marketHrefFields.$quote !== undefined && marketHrefFields.$quote.$coinInstance !== undefined && marketHrefFields.$quote.$coinInstance.type !== undefined : marketHrefFields.$quote !== undefined && marketHrefFields.$quote.$currency !== undefined && marketHrefFields.$quote.$currency.iso4217 !== undefined)) && marketHrefFields.marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: String(marketHrefFields.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketHrefFields.$base.kind)] ?? ''),
								base: String((marketHrefFields.$base.kind === 'Coin' ? marketHrefFields.$base.$coin.coinId : marketHrefFields.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketHrefFields.$base.$coinInstance.type)] : marketHrefFields.$base.$currency.iso4217)),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketHrefFields.$quote.kind)] ?? ''),
								quote: String((marketHrefFields.$quote.kind === 'Coin' ? marketHrefFields.$quote.$coin.coinId : marketHrefFields.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(marketHrefFields.$quote.$coinInstance.type)] : marketHrefFields.$quote.$currency.iso4217)),
								marketKind: String(marketHrefFields.marketKind ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
