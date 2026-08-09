<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { RegisteredEntitySelector } from '$/schema/index.ts'
	import { marketAssetByKind } from '$/constants/Market.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		filterMarketVenueId,
		filterMarketKind,
		...EntitiesListProps
	}: EntityListViewProps<
		EntityType.Market,
		{
			filterMarketVenueId?: RegisteredEntitySelector<EntityType.Market>['$marketVenue']['marketVenueId']
			filterMarketKind?: RegisteredEntitySelector<EntityType.Market>['marketKind']
		}
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


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

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={selection()}
	getResourceItems={
		(markets) => markets.values.filter(
			(market) => (
				(filterMarketVenueId == null || market[EntityMetaKey.Selector].$marketVenue.marketVenueId === filterMarketVenueId)
				&& (filterMarketKind == null || market[EntityMetaKey.Selector].marketKind === filterMarketKind)
			)
		)
	}
>
	{#snippet Item({ item: market })}
		{@const marketSelector = market[EntityMetaKey.Selector]}
		{@const base = marketSelector.$base}
		{@const quote = marketSelector.$quote}
		<EntityView
			entityType={EntityType.Market}
			entitySelector={marketSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
					{
						marketVenue: marketSelector.$marketVenue.marketVenueId,
						baseKind: marketAssetByKind[base.kind].label,
						base: base.assetKey,
						quoteKind: marketAssetByKind[quote.kind].label,
						quote: quote.assetKey,
						marketKind: marketSelector.marketKind,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
