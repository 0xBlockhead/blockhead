<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


	// State
	let {
		selection,
		title = 'Spot stream',
		typeAnnotationParagraphs = ['A point-in-time market quote or metric observation.'],
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
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				feedKey: true,
				price: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: marketTimestamp })}
		{@const marketTimestampSelector = marketTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Market_Timestamp}
			entitySelector={marketTimestampSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
					{
						marketVenue: String(marketTimestampSelector.$market.$marketVenue.marketVenueId),
						baseKind: String(marketAssetRouteLabelByKind[String(marketTimestampSelector.$market.$base.kind)]),
						base: String(marketTimestampSelector.$market.$base.assetKey),
						quoteKind: String(marketAssetRouteLabelByKind[String(marketTimestampSelector.$market.$quote.kind)]),
						quote: String(marketTimestampSelector.$market.$quote.assetKey),
						marketKind: String(marketTimestampSelector.$market.marketKind),
						timestampMs: String(marketTimestampSelector.timestampMs),
						feedKey: encodeURIComponent(String(marketTimestampSelector.feedKey)),
					}
				)
			}
		>
			{#snippet Title()}
				{marketTimestampSelector.feedKey || 'market timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(marketTimestamp.price)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(marketTimestampSelector.timestampMs)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
