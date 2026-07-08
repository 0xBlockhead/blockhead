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
	import { MarketAssetKind, marketAssetRouteLabelByKind, marketCoinInstanceRouteLabelByType, MarketKind, marketKindByMarketKind } from '$/constants/Market.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { Source } from '$/sources/Source.ts'
	import CoinView from '$/views/CoinView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.Market>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Market>>
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
	const market = $derived(selection({}))
	const titleFallback = $derived('Market')
	const viewDomId = $derived('market-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import Market_TimeInterval_TimestampsView from '$/views/Market_TimeInterval_TimestampsView.svelte'
	import Market_Derivative_TimestampsView from '$/views/Market_Derivative_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$marketVenue !== undefined && pendingEntity.$marketVenue.marketVenueId !== undefined && pendingEntity.$base !== undefined && pendingEntity.$base.kind !== undefined && (pendingEntity.$base !== undefined && pendingEntity.$base.kind !== undefined && (pendingEntity.$base.kind === 'Coin' ? pendingEntity.$base !== undefined && pendingEntity.$base.$coin !== undefined && pendingEntity.$base.$coin.coinId !== undefined : pendingEntity.$base.kind === 'CoinInstance' ? pendingEntity.$base !== undefined && pendingEntity.$base.$coinInstance !== undefined && pendingEntity.$base.$coinInstance.type !== undefined : pendingEntity.$base !== undefined && pendingEntity.$base.$currency !== undefined && pendingEntity.$base.$currency.iso4217 !== undefined)) && pendingEntity.$quote !== undefined && pendingEntity.$quote.kind !== undefined && (pendingEntity.$quote !== undefined && pendingEntity.$quote.kind !== undefined && (pendingEntity.$quote.kind === 'Coin' ? pendingEntity.$quote !== undefined && pendingEntity.$quote.$coin !== undefined && pendingEntity.$quote.$coin.coinId !== undefined : pendingEntity.$quote.kind === 'CoinInstance' ? pendingEntity.$quote !== undefined && pendingEntity.$quote.$coinInstance !== undefined && pendingEntity.$quote.$coinInstance.type !== undefined : pendingEntity.$quote !== undefined && pendingEntity.$quote.$currency !== undefined && pendingEntity.$quote.$currency.iso4217 !== undefined)) && pendingEntity.marketKind !== undefined ? resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
			marketVenue: String(pendingEntity.$marketVenue.marketVenueId ?? ''),
			baseKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$base.kind)] ?? ''),
			base: String((pendingEntity.$base.kind === 'Coin' ? pendingEntity.$base.$coin.coinId : pendingEntity.$base.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(pendingEntity.$base.$coinInstance.type)] : pendingEntity.$base.$currency.iso4217)),
			quoteKind: String(marketAssetRouteLabelByKind[String(pendingEntity.$quote.kind)] ?? ''),
			quote: String((pendingEntity.$quote.kind === 'Coin' ? pendingEntity.$quote.$coin.coinId : pendingEntity.$quote.kind === 'CoinInstance' ? marketCoinInstanceRouteLabelByType[String(pendingEntity.$quote.$coinInstance.type)] : pendingEntity.$quote.$currency.iso4217)),
			marketKind: String(pendingEntity.marketKind ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(selection.entitySelector.$marketVenue).marketVenueId}:{
			(selection.entitySelector.$base).kind === MarketAssetKind.Coin ?
				((selection.entitySelector.$base).$coin).coinId
			: (selection.entitySelector.$base).kind === MarketAssetKind.CoinInstance ?
				((selection.entitySelector.$base).$coinInstance).type === CoinInstanceType.NativeCurrency ?
					'native'
				:
					'erc20'
			:
				((selection.entitySelector.$base).$currency).iso4217
		}-{
			(selection.entitySelector.$quote).kind === MarketAssetKind.Coin ?
				((selection.entitySelector.$quote).$coin).coinId
			: (selection.entitySelector.$quote).kind === MarketAssetKind.CoinInstance ?
				((selection.entitySelector.$quote).$coinInstance).type === CoinInstanceType.NativeCurrency ?
					'native'
				:
					'erc20'
			:
				((selection.entitySelector.$quote).$currency).iso4217
		}
		{#if selection.entitySelector.marketKind !== MarketKind.Spot}
			{String(marketKindByMarketKind[String(selection.entitySelector.marketKind)].label)}
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<section data-column="gap-2">
			<dl data-column-item="center">
				<div>
					<dt>Kind</dt>
					<dd>
						{String(marketKindByMarketKind[String(selection.entitySelector.marketKind)].label)}
					</dd>
				</div>

				<div>
					<dt>Venue</dt>
					<dd>
						<MarketVenueView
							href={resolve('/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', {
								marketVenueId: String((selection.entitySelector.$marketVenue).marketVenueId),
							})}
							selection={select(EntityType.MarketVenue, selection.entitySelector.$marketVenue)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					</dd>
				</div>

				{#if (
					contentOpen
					&& selection.entitySelector.marketKind !== MarketKind.Spot
				)}
					<div>
						<dt>Latest derivative observation</dt>
						<dd>
							<ResourceBoundary
								resource={selection.$$derivativeTimestamps({
									sources: [
										Source.Coingecko_OpenApi,
									],
									limit: 64,
								})}
							>
								{#snippet children(derivativeTimestamps)}
									{@const derivativeTimestamp = derivativeTimestamps.values.at(0)}
									{#if derivativeTimestamp != null}
										<Market_Derivative_TimestampView
											selection={select(EntityType.Market_Derivative_Timestamp, derivativeTimestamp[EntityMetaKey.Selector])}
											layout={EntityLayout.Value}
											showTypeAnnotation={false}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				<div>
					<dt>Base</dt>
					<dd>
						{#if (selection.entitySelector.$base).kind === MarketAssetKind.Coin}
							<CoinView
								href={resolve('/(assets)/coin/[coinId]', {
									coinId: String(((selection.entitySelector.$base).$coin).coinId),
								})}
								selection={select(EntityType.Coin, (selection.entitySelector.$base).$coin)}
								layout={EntityLayout.Value}
								showTypeAnnotation={false}
								open={false}
							/>
						{:else if (selection.entitySelector.$base).kind === MarketAssetKind.CoinInstance}
							{#if ((selection.entitySelector.$base).$coinInstance).type === CoinInstanceType.NativeCurrency}
								<span>Native currency</span>
							{:else if ((((selection.entitySelector.$base).$coinInstance).$network).caip2).namespace === 'eip155'}
								<EvmCoinInstanceView
									href={resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
										chainId: String(((((selection.entitySelector.$base).$coinInstance).$network).caip2).reference),
										coinInstanceSlug: String((((selection.entitySelector.$base).$coinInstance).$contract).address),
									})}
									selection={select(EntityType.EvmCoinInstance, (selection.entitySelector.$base).$coinInstance)}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
									open={false}
								/>
							{/if}
						{:else}
							<span>{String(((selection.entitySelector.$base).$currency).iso4217)}</span>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Quote</dt>
					<dd>
						{#if (selection.entitySelector.$quote).kind === MarketAssetKind.Coin}
							<CoinView
								href={resolve('/(assets)/coin/[coinId]', {
									coinId: String(((selection.entitySelector.$quote).$coin).coinId),
								})}
								selection={select(EntityType.Coin, (selection.entitySelector.$quote).$coin)}
								layout={EntityLayout.Value}
								showTypeAnnotation={false}
								open={false}
							/>
						{:else if (selection.entitySelector.$quote).kind === MarketAssetKind.CoinInstance}
							{#if ((selection.entitySelector.$quote).$coinInstance).type === CoinInstanceType.NativeCurrency}
								<span>Native currency</span>
							{:else if ((((selection.entitySelector.$quote).$coinInstance).$network).caip2).namespace === 'eip155'}
								<EvmCoinInstanceView
									href={resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
										chainId: String(((((selection.entitySelector.$quote).$coinInstance).$network).caip2).reference),
										coinInstanceSlug: String((((selection.entitySelector.$quote).$coinInstance).$contract).address),
									})}
									selection={select(EntityType.EvmCoinInstance, (selection.entitySelector.$quote).$coinInstance)}
									layout={EntityLayout.Value}
									showTypeAnnotation={false}
									open={false}
								/>
							{/if}
						{:else}
							<span>{String(((selection.entitySelector.$quote).$currency).iso4217)}</span>
						{/if}
					</dd>
				</div>
			</dl>
		</section>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-details-tabs'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						...(selection.entitySelector.marketKind === 'Spot' ? [
							{
								id: 'spot',
								label: 'Spot',
							},
						] : []),
						...(selection.entitySelector.marketKind === 'Spot' ? [
							{
								id: 'ohlc',
								label: 'OHLC',
							},
						] : []),
						...(selection.entitySelector.marketKind !== 'Spot' ? [
							{
								id: 'derivatives',
								label: 'Derivative observations',
							},
						] : []),
					]
				}
				data-card
			>
				{#snippet SectionSpot({ id, label })}
					{#if selection.entitySelector.marketKind === 'Spot'}
						<MarketPricesView
							selection={
								selection.$$marketPrices({
									sources: [
										Source.Constants_Internal,
										Source.Coingecko_Rest,
										Source.Coingecko_OpenApi,
										Source.CoinMarketCap_Rest,
										Source.Coinpaprika_OpenApi,
										Source.Defillama_OpenApi,
										Source.Blockscout_Rest,
										Source.Defillama_Rest,
									],
								})
							}
							title='Spot'
							href={resolve('/(assets)/markets')}
							id={`${id}-spot-list`}
						/>
					{/if}
				{/snippet}

				{#snippet SectionOhlc({ id, label })}
					{#if selection.entitySelector.marketKind === 'Spot'}
						<Market_TimeInterval_TimestampsView
							selection={
								selection.$$marketTimeIntervalTimestamps({
									sources: [
										Source.Coingecko_Rest,
										Source.Coingecko_OpenApi,
										Source.Coinpaprika_OpenApi,
										Source.CoinMarketCap_Rest,
									],
								})
							}
							title='Candles'
							href={resolve('/(assets)/coins/candles')}
							id={`${id}-ohlc-list`}
						/>
					{/if}
				{/snippet}

				{#snippet SectionDerivatives({ id, label })}
					{#if selection.entitySelector.marketKind !== 'Spot'}
						<Market_Derivative_TimestampsView
							selection={
								selection.$$derivativeTimestamps({
									sources: [
										Source.Coingecko_OpenApi,
									],
								})
							}
							title='Derivative observations'
							id={`${id}-derivatives-list`}
						/>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
