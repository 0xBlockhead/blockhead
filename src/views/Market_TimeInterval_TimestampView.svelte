<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.Market_TimeInterval_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market_TimeInterval_Timestamp>>
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

	const marketTimeIntervalTimestamp = $derived(selection({
		fields: {
			close: true,
			open: true,
			high: true,
			low: true,
			volume: true,
			quoteVolume: true,
			tradeCount: true,
			vwap: true,
			$parentMarket: true,
		},
	}))
	const titleFallback = $derived([({ ...selection.entitySelector, ...prefetched }).timeInterval == null ? '' : String((`${(({ ...selection.entitySelector, ...prefetched }).timeInterval).value}${(({ ...selection.entitySelector, ...prefetched }).timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || 'OHLC candle')
	const viewDomId = $derived('market-time-interval-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_TimeInterval_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]', {
			marketVenue: entity.$market.$marketVenue.marketVenueId,
			baseKind: marketAssetRouteLabelByKind[entity.$market.$base.kind],
			base: entity.$market.$base.kind === MarketAssetKind.Coin ? entity.$market.$base.$coin.coinId : entity.$market.$base.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$base.$coinInstance.type] : entity.$market.$base.$currency.iso4217,
			quoteKind: marketAssetRouteLabelByKind[entity.$market.$quote.kind],
			quote: entity.$market.$quote.kind === MarketAssetKind.Coin ? entity.$market.$quote.$coin.coinId : entity.$market.$quote.kind === MarketAssetKind.CoinInstance ? marketCoinInstanceRouteLabelByType[entity.$market.$quote.$coinInstance.type] : entity.$market.$quote.$currency.iso4217,
			marketKind: entity.$market.marketKind,
			timeIntervalUnit: String(({ ...selection.entitySelector, ...prefetched }).timeInterval.unit),
			timeIntervalValue: String(({ ...selection.entitySelector, ...prefetched }).timeInterval.value),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[({ ...selection.entitySelector, ...prefetched }).timeInterval == null ? '' : String((`${(({ ...selection.entitySelector, ...prefetched }).timeInterval).value}${(({ ...selection.entitySelector, ...prefetched }).timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || 'OHLC candle'}
		{:else}
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{[({ ...selection.entitySelector, ...prefetched }).timeInterval == null ? '' : String((`${(({ ...selection.entitySelector, ...prefetched }).timeInterval).value}${(({ ...selection.entitySelector, ...prefetched }).timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || 'OHLC candle'}
				{/snippet}

				{#snippet children(entity)}
					{[entity.timeInterval == null ? '' : String((`${(entity.timeInterval).value}${(entity.timeInterval).unit}`) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const close0 = ({ ...selection.entitySelector, ...prefetched }).close}
			{#if close0 !== undefined && close0 !== null}
				<NumberValue
					value={Number(close0) / 1e8}
					formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const close0 = ({ ...selection.entitySelector, ...prefetched }).close}
					{#if close0 !== undefined && close0 !== null}
						<NumberValue
							value={Number(close0) / 1e8}
							formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
						/>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const close0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).close}
					{#if close0 !== undefined && close0 !== null}
						<NumberValue
							value={Number(close0) / 1e8}
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
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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

			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const open = prefetched.open ?? selection.entitySelector.open}
					{#if open !== undefined && open !== null}
						<div>
							<dt>Open</dt>
							<dd>
								<NumberValue
									value={Number(open) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const open = entity.open ?? selection.entitySelector.open ?? prefetched.open}
					{#if open !== undefined && open !== null}
						<div>
							<dt>Open</dt>
							<dd>
								<NumberValue
									value={Number(open) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const high = prefetched.high ?? selection.entitySelector.high}
					{#if high !== undefined && high !== null}
						<div>
							<dt>High</dt>
							<dd>
								<NumberValue
									value={Number(high) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const high = entity.high ?? selection.entitySelector.high ?? prefetched.high}
					{#if high !== undefined && high !== null}
						<div>
							<dt>High</dt>
							<dd>
								<NumberValue
									value={Number(high) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const low = prefetched.low ?? selection.entitySelector.low}
					{#if low !== undefined && low !== null}
						<div>
							<dt>Low</dt>
							<dd>
								<NumberValue
									value={Number(low) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const low = entity.low ?? selection.entitySelector.low ?? prefetched.low}
					{#if low !== undefined && low !== null}
						<div>
							<dt>Low</dt>
							<dd>
								<NumberValue
									value={Number(low) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const volume = prefetched.volume ?? selection.entitySelector.volume}
					{#if volume !== undefined && volume !== null}
						<div>
							<dt>Volume</dt>
							<dd>
								{String((volume) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const volume = entity.volume ?? selection.entitySelector.volume ?? prefetched.volume}
					{#if volume !== undefined && volume !== null}
						<div>
							<dt>Volume</dt>
							<dd>
								{String((volume) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const quoteVolume = prefetched.quoteVolume ?? selection.entitySelector.quoteVolume}
					{#if quoteVolume !== undefined && quoteVolume !== null}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<NumberValue
									value={Number(quoteVolume) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const quoteVolume = entity.quoteVolume ?? selection.entitySelector.quoteVolume ?? prefetched.quoteVolume}
					{#if quoteVolume !== undefined && quoteVolume !== null}
						<div>
							<dt>Quote volume</dt>
							<dd>
								<NumberValue
									value={Number(quoteVolume) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const tradeCount = prefetched.tradeCount ?? selection.entitySelector.tradeCount}
					{#if tradeCount !== undefined && tradeCount !== null}
						<div>
							<dt>Trade count</dt>
							<dd>
								{String((tradeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tradeCount = entity.tradeCount ?? selection.entitySelector.tradeCount ?? prefetched.tradeCount}
					{#if tradeCount !== undefined && tradeCount !== null}
						<div>
							<dt>Trade count</dt>
							<dd>
								{String((tradeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketTimeIntervalTimestamp}>
				{#snippet Pending()}
					{@const vwap = prefetched.vwap ?? selection.entitySelector.vwap}
					{#if vwap !== undefined && vwap !== null}
						<div>
							<dt>Vwap</dt>
							<dd>
								<NumberValue
									value={Number(vwap) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const vwap = entity.vwap ?? selection.entitySelector.vwap ?? prefetched.vwap}
					{#if vwap !== undefined && vwap !== null}
						<div>
							<dt>Vwap</dt>
							<dd>
								<NumberValue
									value={Number(vwap) / 1e8}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Parent Market</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.Market, false>('$parentMarket')}
					>
						{#snippet children(market)}
							<MarketView
								selection={select(EntityType.Market, market.entitySelector)}
								prefetched={market}
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
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
