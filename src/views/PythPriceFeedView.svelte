<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType } from '$/constants/Market.ts'
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
			$market: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.symbol) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.priceFeedId ?? prefetched.priceFeedId) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed')
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
				{[String((prefetched.symbol) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.priceFeedId ?? prefetched.priceFeedId) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed'}
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
				{[String((selection.entitySelector.channel ?? prefetched.channel) ?? '')].filter(Boolean).join(' ') || [String((prefetched.symbol) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.priceFeedId ?? prefetched.priceFeedId) ?? '')].filter(Boolean).join(' ') || 'Pyth price feed'}
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
					resource={selection[EntityProxyField]<EntityType.Market, false>('$market')}
				>
					{#snippet children(market)}
						{#if market != null && market[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
											quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
					resource={selection[EntityProxyField]<EntityType.Market, false>('$market')}
				>
					{#snippet children(market)}
						{#if market != null && market[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
											quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
							{@const priceFeedId = selection.entitySelector.priceFeedId ?? prefetched.priceFeedId}
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
							{@const channel = selection.entitySelector.channel ?? prefetched.channel}
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
					{@const symbol = prefetched.symbol}
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
					{@const assetClass = prefetched.assetClass}
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
					{@const baseAsset = prefetched.baseAsset}
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
					{@const quoteAsset = prefetched.quoteAsset}
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
				resource={selection[EntityProxyField]<EntityType.Market, false>('$market')}
			>
				{#snippet children(market)}
					{#if market != null && market[EntityMetaKey.Selector] != null}
						<div>
							<dt>Market</dt>
							<dd>
								<MarketView
									selection={select(EntityType.Market, market[EntityMetaKey.Selector])}
									prefetched={market}
									href={
										(market[EntityMetaKey.Selector].$marketVenue !== undefined && market[EntityMetaKey.Selector].$marketVenue.marketVenueId !== undefined && market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.kind !== undefined && (market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coin !== undefined && market[EntityMetaKey.Selector].$base.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance !== undefined && market[EntityMetaKey.Selector].$base.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$base !== undefined && market[EntityMetaKey.Selector].$base.$currency !== undefined && market[EntityMetaKey.Selector].$base.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.kind !== undefined && (market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coin !== undefined && market[EntityMetaKey.Selector].$quote.$coin.coinId !== undefined : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance !== undefined && market[EntityMetaKey.Selector].$quote.$coinInstance.type !== undefined : market[EntityMetaKey.Selector].$quote !== undefined && market[EntityMetaKey.Selector].$quote.$currency !== undefined && market[EntityMetaKey.Selector].$quote.$currency.iso4217 !== undefined)) && market[EntityMetaKey.Selector].marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
											marketVenue: String(market[EntityMetaKey.Selector].$marketVenue.marketVenueId ?? ''),
											baseKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$base.kind)] ?? ''),
											base: String((market[EntityMetaKey.Selector].$base.kind === 'Coin' ? market[EntityMetaKey.Selector].$base.$coin.coinId : market[EntityMetaKey.Selector].$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$base.$coinInstance.type)] : market[EntityMetaKey.Selector].$base.$currency.iso4217)),
											quoteKind: String(marketAssetRouteLabelByKind[String(market[EntityMetaKey.Selector].$quote.kind)] ?? ''),
											quote: String((market[EntityMetaKey.Selector].$quote.kind === 'Coin' ? market[EntityMetaKey.Selector].$quote.$coin.coinId : market[EntityMetaKey.Selector].$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(market[EntityMetaKey.Selector].$quote.$coinInstance.type)] : market[EntityMetaKey.Selector].$quote.$currency.iso4217)),
											marketKind: String(market[EntityMetaKey.Selector].marketKind ?? ''),
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
				selection={selection[EntityProxyField]<EntityType.PythPriceFeed_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No Pyth price feed observations.'
				id='PythPriceFeed_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
