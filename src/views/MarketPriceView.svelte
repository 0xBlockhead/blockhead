<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'

	import {
		MarketAssetKind,
		MarketKind,
		marketKindByMarketKind,
	} from '$/constants/Market.ts'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { evmChainIdFromNetworkId } from '$/lib/caip.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(markets)/market/[marketKey]',
			{
				marketKey: encodeURIComponent(stringify(entityId.$market)),
			},
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MarketPrice>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'id'
			| 'layout'
		>
	> = $props()


	// Functions
	const marketAssetSymbol = (
		leg: typeof entityId.$market.$base,
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
			$$parentMarket: {},
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
		},
	)


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
	import Market_TimestampView from '$/views/Market_TimestampView.svelte'
	import Market_TimestampsView from '$/views/Market_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketPrice}
	{entityId}
	href={href}
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
							leftQuote,
							rightQuote,
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
								`Chain ${String(evmChainIdFromNetworkId(entityId.$network))}`
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

	{#snippet Content({ title: _title, href: _href })}
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
										leftQuote,
										rightQuote,
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
												Quotes are timestamped rows on <code>Market_Timestamp</code>
												(<code>$$quotes</code>), not fields on this stream header.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Quote stream vs timestamp rows"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							{/if}
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
