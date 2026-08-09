<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.Market_Timestamp>, 'prefetched'> = $props()

	const market = $derived(selection.entitySelector.$market)
	const marketTimestamp = $derived(selection({
		fields: {
			price: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.feedKey || 'market timestamp')}
	href={
		href === undefined ?
			resolve(
				'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
				{
					marketVenue: market.$marketVenue.marketVenueId,
					baseKind: String(marketAssetByKind[market.$base.kind].label),
					base: market.$base.assetKey,
					quoteKind: String(marketAssetByKind[market.$quote.kind].label),
					quote: market.$quote.assetKey,
					marketKind: market.marketKind,
					timestampMs: String(selection.entitySelector.timestampMs),
					feedKey: encodeURIComponent(selection.entitySelector.feedKey),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={marketTimestamp}>
			{#snippet children(entity)}
				<NumberValue
					value={Number(entity.price) / 1e8}
					formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Price</dt>
				<dd>
					<ResourceBoundary
						resource={marketTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={Number(entity.price) / 1e8}
								formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					{selection.entitySelector.feedKey}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transport = entity.transport}
					{#if transport != null}
						<div>
							<dt>Transport</dt>
							<dd>
								{transport}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerAssetId = entity.providerAssetId}
					{#if providerAssetId != null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{providerAssetId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							caip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const caip19 = entity.caip19}
					{#if caip19 != null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{caip19}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Market</dt>
				<dd>
					<MarketView
						selection={select(EntityType.Market, selection.entitySelector.$market)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
