<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'
	import { Source } from '$/sources/Source.ts'

	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Market>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const marketAssetSymbol = (
		leg: typeof selection.entitySelector.$base,
	) => (
		leg.kind === MarketAssetKind.Coin ?
			leg.$coin.coinId
		: leg.kind === MarketAssetKind.CoinInstance ?
			leg.$coinInstance.type === CoinInstanceType.NativeCurrency ?
				'native'
		:
				'erc20'
		:
			leg.$currency.iso4217
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
	import MarketOhlcHub from '$/views/MarketOhlcHub.svelte'
	import Market_Derivative_TimestampsView from '$/views/Market_Derivative_TimestampsView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	entitySelector={selection.entitySelector}
	href={href ?? resolve(
		'/(assets)/(markets)/market/[marketKey]',
		{
			marketKey: encodeURIComponent(stringify(selection.entitySelector)),
		},
	)}
	{open}
	{collapsible}
	{...EntityViewProps}
	title={
		selection.entitySelector.marketKind === MarketKind.Spot ?
			`${selection.entitySelector.$marketVenue.marketVenueId}:${marketAssetSymbol(selection.entitySelector.$base)}-${marketAssetSymbol(selection.entitySelector.$quote)}`
		:
			`${selection.entitySelector.$marketVenue.marketVenueId}:${marketAssetSymbol(selection.entitySelector.$base)}-${marketAssetSymbol(selection.entitySelector.$quote)} (${marketKindByMarketKind[selection.entitySelector.marketKind].label})`
	}
>
	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>{marketKindByMarketKind[selection.entitySelector.marketKind].label}</dd>
			</div>
			<div>
				<dt>Venue</dt>
				<dd>
					<MarketVenueView
						selection={select(EntityType.MarketVenue, selection.entitySelector.$marketVenue)}
						layout={EntityLayout.Value}
						showTypeAnnotation={false}
						open={false}
					/>
				</dd>
			</div>
			{#if selection.entitySelector.marketKind !== MarketKind.Spot}
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
							<div>
								<dt>Latest derivative observation</dt>
								<dd>
									<Market_Derivative_TimestampView
										selection={select(EntityType.Market_Derivative_Timestamp, derivativeTimestamp[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			<div>
				<dt>Base</dt>
				<dd>
					{#if selection.entitySelector.$base.kind === MarketAssetKind.Coin}
						<CoinView
							selection={select(EntityType.Coin, selection.entitySelector.$base.$coin)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					{:else if selection.entitySelector.$base.kind === MarketAssetKind.CoinInstance}
						{#if '$contract' in selection.entitySelector.$base.$coinInstance && selection.entitySelector.$base.$coinInstance.$network.caip2.namespace === 'eip155'}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$base.$coinInstance)}
								layout={EntityLayout.Value}
								showTypeAnnotation={false}
								open={false}
							/>
						{:else}
							<span>Native currency</span>
						{/if}
					{:else}
						<CurrencyView
							selection={select(EntityType.Currency, selection.entitySelector.$base.$currency)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					{/if}
				</dd>
			</div>
			<div>
				<dt>Quote</dt>
				<dd>
					{#if selection.entitySelector.$quote.kind === MarketAssetKind.Coin}
						<CoinView
							selection={select(EntityType.Coin, selection.entitySelector.$quote.$coin)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					{:else if selection.entitySelector.$quote.kind === MarketAssetKind.CoinInstance}
						{#if '$contract' in selection.entitySelector.$quote.$coinInstance && selection.entitySelector.$quote.$coinInstance.$network.caip2.namespace === 'eip155'}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$quote.$coinInstance)}
								layout={EntityLayout.Value}
								showTypeAnnotation={false}
								open={false}
							/>
						{:else}
							<span>Native currency</span>
						{/if}
					{:else}
						<CurrencyView
							selection={select(EntityType.Currency, selection.entitySelector.$quote.$currency)}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
							open={false}
						/>
					{/if}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const marketSelectorKey = stringify(selection.entitySelector)}
		{#if selection.entitySelector.marketKind === MarketKind.Spot}
			<section data-scroll-marker-label="Spot">
				<MarketPricesView
					href={resolve('/markets')}
					collapsible={false}
					selection={selection.$$marketPrices}
					id={`${marketSelectorKey}:market-prices`}
					title="Spot"
				/>
			</section>

			<section data-scroll-marker-label="OHLC">
				<MarketOhlcHub
					candlesListTitle="Candles"
					id={`${marketSelectorKey}:market-ohlc`}
					market={selection.entitySelector}
				/>
			</section>
		{:else}
			<section data-scroll-marker-label="Derivative observations">
				<Market_Derivative_TimestampsView
					selection={selection.$$derivativeTimestamps}
					id={`${marketSelectorKey}:market-derivative-timestamps`}
					open={true}
				/>
			</section>
		{/if}
	{/snippet}
</EntityView>
