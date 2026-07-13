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
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Market prices',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					$market: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={marketPrices.totalCount}
				getKey={(marketPrice) => marketPrice[EntityMetaKey.SelectorKey]}
				items={uniqueMarketPrices}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Market prices yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: marketPrice }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MarketPrice> })}
					{@const marketPriceFields = { ...marketPrice[EntityMetaKey.Selector], ...marketPrice }}
					{@const marketPriceHrefFields = { ...marketPrice, ...marketPrice[EntityMetaKey.Selector] }}
					<MarketPriceView
						selection={select(EntityType.MarketPrice, marketPrice[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={marketPriceFields}
						href={
							resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: String(marketPriceHrefFields.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(marketPriceHrefFields.$market.$base.kind)] ?? ''),
								base: String(marketPriceHrefFields.$market.$base.assetKey ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(marketPriceHrefFields.$market.$quote.kind)] ?? ''),
								quote: String(marketPriceHrefFields.$market.$quote.assetKey ?? ''),
								marketKind: String(marketPriceHrefFields.$market.marketKind ?? ''),
							})
						}
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
