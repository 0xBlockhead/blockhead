<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		formatMarketIdLabel,
		MarketAssetKind,
		MarketKind,
		marketDerivativeObservationSources,
		marketKindLabelByKind,
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
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Market>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


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
	{href}
	{open}
	{...entityViewRest}
	title={formatMarketIdLabel(entityId)}
>
	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>{marketKindLabelByKind[entityId.marketKind]}</dd>
			</div>
			<div>
				<dt>Venue</dt>
				<dd>
					<MarketVenueView
						entityId={entityId.$marketVenue}
						href={resolve(
							'/(assets)/(marketVenues)/market-venue/[marketVenueId]',
							{ marketVenueId: entityId.$marketVenue.marketVenueId },
						)}
						layout={EntityLayout.Title}
						open={false}
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
							href={resolve(
								'/(assets)/(coins)/coin/[coinId]',
								{ coinId: entityId.$base.$coin.coinId },
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$base.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$base.$coinInstance}
							href={resolve(
								'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
								{
									chainId: String(entityId.$base.$coinInstance.$network.chainId),
									coinInstanceSlug: (
										entityId.$base.$coinInstance.type === CoinInstanceType.NativeCurrency ?
											'native'
										:
											entityId.$base.$coinInstance.$contract.address
									),
								},
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							entityId={entityId.$base.$currency}
							href={resolve(
								'/(assets)/(currencies)/currency/[iso4217]',
								{ iso4217: entityId.$base.$currency.iso4217 },
							)}
							layout={EntityLayout.Title}
							open={false}
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
							href={resolve(
								'/(assets)/(coins)/coin/[coinId]',
								{ coinId: entityId.$quote.$coin.coinId },
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$quote.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$quote.$coinInstance}
							href={resolve(
								'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
								{
									chainId: String(entityId.$quote.$coinInstance.$network.chainId),
									coinInstanceSlug: (
										entityId.$quote.$coinInstance.type === CoinInstanceType.NativeCurrency ?
											'native'
										:
											entityId.$quote.$coinInstance.$contract.address
									),
								},
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						<CurrencyView
							entityId={entityId.$quote.$currency}
							href={resolve(
								'/(assets)/(currencies)/currency/[iso4217]',
								{ iso4217: entityId.$quote.$currency.iso4217 },
							)}
							layout={EntityLayout.Title}
							open={false}
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
		{@const pricingHubHref = (
			entityId.$base.kind === MarketAssetKind.Coin ?
				resolve(
					'/(assets)/(coins)/coin/[coinId]',
					{ coinId: entityId.$base.$coin.coinId },
				)
			:
				undefined
		)}
		<EntityDetails
			entityType={EntityType.Market}
			{entityId}
		/>

		{#if entityId.marketKind === MarketKind.Spot}
			<section data-scroll-marker-label="Spot">
				<MarketPricesView
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.Market,
						entityId,
						fieldName: '$$marketPrices',
					}}
					href={pricingHubHref ?? href}
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
