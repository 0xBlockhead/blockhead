<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'
	import { marketDerivativeObservationSources } from '$/sources/Source.ts'

	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(selector)),
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Market>
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
		leg: typeof selector.$base,
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


	const market = subscribe(EntityType.Market,
		selector,
		({ sources: (
				selector.marketKind === MarketKind.Spot ?
					[]
				:
					[...marketDerivativeObservationSources]
			), fields: { ...(open && selector.marketKind !== MarketKind.Spot && ({ $$derivativeTimestamps: ({ sources: [
							...marketDerivativeObservationSources,
						], limit: 64 }) })) } }),
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
	entitySelector={selector}
	href={href}
	{open}
	{collapsible}
	{...EntityViewProps}
	title={(
		selector.marketKind === MarketKind.Spot ?
			`${selector.$marketVenue.marketVenueId}:${marketAssetSymbol(selector.$base)}-${marketAssetSymbol(selector.$quote)}`
		:
			`${selector.$marketVenue.marketVenueId}:${marketAssetSymbol(selector.$base)}-${marketAssetSymbol(selector.$quote)} (${marketKindByMarketKind[selector.marketKind].label})`
	)}
>
	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>{marketKindByMarketKind[selector.marketKind].label}</dd>
			</div>
			<div>
				<dt>Venue</dt>
				<dd>
					<MarketVenueView
						selector={selector.$marketVenue}
						layout={EntityLayout.Value}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
				{#if selector.marketKind !== MarketKind.Spot}
					<ResourceBoundary resource={market}>
						{#snippet children(market)}
							{@const derivativeTimestamp = market.fields.$$derivativeTimestamps?.values.at(0)}
							{#if derivativeTimestamp != null}
								<div>
									<dt>Latest derivative observation</dt>
									<dd>
										<Market_Derivative_TimestampView
											selector={derivativeTimestamp[EntityMetaKey.Selector]}
											layout={EntityLayout.Value}
											open={false}
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
					{#if selector.$base.kind === MarketAssetKind.Coin}
						<CoinView
							selector={selector.$base.$coin}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else if selector.$base.kind === MarketAssetKind.CoinInstance}
						<EvmCoinInstanceView
							selector={selector.$base.$coinInstance}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							selector={selector.$base.$currency}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{/if}
				</dd>
			</div>
			<div>
				<dt>Quote</dt>
				<dd>
					{#if selector.$quote.kind === MarketAssetKind.Coin}
						<CoinView
							selector={selector.$quote.$coin}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else if selector.$quote.kind === MarketAssetKind.CoinInstance}
						<EvmCoinInstanceView
							selector={selector.$quote.$coinInstance}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							selector={selector.$quote.$currency}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{/if}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const marketSelectorKey = stringify(selector)}
		{#if selector.marketKind === MarketKind.Spot}
			<section data-scroll-marker-label="Spot">
				<MarketPricesView
					href={resolve('/markets')}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.Market,
						selector,
						fieldName: '$$marketPrices',
					}}
					id={`${marketSelectorKey}:market-prices`}
					title="Spot"
				/>
			</section>

			<section data-scroll-marker-label="OHLC">
				<MarketOhlcHub
					candlesListTitle="Candles"
					id={`${marketSelectorKey}:market-ohlc`}
					market={selector}
				/>
			</section>
		{:else}
			<section data-scroll-marker-label="Derivative observations">
				<Market_Derivative_TimestampsView
					entityFieldReference={{
						entityType: EntityType.Market,
						selector,
						fieldName: '$$derivativeTimestamps',
					}}
					id={`${marketSelectorKey}:market-derivative-timestamps`}
					open={true}
				/>
			</section>
		{/if}
	{/snippet}
</EntityView>
