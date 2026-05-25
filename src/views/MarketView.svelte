<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketDerivativeObservationSources,
		marketKinds,
	} from '$/constants/Market.ts'

	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
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
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Market>
			href?: string
			open?: boolean
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
			`instance-${stringify(leg.$coinInstance).slice(0, 12)}`
		:
			leg.$currency.iso4217
	)


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const market = useEntity(
		EntityType.Market,
		entityId,
		{
			$: (
				entityId.marketKind === MarketKind.Spot ?
					[]
				:
					[...marketDerivativeObservationSources]
			),
			...(open && entityId.marketKind !== MarketKind.Spot && {
				fundingRate: {},
				openInterestUsd: {},
				indexBasisPercent: {},
				expiredAtMs: {},
				derivativeLastTradedAtMs: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
	import MarketOhlcHub from '$/views/MarketOhlcHub.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
	import MarketVenueView from '$/views/MarketVenueView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	{entityId}
	href={href}
	{open}
	{...EntityViewProps}
	title={(
		entityId.marketKind === MarketKind.Spot ?
			`${entityId.$marketVenue.marketVenueId}:${marketAssetSymbol(entityId.$base)}-${marketAssetSymbol(entityId.$quote)}`
		:
			`${entityId.$marketVenue.marketVenueId}:${marketAssetSymbol(entityId.$base)}-${marketAssetSymbol(entityId.$quote)} (${marketKinds[entityId.marketKind].label})`
	)}
>
	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>{marketKinds[entityId.marketKind].label}</dd>
			</div>
			<div>
				<dt>Venue</dt>
				<dd>
					<MarketVenueView
						entityId={entityId.$marketVenue}
						layout={EntityLayout.SummaryDetails}
						open={true}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
			{#if entityId.marketKind !== MarketKind.Spot}
				<ResourceBoundary resource={market}>
					{#if market.fundingRate != null}
						<div>
							<dt>Funding rate</dt>
							<dd>{market.fundingRate}%</dd>
						</div>
					{/if}
					{#if market.openInterestUsd != null}
						<div>
							<dt>Open interest</dt>
							<dd>
								<CurrencyAmount
									currency="USD"
									scale={1}
									value={market.openInterestUsd}
								/>
							</dd>
						</div>
					{/if}
					{#if market.indexBasisPercent != null}
						<div>
							<dt>Index basis</dt>
							<dd>{market.indexBasisPercent}%</dd>
						</div>
					{/if}
					{#if entityId.marketKind === MarketKind.Futures && market.expiredAtMs != null}
						<div>
							<dt>Expires</dt>
							<dd>
								<Timestamp
									timestamp={market.expiredAtMs}
								/>
							</dd>
						</div>
					{/if}
				</ResourceBoundary>
			{/if}
			<div>
				<dt>Base</dt>
				<dd>
					{#if entityId.$base.kind === MarketAssetKind.Coin}
						<CoinView
							entityId={entityId.$base.$coin}
							layout={EntityLayout.SummaryDetails}
							open={true}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$base.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$base.$coinInstance}
							layout={EntityLayout.SummaryDetails}
							open={true}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							entityId={entityId.$base.$currency}
							layout={EntityLayout.SummaryDetails}
							open={true}
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
							layout={EntityLayout.SummaryDetails}
							open={true}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$quote.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$quote.$coinInstance}
							layout={EntityLayout.SummaryDetails}
							open={true}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							entityId={entityId.$quote.$currency}
							layout={EntityLayout.SummaryDetails}
							open={true}
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
		<EntityDetails
			entityType={EntityType.Market}
			{entityId}
		/>
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
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
