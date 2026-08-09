<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetByKind } from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.MarketPrice> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Each row is one spot or index quote stream for a market pair and venue.
	</p>

	<p>
		Provider feed identity lives on timestamped quote prints under <code>$$quotes</code>. Interval candles live on the market OHLC index.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MarketPrice}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Constants_Internal,
			],
			fields: {
				$market: true,
			},
			limit: 400,
		})
	}
>
	{#snippet Item({ item: marketPrice })}
		{@const marketPriceSelector = marketPrice[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MarketPrice}
			entitySelector={marketPriceSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]',
					{
						marketVenue: marketPriceSelector.$market.$marketVenue.marketVenueId,
						baseKind: String(marketAssetByKind[marketPriceSelector.$market.$base.kind].label),
						base: marketPriceSelector.$market.$base.assetKey,
						quoteKind: String(marketAssetByKind[marketPriceSelector.$market.$quote.kind].label),
						quote: marketPriceSelector.$market.$quote.assetKey,
						marketKind: marketPriceSelector.$market.marketKind,
					}
				)
			}
		>
			{#snippet Title()}
				Market
			{/snippet}

			{#snippet Value()}
				Market
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
