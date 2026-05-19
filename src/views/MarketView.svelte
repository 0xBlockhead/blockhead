<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		formatMarketIdLabel,
		MarketAssetKind,
	} from '$/constants/Market.ts'
	import { marketVenueById } from '$/constants/MarketVenue.ts'
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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
	import MarketOhlcHub from '$/views/MarketOhlcHub.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={formatMarketIdLabel(entityId)}
>
	{#snippet Heading()}
		{formatMarketIdLabel(entityId)}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Venue</dt>
				<dd>{marketVenueById[entityId.$marketVenue.marketVenueId].label}</dd>
			</div>
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
							layout={EntityLayout.Id}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$base.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$base.$coinInstance}
							href={_href}
							layout={EntityLayout.Id}
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
							layout={EntityLayout.Id}
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
							layout={EntityLayout.Id}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else if entityId.$quote.kind === MarketAssetKind.CoinInstance}
						<CoinInstanceView
							entityId={entityId.$quote.$coinInstance}
							href={_href}
							layout={EntityLayout.Id}
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
							layout={EntityLayout.Id}
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

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
