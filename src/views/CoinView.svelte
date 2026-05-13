<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinInstancesView from '$/views/CoinInstancesView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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
	const coinIdentity = useEntity(
		EntityType.Coin,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.Constants_Internal,
			],
			decimals: {},
			name: {},
			symbol: {},
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
				Source.Defillama_Rest,
				Source.Constants_Internal,
			],
			$$marketPrice: {},
		},
	)

	const spotPriceEntityId = (
		{
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
		} as const
	)
</script>


<EntityView
	entityType={EntityType.Coin}
	{entityId}
	{href}
	{layout}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary resource={coinIdentity}>
			{#snippet children(live)}
				<HeadingComponent>
					{#if href}
						<a
							data-link
							{href}
						>{live.symbol ?? live.name ?? entityId.coinId}</a>
					{:else}
						{live.symbol ?? live.name ?? entityId.coinId}
					{/if}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _contentTitle,
		href: _contentHref,
	})}
		<dl>
			<div>
				<dt>Coin id</dt>
				<dd>{entityId.coinId}</dd>
			</div>
		</dl>
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
		>
			<ResourceBoundary resource={coinIdentity}>
				{#snippet children(live)}
					<dl>
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
					</dl>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${idPrefix}:carousel-pricing`}
				{...{ 'data-card': '' }}
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

				{#snippet children({ open: _detailsOpen })}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="Spot">
							<ResourceBoundary resource={coinSpotPrice}>
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

						<section data-scroll-marker-label="Historical">
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
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${idPrefix}:carousel-markets`}
				{...{ 'data-card': '' }}
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

				{#snippet children({ open: _detailsOpen })}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="As base">
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

						<section data-scroll-marker-label="As quote">
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
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${idPrefix}:carousel-deployments`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Instances
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children({ open: _detailsOpen })}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="Instances">
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
					</div>
				{/snippet}
			</Collapsible>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.carousel {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
