<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Market_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market_Timestamp>>
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

	const marketTimestamp = $derived(selection({
		fields: {
			price: true,
			marketCap: true,
			volume24h: true,
			transport: true,
			providerAssetId: true,
			caip19: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || 'market timestamp')
	const viewDomId = $derived('market-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs=nonNegativeInteger]/[feedKey]', {
			marketVenue: entity.$market.$marketVenue.marketVenueId,
			baseKind: marketAssetRouteLabelByKind[entity.$market.$base.kind],
			base: entity.$market.$base.kind === MarketAssetKind.Coin ? entity.$market.$base.$coin.coinId : entity.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$base.$coinInstance.type] : entity.$market.$base.$currency.iso4217,
			quoteKind: marketAssetRouteLabelByKind[entity.$market.$quote.kind],
			quote: entity.$market.$quote.kind === MarketAssetKind.Coin ? entity.$market.$quote.$coin.coinId : entity.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$quote.$coinInstance.type] : entity.$market.$quote.$currency.iso4217,
			marketKind: entity.$market.marketKind,
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			feedKey: String(({ ...selection.entitySelector, ...prefetched }).feedKey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market timestamp'}
		{:else}
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const price0 = ({ ...selection.entitySelector, ...prefetched }).price}
			{#if price0 !== undefined && price0 !== null}
				<NumberValue
					value={Number(price0) / 1e8}
					formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const price0 = ({ ...selection.entitySelector, ...prefetched }).price}
					{#if price0 !== undefined && price0 !== null}
						<NumberValue
							value={Number(price0) / 1e8}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const price0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).price}
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = prefetched.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = prefetched.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = entity.timestampMs}
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
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const marketCap = prefetched.marketCap ?? selection.entitySelector.marketCap}
					{#if marketCap !== undefined && marketCap !== null}
						<div>
							<dt>Market cap</dt>
							<dd>
								<NumberValue
									value={Number(marketCap)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const marketCap = entity.marketCap ?? selection.entitySelector.marketCap ?? prefetched.marketCap}
					{#if marketCap !== undefined && marketCap !== null}
						<div>
							<dt>Market cap</dt>
							<dd>
								<NumberValue
									value={Number(marketCap)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const volume24h = prefetched.volume24h ?? selection.entitySelector.volume24h}
					{#if volume24h !== undefined && volume24h !== null}
						<div>
							<dt>24h volume</dt>
							<dd>
								<NumberValue
									value={Number(volume24h)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const volume24h = entity.volume24h ?? selection.entitySelector.volume24h ?? prefetched.volume24h}
					{#if volume24h !== undefined && volume24h !== null}
						<div>
							<dt>24h volume</dt>
							<dd>
								<NumberValue
									value={Number(volume24h)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const transport = prefetched.transport ?? selection.entitySelector.transport}
					{#if transport !== undefined && transport !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const transport = entity.transport ?? selection.entitySelector.transport ?? prefetched.transport}
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

			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const providerAssetId = prefetched.providerAssetId ?? selection.entitySelector.providerAssetId}
					{#if providerAssetId !== undefined && providerAssetId !== null}
						<div>
							<dt>Provider asset ID</dt>
							<dd>
								{String((providerAssetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const providerAssetId = entity.providerAssetId ?? selection.entitySelector.providerAssetId ?? prefetched.providerAssetId}
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

			<ResourceBoundary resource={marketTimestamp}>
				{#snippet Pending()}
					{@const caip19 = prefetched.caip19 ?? selection.entitySelector.caip19}
					{#if caip19 !== undefined && caip19 !== null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{String((caip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const caip19 = entity.caip19 ?? selection.entitySelector.caip19 ?? prefetched.caip19}
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
							resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
								marketVenue: entity.$marketVenue.marketVenueId,
								baseKind: marketAssetRouteLabelByKind[entity.$base.kind],
								base: entity.$base.kind === MarketAssetKind.Coin ? entity.$base.$coin.coinId : entity.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$base.$coinInstance.type] : entity.$base.$currency.iso4217,
								quoteKind: marketAssetRouteLabelByKind[entity.$quote.kind],
								quote: entity.$quote.kind === MarketAssetKind.Coin ? entity.$quote.$coin.coinId : entity.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$quote.$coinInstance.type] : entity.$quote.$currency.iso4217,
								marketKind: entity.marketKind,
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
