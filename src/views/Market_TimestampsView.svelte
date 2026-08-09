<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetByKind } from '$/constants/Market.ts'


	// State
	let {
		selection,
		title = 'Spot stream',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Market_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					feedKey: true,
					price: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: marketTimestamp })}
		{@const marketTimestampSelector = marketTimestamp[EntityMetaKey.Selector]}
		{@const market = marketTimestampSelector.$market}
		<EntityView
			entityType={EntityType.Market_Timestamp}
			entitySelector={marketTimestampSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
					{
						marketVenue: market.$marketVenue.marketVenueId,
						baseKind: String(marketAssetByKind[market.$base.kind].label),
						base: market.$base.assetKey,
						quoteKind: String(marketAssetByKind[market.$quote.kind].label),
						quote: market.$quote.assetKey,
						marketKind: market.marketKind,
						timestampMs: String(marketTimestampSelector.timestampMs),
						feedKey: encodeURIComponent(marketTimestampSelector.feedKey),
					}
				)
			}
		>
			{#snippet Title()}
				{marketTimestampSelector.feedKey || 'market timestamp'}
			{/snippet}

			{#snippet Value()}
				{marketTimestamp.price}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{marketTimestampSelector.timestampMs}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
