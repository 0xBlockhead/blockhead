<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MarketPrice>, 'prefetched'> = $props()

	const market = $derived(selection.entitySelector.$market)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector}
	title={title ?? 'Market price'}
	href={
		href === undefined ?
			resolve(
				'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price',
				{
					marketVenue: market.$marketVenue.marketVenueId,
					baseKind: marketAssetRouteLabelByKind[market.$base.kind],
					base: market.$base.assetKey,
					quoteKind: marketAssetRouteLabelByKind[market.$quote.kind],
					quote: market.$quote.assetKey,
					marketKind: market.marketKind,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<MarketView
			selection={select(EntityType.Market, selection.entitySelector.$market)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<MarketView
			selection={select(EntityType.Market, selection.entitySelector.$market)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest quote</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
							.$$quotes({
								orderBy: [
									[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
								],
							}).first()
						}
					>
						{#snippet children(marketTimestamp)}
							{#if marketTimestamp != null}
								<Market_TimestampView
									selection={select(EntityType.Market_Timestamp, marketTimestamp[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const quotesResource = selection
			.$$quotes({
				limit: 64,
			})}
		<ResourceBoundary
			resource={quotesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<Market_TimestampsView
						selection={quotesResource}
						countResource={quotesResource.count}
						title='Quote history'
						id='quotes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
