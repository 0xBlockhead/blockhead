<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { Entity, EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'

	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(assets)/(markets)/market/[marketKey]', {
			marketKey: stringify(selection.entitySelector.$market),
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.MarketPrice>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
		>
	> = $props()


	// Functions
	const marketAssetSymbol = (
		leg: typeof selection.entitySelector.$market.$base,
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


	import { select } from '$/routes/+layout.svelte'

	const marketPrice = $derived(
		selection(
			({
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
				fields: {
					$parentMarket: true,
					...(open && ({
						$$quotes: {
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
							limit: 32,
						},
					})),
				},
			}),
		),
	)


	// (Derived)
	const marketIdLabel = $derived(
		selection.entitySelector.$market.marketKind === MarketKind.Spot ?
			`${selection.entitySelector.$market.$marketVenue.marketVenueId}:${marketAssetSymbol(selection.entitySelector.$market.$base)}-${marketAssetSymbol(selection.entitySelector.$market.$quote)}`
		:
			`${selection.entitySelector.$market.$marketVenue.marketVenueId}:${marketAssetSymbol(selection.entitySelector.$market.$base)}-${marketAssetSymbol(selection.entitySelector.$market.$quote)} (${marketKindByMarketKind[selection.entitySelector.$market.marketKind].label})`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	{open}
	title={marketIdLabel}
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={marketPrice}
			placeholderText="Loading quotes…"
		>
			{#snippet Pending()}
				<span>
					Quote stream
				</span>
			{/snippet}

			{#snippet children(marketPrice)}
				{@const headQuoteId = (
					marketPrice.$$quotes?.values
						.toSorted((leftQuote, rightQuote) => (
							rightQuote[EntityMetaKey.Selector].timestampMs
								- leftQuote[EntityMetaKey.Selector].timestampMs
						))[0]
						?.[EntityMetaKey.Selector]
				)}
				{#if headQuoteId}
					<Market_TimestampView
						selection={select(EntityType.Market_Timestamp, headQuoteId)}
						layout={EntityLayout.Value}

						showTypeAnnotation={false}
						open={false}
						/>
				{:else}
					<span>
						Quote stream
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{marketIdLabel}
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Latest quote</dt>
				<dd>
					<ResourceBoundary
						resource={marketPrice}
						placeholderText="Loading quotes…"
					>
							{#snippet children(marketPrice)}
								{@const headQuoteId = (
								marketPrice.$$quotes?.values
									.toSorted((leftQuote, rightQuote) => (
										rightQuote[EntityMetaKey.Selector].timestampMs
											- leftQuote[EntityMetaKey.Selector].timestampMs
									))[0]
									?.[EntityMetaKey.Selector]
							)}
							{#if headQuoteId}
								<Market_TimestampView
									selection={select(EntityType.Market_Timestamp, headQuoteId)}
									layout={EntityLayout.Value}

									showTypeAnnotation={false}
									open={false}
									/>
							{:else}
								<div data-row="wrap align-center gap-2">
									<p data-text="muted">
										No spot or index quote yet.
									</p>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Quotes are timestamped marketPrices on <code>Market_Timestamp</code>
												(<code>$quotes</code>), not fields on this stream header.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Quote stream vs timestamp marketPrices"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Parent market</dt>
				<dd>
					<ResourceBoundary
						resource={marketPrice}
						placeholderText="Loading market…"
					>
						{#snippet children(marketPrice)}
							<MarketView
								selection={select(EntityType.Market, marketPrice.$parentMarket?.[EntityMetaKey.Selector] ?? selection.entitySelector.$market)}
								layout={EntityLayout.Title}

								showTypeAnnotation={false}
								open={false}
								/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<Market_TimestampsView
			href={resolve('/markets')}
			collapsible={false}
			selection={selection.$$quotes}

			title="Quotes"
		/>
	{/snippet}
</EntityView>
