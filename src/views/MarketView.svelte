<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketDerivativeObservationSources,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'

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
		entityId,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(entityId)),
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Market>
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
		leg: typeof entityId.$base,
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
		entityId,
		({ sources: (
				entityId.marketKind === MarketKind.Spot ?
					[]
				:
					[...marketDerivativeObservationSources]
			), fields: { ...(open && entityId.marketKind !== MarketKind.Spot && ({ $$derivativeTimestamps: ({ sources: [
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
	{entityId}
	href={href}
	{open}
	{collapsible}
	{...EntityViewProps}
	title={(
		entityId.marketKind === MarketKind.Spot ?
			`${entityId.$marketVenue.marketVenueId}:${marketAssetSymbol(entityId.$base)}-${marketAssetSymbol(entityId.$quote)}`
		:
			`${entityId.$marketVenue.marketVenueId}:${marketAssetSymbol(entityId.$base)}-${marketAssetSymbol(entityId.$quote)} (${marketKindByMarketKind[entityId.marketKind].label})`
	)}
>
	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>{marketKindByMarketKind[entityId.marketKind].label}</dd>
			</div>
			<div>
				<dt>Venue</dt>
				<dd>
					<MarketVenueView
						entityId={entityId.$marketVenue}
						layout={EntityLayout.Value}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
				{#if entityId.marketKind !== MarketKind.Spot}
					<ResourceBoundary resource={market}>
						{#snippet children(market)}
							{@const derivativeTimestamp = market.fields.$$derivativeTimestamps?.values.at(0)}
							{#if derivativeTimestamp != null}
								<div>
									<dt>Latest derivative observation</dt>
									<dd>
										<Market_Derivative_TimestampView
											entityId={derivativeTimestamp[EntityMetaKey.Id]}
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
					{#if entityId.$base.kind === MarketAssetKind.Coin}
						<CoinView
							entityId={entityId.$base.$coin}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$base.kind === MarketAssetKind.CoinInstance}
						<EvmCoinInstanceView
							entityId={entityId.$base.$coinInstance}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							entityId={entityId.$base.$currency}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{/if}
				</dd>
			</div>
			<div>
				<dt>Quote</dt>
				<dd>
					{#if entityId.$quote.kind === MarketAssetKind.Coin}
						<CoinView
							entityId={entityId.$quote.$coin}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$quote.kind === MarketAssetKind.CoinInstance}
						<EvmCoinInstanceView
							entityId={entityId.$quote.$coinInstance}
							layout={EntityLayout.Value}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							entityId={entityId.$quote.$currency}
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
		{@const marketIdKey = stringify(entityId)}
		{#if entityId.marketKind === MarketKind.Spot}
			<section data-scroll-marker-label="Spot">
				<MarketPricesView
					href={resolve('/markets')}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.Market,
						entityId,
						fieldName: '$$marketPrices',
					}}
					id={`${marketIdKey}:market-prices`}
					title="Spot"
				/>
			</section>

			<section data-scroll-marker-label="OHLC">
				<MarketOhlcHub
					candlesListTitle="Candles"
					id={`${marketIdKey}:market-ohlc`}
					market={entityId}
				/>
			</section>
		{:else}
			<section data-scroll-marker-label="Derivative observations">
				<Market_Derivative_TimestampsView
					entityFieldReference={{
						entityType: EntityType.Market,
						entityId,
						fieldName: '$$derivativeTimestamps',
					}}
					id={`${marketIdKey}:market-derivative-timestamps`}
					open={true}
				/>
			</section>
		{/if}
	{/snippet}
</EntityView>
