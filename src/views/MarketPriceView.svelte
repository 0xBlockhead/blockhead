<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetByKind } from '$/constants/Market.ts'


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

	const marketPriceLatestResource1 = $derived(
		selection
			.$$quotes({
				limit: 1,
				orderBy: [
					[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
				],
			})
	)

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
					baseKind: String(marketAssetByKind[market.$base.kind].label),
					base: market.$base.assetKey,
					quoteKind: String(marketAssetByKind[market.$quote.kind].label),
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
						resource={marketPriceLatestResource1}
					>
						{#snippet children(marketTimestamps)}
							{@const marketTimestamp = marketTimestamps.values[0]}
							{#if marketTimestamp != null}
								<Market_TimestampView
									selection={select(EntityType.Market_Timestamp, marketTimestamp[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest quote available.</p>
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
					/>
				</dd>
			</div>

			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentMarket}
					>
						{#snippet children(market)}
							{@const marketInitial = untrack(() => market)}
							<MarketView
								selection={select(EntityType.Market, (market ?? marketInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
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
