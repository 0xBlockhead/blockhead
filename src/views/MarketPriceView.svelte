<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(assets)/(markets)/market/[marketKey]', {
			marketKey: stringify(entityId.$market),
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MarketPrice>
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
		leg: typeof entityId.$market.$base,
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


	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const marketPrice = useEntity(
		EntityType.MarketPrice,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.TradingView_Rest,
				Source.Blockscout_Rest,
			],
			$parentMarket: {},
			...((open || layout === EntityLayout.Value) && {
			$$quotes: {
				$: [
					Source.Blockscout_Rest,
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.CoinMarketCap_Rest,
					Source.Coinpaprika_OpenApi,
					Source.Defillama_OpenApi,
					Source.TradingView_Rest,
				],
				$limit: 32,
			},
			}),
		},
	)


	// (Derived)
	const marketIdLabel = $derived(
		entityId.$market.marketKind === MarketKind.Spot ?
			`${entityId.$market.$marketVenue.marketVenueId}:${marketAssetSymbol(entityId.$market.$base)}-${marketAssetSymbol(entityId.$market.$quote)}`
		:
			`${entityId.$market.$marketVenue.marketVenueId}:${marketAssetSymbol(entityId.$market.$base)}-${marketAssetSymbol(entityId.$market.$quote)} (${marketKindByMarketKind[entityId.$market.marketKind].label})`
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import MarketView from '$/views/MarketView.svelte'
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	{entityId}
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
			{#snippet children(marketPrice)}
				{@const headQuoteId = (
					(marketPrice.$$quotes ?? [])
						.toSorted((
							leftQuote: Entity<typeof schema, EntityType.Market_Timestamp>,
							rightQuote: Entity<typeof schema, EntityType.Market_Timestamp>,
						) => (
							rightQuote[EntityMetaKey.Id].timestampMs
								- leftQuote[EntityMetaKey.Id].timestampMs
						))[0]
						?.[EntityMetaKey.Id]
				)}
				{#if headQuoteId}
					<Market_TimestampView
						entityId={headQuoteId}
						layout={EntityLayout.Value}
						open={false}
						showTypeAnnotation={false}
					/>
				{:else}
					<span>
						{(
							entityId.feedKey != null && entityId.feedKey !== '' ?
								entityId.feedKey
							: entityId.$network != null ?
								`Chain ${String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}`
							:
								'Quote stream'
						)}
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
								(marketPrice.$$quotes ?? [])
									.toSorted((
										leftQuote: Entity<typeof schema, EntityType.Market_Timestamp>,
										rightQuote: Entity<typeof schema, EntityType.Market_Timestamp>,
									) => (
										rightQuote[EntityMetaKey.Id].timestampMs
											- leftQuote[EntityMetaKey.Id].timestampMs
									))[0]
									?.[EntityMetaKey.Id]
							)}
							{#if headQuoteId}
								<Market_TimestampView
									entityId={headQuoteId}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
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
												(<code>$$quotes</code>), not fields on this stream header.
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
								entityId={marketPrice.$parentMarket?.[EntityMetaKey.Id] ?? entityId.$market}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
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
			href="/markets"
			collapsible={false}
			entityFieldReference={{
				entityType: EntityType.MarketPrice,
				entityId,
				fieldName: '$$quotes',
			}}
			open={false}
			title="Quotes"
		/>
	{/snippet}
</EntityView>
