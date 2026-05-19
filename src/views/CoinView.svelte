<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import { EntityLayout } from '$/components/EntityView.svelte'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Coin>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coinIdentity = useEntity(
		EntityType.Coin,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.Constants_Internal,
			],
			decimals: {},
			name: {},
			symbol: {},
			marketCapRank: {},
			marketCapUsd: {},
		},
	)

	const coinSpotPrice = useEntity(
		EntityType.Coin,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.Constants_Internal,
			],
			...(open ?
				{
					$$marketPrice: {},
				}
				:
				{}),
		},
	)

	const spotPriceEntityId =
		({
			$market: {
				$base: {
					kind: MarketAssetKind.Coin,
					$coin: { coinId: entityId.coinId },
				},
				$quote: {
					kind: MarketAssetKind.Currency,
					iso4217: 'USD',
				},
				$marketVenue: {
					marketVenueId: MarketVenueId.SpotIndex,
				},
			},
		}) satisfies EntityId<
			typeof schema,
			EntityType.MarketPrice
		>

	const hideHeadingSecondaryCoinSlugMatchesHeadingFallback = $derived(
		coinIdentity.ready
		&& coinIdentity.current.symbol === undefined
		&& coinIdentity.current.name === undefined,
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinInstancesView from '$/views/CoinInstancesView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	bind:open
	{entityId}
	{href}
	{layout}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={coinIdentity}
			placeholderText="Loading…"
		>
			{#snippet children(live)}
				{live.symbol ?? live.name ?? entityId.coinId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.coinId}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A logical <strong>CAIP-19 coin</strong>
			id groups every on-chain deployment, time-stamped fundamentals snapshots, and market quote streams for the same asset so duplicate tickers from rival data vendors stay separable by catalog key and vendor attribution.
		</p>
		<p>
			Each <strong>coin instance</strong>
			row is anchored on one execution chain—either the native gas asset or a token contract—while sharing the same catalog coin id across networks.
		</p>
	{/snippet}

	{#snippet Content({
		title: _contentTitle,
		href: _contentHref,
	})}
		<ResourceBoundary resource={coinIdentity}>
			{#snippet children(live)}
				<dl data-column-item="center">
					{#if !hideHeadingSecondaryCoinSlugMatchesHeadingFallback}
						<div>
							<dt>Coin id</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
					{/if}

					{#if live.marketCapRank != null && Number.isFinite(live.marketCapRank)}
						<div>
							<dt>Market cap rank</dt>
							<dd>{String(live.marketCapRank)}</dd>
						</div>
					{/if}

					{#if live.marketCapUsd != null && Number.isFinite(live.marketCapUsd)}
						<div>
							<dt>Market cap (USD)</dt>
							<dd>{String(live.marketCapUsd)}</dd>
						</div>
					{/if}

					{#if open}
						{#if live.name !== undefined}
							<div>
								<dt>Name</dt>
								<dd>{live.name}</dd>
							</div>
						{/if}

						{#if live.decimals !== undefined}
							<div>
								<dt>Decimals</dt>
								<dd>{String(live.decimals)}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const idPrefix = stringify(entityId)}
		{@const coinPageHref = resolve(
			'/(assets)/(coins)/coin/[coinId]',
			{ coinId: entityId.coinId },
		)}
		<EntityDetails
			entityType={EntityType.Coin}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idPrefix}:carousel-pricing`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Price
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Spot"
						href={`#${idPrefix}:price`}
					>Spot</a>
					<a
						data-scroll-marker-label="Historical"
						href={`#${idPrefix}:market-price-ranges`}
					>Historical</a>
				{/snippet}

				{#snippet children({ open: _detailsOpen })}
					<section>
							<ResourceBoundary
								placeholderText="Loading spot price…"
								resource={coinSpotPrice}
							>
								{#snippet children(priceLive)}
									<MarketPriceView
										entityId={
											priceLive.$$marketPrice === undefined ?
												spotPriceEntityId
											:
												priceLive.$$marketPrice[EntityMetaKey.Id]
										}
										href={coinPageHref}
										id={`${idPrefix}:price`}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</section>

						<section>
							<MarketPriceRangesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Coin,
									entityId,
									fieldName: '$$marketPriceRanges',
								}}
								href={coinPageHref}
								id={`${idPrefix}:market-price-ranges`}
								title="Historical"
							/>
						</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idPrefix}:carousel-markets`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Markets
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="As base"
						href={`#${idPrefix}:markets-as-base`}
					>As base</a>
					<a
						data-scroll-marker-label="As quote"
						href={`#${idPrefix}:markets-as-quote`}
					>As quote</a>
				{/snippet}

				{#snippet children({ open: _detailsOpen })}
					<section>
						<MarketsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$marketsWithCoinAsBase',
							}}
							href={resolve('/(assets)/(coins)/coin/[coinId]', {
								coinId: entityId.coinId,
							})}
							id={`${idPrefix}:markets-as-base`}
							title="As base"
						/>
					</section>

					<section>
						<MarketsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$marketsWithCoinAsQuote',
							}}
							href={resolve('/(assets)/(coins)/coin/[coinId]', {
								coinId: entityId.coinId,
							})}
							id={`${idPrefix}:markets-as-quote`}
							title="As quote"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idPrefix}:carousel-deployments`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Execution deployments
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Instances"
						href={`#${idPrefix}:coin-instances`}
					>Deployments</a>
				{/snippet}

				{#snippet children({ open: _detailsOpen })}
					<section>
						<CoinInstancesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.Coin,
								entityId,
								fieldName: '$$coinInstances',
							}}
							{href}
							id={`${idPrefix}:coin-instances`}
							title="Instances"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
