<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.Market_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Market_Timestamp>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const marketTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			price: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			price: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || 'market timestamp')
	const viewDomId = $derived('market-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'feedKey' in selection.entitySelector
			&& selection.entitySelector.feedKey != null
			&& selection.entitySelector != null && '$market' in selection.entitySelector
			&& selection.entitySelector.$market != null && 'marketKind' in selection.entitySelector.$market
			&& selection.entitySelector.$market.marketKind != null
			&& selection.entitySelector.$market != null && '$base' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$base != null && 'assetKey' in selection.entitySelector.$market.$base
			&& selection.entitySelector.$market.$base.assetKey != null
			&& selection.entitySelector.$market != null && '$quote' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$quote != null && 'assetKey' in selection.entitySelector.$market.$quote
			&& selection.entitySelector.$market.$quote.assetKey != null
			&& selection.entitySelector.$market != null && '$marketVenue' in selection.entitySelector.$market
			&& selection.entitySelector.$market.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$market.$marketVenue
			&& selection.entitySelector.$market.$marketVenue.marketVenueId != null
			&& selection.entitySelector != null && '$base' in selection.entitySelector
			&& selection.entitySelector.$base != null && 'kind' in selection.entitySelector.$base
			&& selection.entitySelector.$base.kind != null
			&& selection.entitySelector != null && '$quote' in selection.entitySelector
			&& selection.entitySelector.$quote != null && 'kind' in selection.entitySelector.$quote
			&& selection.entitySelector.$quote.kind != null ?
				resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', {
			timestampMs: String(selection.entitySelector.timestampMs ?? ''),
			feedKey: encodeURIComponent(String(selection.entitySelector.feedKey ?? '')),
			marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
			base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
			quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
			marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$base.kind)] ?? ''),
			quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$quote.kind)] ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'price')}
			{[String((pendingEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'price')}
			{@const price0 = pendingEntity.price}
			{#if price0 !== undefined && price0 !== null}
				<NumberValue
					value={Number(price0) / 1e8}
					formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const price0 = resolvedEntity.price}
					{#if price0 !== undefined && price0 !== null}
						<NumberValue
							value={Number(price0) / 1e8}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'price')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
						resource={
							selection({
								sources: selection.sources,
								fields: {
									price: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const price = resolvedEntity.price}
							{#if price !== undefined && price !== null}
								<NumberValue
									value={Number(price) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Feed key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									feedKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const feedKey = resolvedEntity.feedKey}
							{#if feedKey !== undefined && feedKey !== null}
								{String((feedKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							transport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transport = resolvedEntity.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerAssetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerAssetId = resolvedEntity.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							caip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip19 = resolvedEntity.caip19}
					{#if caip19 !== undefined && caip19 !== null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{String((caip19) ?? '')}
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
						href={
							(
								selection.entitySelector.$market != null && 'marketKind' in selection.entitySelector.$market
								&& selection.entitySelector.$market.marketKind != null
								&& selection.entitySelector.$market != null && '$base' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$base != null && 'assetKey' in selection.entitySelector.$market.$base
								&& selection.entitySelector.$market.$base.assetKey != null
								&& selection.entitySelector.$market != null && '$quote' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$quote != null && 'assetKey' in selection.entitySelector.$market.$quote
								&& selection.entitySelector.$market.$quote.assetKey != null
								&& selection.entitySelector.$market != null && '$marketVenue' in selection.entitySelector.$market
								&& selection.entitySelector.$market.$marketVenue != null && 'marketVenueId' in selection.entitySelector.$market.$marketVenue
								&& selection.entitySelector.$market.$marketVenue.marketVenueId != null
								&& selection.entitySelector.$market.$base != null && 'kind' in selection.entitySelector.$market.$base
								&& selection.entitySelector.$market.$base.kind != null
								&& selection.entitySelector.$market.$quote != null && 'kind' in selection.entitySelector.$market.$quote
								&& selection.entitySelector.$market.$quote.kind != null ?
									resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
								marketKind: String(selection.entitySelector.$market.marketKind ?? ''),
								base: String(selection.entitySelector.$market.$base.assetKey ?? ''),
								quote: String(selection.entitySelector.$market.$quote.assetKey ?? ''),
								marketVenue: String(selection.entitySelector.$market.$marketVenue.marketVenueId ?? ''),
								baseKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$base.kind)] ?? ''),
								quoteKind: String(marketAssetRouteLabelByKind[String(selection.entitySelector.$market.$quote.kind)] ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
