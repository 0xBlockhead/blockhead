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
			selection: EntityProxyResource<typeof schema, EntityType.Market_Derivative_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market_Derivative_Timestamp>>
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

	const marketDerivativeTimestamp = $derived(selection({
		fields: {
			markPrice: true,
			indexPrice: true,
			fundingRate: true,
			openInterestUsd: true,
			indexBasisPercent: true,
			expiredAtMs: true,
			lastTradedAtMs: true,
			providerAssetId: true,
			transport: true,
			$parentMarket: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || 'market derivative timestamp')
	const viewDomId = $derived('market-derivative-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Derivative_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs=nonNegativeInteger]/[feedKey]', {
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
			{[String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market derivative timestamp'}
		{:else}
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market derivative timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.feedKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).markPrice) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexPrice) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market derivative timestamp'}
		{:else}
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).markPrice) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).indexPrice) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).feedKey) ?? '')].filter(Boolean).join(' ') || title || 'market derivative timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.markPrice) ?? ''), String((entity.indexPrice) ?? '')].filter(Boolean).join(' ') || [String((entity.feedKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const fundingRate0 = prefetched.fundingRate}
			{#if fundingRate0 !== undefined && fundingRate0 !== null}
				<span data-text="muted">
					{String((fundingRate0) ?? '')}
					<span>%</span>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{@const fundingRate0 = prefetched.fundingRate}
					{#if fundingRate0 !== undefined && fundingRate0 !== null}
						<span data-text="muted">
							{String((fundingRate0) ?? '')}
							<span>%</span>
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fundingRate0 = entity.fundingRate}
					{#if fundingRate0 !== undefined && fundingRate0 !== null}
						<span data-text="muted">
							{String((fundingRate0) ?? '')}
							<span>%</span>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary resource={marketDerivativeTimestamp}>
						{#snippet Pending()}
							{@const timestampMs = prefetched.timestampMs ?? selection.entitySelector.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const timestampMs = entity.timestampMs ?? selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{@const openInterestUsd = prefetched.openInterestUsd ?? selection.entitySelector.openInterestUsd}
					{#if openInterestUsd !== undefined && openInterestUsd !== null}
						<div>
							<dt>Open interest USD</dt>
							<dd>
								<NumberValue
									value={Number(openInterestUsd)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const openInterestUsd = entity.openInterestUsd ?? selection.entitySelector.openInterestUsd ?? prefetched.openInterestUsd}
					{#if openInterestUsd !== undefined && openInterestUsd !== null}
						<div>
							<dt>Open interest USD</dt>
							<dd>
								<NumberValue
									value={Number(openInterestUsd)}
									formatValueOptions={{ currency: 'USD', showDecimalPlaces: 2, useGrouping: true }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{@const indexBasisPercent = prefetched.indexBasisPercent ?? selection.entitySelector.indexBasisPercent}
					{#if indexBasisPercent !== undefined && indexBasisPercent !== null}
						<div>
							<dt>Index basis percent</dt>
							<dd>
								{String((indexBasisPercent) ?? '')}
								<span>%</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const indexBasisPercent = entity.indexBasisPercent ?? selection.entitySelector.indexBasisPercent ?? prefetched.indexBasisPercent}
					{#if indexBasisPercent !== undefined && indexBasisPercent !== null}
						<div>
							<dt>Index basis percent</dt>
							<dd>
								{String((indexBasisPercent) ?? '')}
								<span>%</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{@const expiredAtMs = prefetched.expiredAtMs ?? selection.entitySelector.expiredAtMs}
					{#if expiredAtMs !== undefined && expiredAtMs !== null}
						<div>
							<dt>Expired at</dt>
							<dd>
								{String((expiredAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const expiredAtMs = entity.expiredAtMs ?? selection.entitySelector.expiredAtMs ?? prefetched.expiredAtMs}
					{#if expiredAtMs !== undefined && expiredAtMs !== null}
						<div>
							<dt>Expired at</dt>
							<dd>
								{String((expiredAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketDerivativeTimestamp}>
				{#snippet Pending()}
					{@const lastTradedAtMs = prefetched.lastTradedAtMs ?? selection.entitySelector.lastTradedAtMs}
					{#if lastTradedAtMs !== undefined && lastTradedAtMs !== null}
						<div>
							<dt>Last traded at</dt>
							<dd>
								{String((lastTradedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const lastTradedAtMs = entity.lastTradedAtMs ?? selection.entitySelector.lastTradedAtMs ?? prefetched.lastTradedAtMs}
					{#if lastTradedAtMs !== undefined && lastTradedAtMs !== null}
						<div>
							<dt>Last traded at</dt>
							<dd>
								{String((lastTradedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={marketDerivativeTimestamp}>
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

			<ResourceBoundary resource={marketDerivativeTimestamp}>
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

			<div>
				<dt>Parent market</dt>
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
