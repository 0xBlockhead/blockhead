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
		title = 'Derivative observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.Market_Derivative_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Market_Derivative_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				feedKey: true,
				markPrice: true,
				indexPrice: true,
				fundingRate: true,
			},
		})
	}
>
	{#snippet Item({ item: marketDerivativeTimestamp })}
		{@const marketDerivativeTimestampSelector = marketDerivativeTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.Market_Derivative_Timestamp}
			entitySelector={marketDerivativeTimestampSelector}
			href={
				resolve(
					'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
					{
						marketVenue: String(marketDerivativeTimestampSelector.$market.$marketVenue.marketVenueId),
						baseKind: String(marketAssetRouteLabelByKind[String(marketDerivativeTimestampSelector.$market.$base.kind)]),
						base: String(marketDerivativeTimestampSelector.$market.$base.assetKey),
						quoteKind: String(marketAssetRouteLabelByKind[String(marketDerivativeTimestampSelector.$market.$quote.kind)]),
						quote: String(marketDerivativeTimestampSelector.$market.$quote.assetKey),
						marketKind: String(marketDerivativeTimestampSelector.$market.marketKind),
						timestampMs: String(marketDerivativeTimestampSelector.timestampMs),
						feedKey: encodeURIComponent(String(marketDerivativeTimestampSelector.feedKey)),
					}
				)
			}
		>
			{#snippet Title()}
				{marketDerivativeTimestampSelector.feedKey || 'market derivative timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(marketDerivativeTimestamp.markPrice ?? ''), String(marketDerivativeTimestamp.indexPrice ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(String(marketDerivativeTimestamp.fundingRate ?? '') ? String(marketDerivativeTimestamp.fundingRate ?? '') + '%' : '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
