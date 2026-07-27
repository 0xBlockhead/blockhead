<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Market_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const marketTimestamp = $derived(selection({
		fields: {
			price: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.feedKey ?? '') || 'market timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
			{
				marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId),
				baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)]),
				base: String(selection.entitySelector.$market.$base.assetKey),
				quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)]),
				quote: String(selection.entitySelector.$market.$quote.assetKey),
				marketKind: String(selection.entitySelector.$market.marketKind),
				timestampMs: String(selection.entitySelector.timestampMs),
				feedKey: encodeURIComponent(String(selection.entitySelector.feedKey)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.feedKey ?? '') || 'market timestamp'}
	{/snippet}

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
			<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A point-in-time market quote or metric observation.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					{pendingEntity.feedKey}
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
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
