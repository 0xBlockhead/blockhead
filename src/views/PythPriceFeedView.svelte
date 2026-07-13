<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { marketAssetRouteLabelByKind } from '$/constants/Market.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.PythPriceFeed>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PythPriceFeed>>
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
	const pythPriceFeed = $derived(selection({
		sources: [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
			Source.PythPriceFeedsCatalog_Rest,
			Source.Pyth_EvmContract,
			Source.Pyth_SolanaProgram,
		],
		fields: {
			symbol: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.priceFeedId) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed')
	const viewDomId = $derived('pyth-price-feed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PythPriceFeed_TimestampsView from '$/views/PythPriceFeed_TimestampsView.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<EntityView
	entityType={EntityType.PythPriceFeed}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={pythPriceFeed}>
			{#snippet Pending()}
				{[String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.priceFeedId) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={pythPriceFeed}>
			{#snippet Pending()}
				{[String((pendingEntity.channel) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.priceFeedId) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.channel) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={pythPriceFeed}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$market}
				>
					{#snippet children(market)}
						{#if market != null && market[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$market}
				>
					{#snippet children(market)}
						{#if market != null && market[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Price feed ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									priceFeedId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const priceFeedId = pendingEntity.priceFeedId}
							{#if priceFeedId !== undefined && priceFeedId !== null}
								{String((priceFeedId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const priceFeedId = resolvedEntity.priceFeedId}
							{#if priceFeedId !== undefined && priceFeedId !== null}
								{String((priceFeedId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Channel</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									channel: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const channel = pendingEntity.channel}
							{#if channel !== undefined && channel !== null}
								{String((channel) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const channel = resolvedEntity.channel}
							{#if channel !== undefined && channel !== null}
								{String((channel) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const symbol = pendingEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const symbol = resolvedEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetClass: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetClass = pendingEntity.assetClass}
					{#if assetClass !== undefined && assetClass !== null}
						<div>
							<dt>Asset class</dt>
							<dd>
								{String((assetClass) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetClass = resolvedEntity.assetClass}
					{#if assetClass !== undefined && assetClass !== null}
						<div>
							<dt>Asset class</dt>
							<dd>
								{String((assetClass) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseAsset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseAsset = pendingEntity.baseAsset}
					{#if baseAsset !== undefined && baseAsset !== null}
						<div>
							<dt>Base asset</dt>
							<dd>
								{String((baseAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseAsset = resolvedEntity.baseAsset}
					{#if baseAsset !== undefined && baseAsset !== null}
						<div>
							<dt>Base asset</dt>
							<dd>
								{String((baseAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							quoteAsset: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quoteAsset = pendingEntity.quoteAsset}
					{#if quoteAsset !== undefined && quoteAsset !== null}
						<div>
							<dt>Quote asset</dt>
							<dd>
								{String((quoteAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteAsset = resolvedEntity.quoteAsset}
					{#if quoteAsset !== undefined && quoteAsset !== null}
						<div>
							<dt>Quote asset</dt>
							<dd>
								{String((quoteAsset) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$market}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(market)}
					{#if market != null && market[EntityMetaKey.Selector] != null}
						<div>
							<dt>Market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].marketKind !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.assetKey !== undefined && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.assetKey !== undefined && market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined ? resolve('/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', {
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
											base: String(market[EntityMetaKey.Selector].$base.assetKey ?? ''),
											quote: String(market[EntityMetaKey.Selector].$quote.assetKey ?? ''),
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<PythPriceFeed_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Timestamps'
				emptyText='No Pyth price feed observations.'
				id='PythPriceFeed_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
