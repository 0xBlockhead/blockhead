<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Iso4217 } from '$/constants/Currency.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(assets)/(markets)/market/[marketKey]', {
			marketKey: stringify(selection.entitySelector.$market),
			}),
		layout,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Market_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'showTypeAnnotation'
		>
	> = $props()


	const marketTimestamp = $derived(selection( { sources: [
				Source.Blockscout_Rest,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.TradingView_Rest,
			], fields: { price: true, ...(open && ({ caip19: true, marketCap: true, volume24h: true, transport: true, providerAssetId: true })) } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
</script>


<EntityView
	entityType={EntityType.Market_Timestamp}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	title="Quote"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			placeholderText="Loading quote…"
			resource={marketTimestamp}
		>
			{#snippet children(marketTimestamp)}
				{#if marketTimestamp.price !== undefined}
					<CurrencyAmount
						currency={selection.entitySelector.$market.$quote.kind === MarketAssetKind.Currency ?
							selection.entitySelector.$market.$quote.$currency.iso4217
						:
							Iso4217.USD}
						showDecimalPlaces={6}
						value={marketTimestamp.price}
					/>
				{:else}
					<Timestamp
						timestamp={selection.entitySelector.timestampMs}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			placeholderText="Loading quote…"
			resource={marketTimestamp}
		>
			{#snippet children(marketTimestamp)}
				{#if marketTimestamp.price !== undefined}
					<CurrencyAmount
						currency={selection.entitySelector.$market.$quote.kind === MarketAssetKind.Currency ?
							selection.entitySelector.$market.$quote.$currency.iso4217
						:
							Iso4217.USD}
							showDecimalPlaces={6}
							value={marketTimestamp.price}
					/>
				{:else}
					<Timestamp
						timestamp={selection.entitySelector.timestampMs}
					/>
				{/if}
	{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A timestamped spot or index observation for the quoted base/against pair.
		</p>
		<p>
			Fields like price, market cap, or volume appear when the upstream feed supplies them.
		</p>
	{/snippet}

	{#snippet Content({})}
		{@const quoteCurrency = (
			selection.entitySelector.$market.$quote.kind === MarketAssetKind.Currency ?
				selection.entitySelector.$market.$quote.$currency.iso4217
			:
				Iso4217.USD
		)}
		<ResourceBoundary
			placeholderText="Loading quote…"
			resource={marketTimestamp}
		>
			{#snippet children(marketTimestamp)}
				<dl data-column-item="center">
					{#if marketTimestamp.price !== undefined}
						<div>
							<dt>Price</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									showDecimalPlaces={6}
									value={marketTimestamp.price}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Quote time</dt>
						<dd>
							<Timestamp
								timestamp={selection.entitySelector.timestampMs}
							/>
						</dd>
					</div>

					<div>
						<dt>Market</dt>
						<dd>
							<MarketView
								selection={select(EntityType.Market, selection.entitySelector.$market)}
								layout={EntityLayout.Title}

								open={false}
								/>
						</dd>
					</div>

					{#if (
						open
						&& marketTimestamp.marketCap !== undefined
					)}
						<div>
							<dt>Market cap</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									value={marketTimestamp.marketCap}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimestamp.volume24h !== undefined
					)}
						<div>
							<dt>24h volume</dt>
							<dd>
								<CurrencyAmount
									currency={quoteCurrency}
									value={marketTimestamp.volume24h}
								/>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimestamp.caip19 !== undefined
					)}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								<code>{marketTimestamp.caip19}</code>
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimestamp.transport !== undefined
					)}
						<div>
							<dt>Transport</dt>
							<dd>
								{marketTimestamp.transport}
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& marketTimestamp.providerAssetId != null
					)}
						<div>
							<dt>Provider asset id</dt>
							<dd>
								{marketTimestamp.providerAssetId}
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
