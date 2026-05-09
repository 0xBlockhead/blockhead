<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { MarketVenueId } from '$/constants/MarketVenue.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import CoinSchema from '$/schema/Coin.ts'
	import { Source } from '$/sources/$Source.ts'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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
			entityId: typeof CoinSchema.id.infer
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			'entityType' | 'entityId' | 'href' | 'layout' | 'open' | 'title' | 'Details' | 'Content'
		>
	> = $props()


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityFieldCollections,
	} from '$/routes/+layout.svelte'


	const coinEntityMergeSourceOrder = [
		Source.Coingecko_Rest,
		Source.CoinMarketCap_Rest,
		Source.Coinpaprika_OpenApi,
		Source.Defillama_Rest,
		Source.Constants_Internal,
	] as const


	// (Derived)
	const coinIdKey = $derived(
		stringify(entityId),
	)

	const coinQuery = useEntity(
		EntityType.Coin,
		entityId,
		{
			$: coinEntityMergeSourceOrder,
			decimals: {},
			name: {},
			symbol: {},
		},
	)

	const coinHref = $derived(
		resolve('/(assets)/(coins)/coin/[coinId]', {
			coinId: entityId.coinId,
		}),
	)

	const displayTitle = $derived(
		coinQuery.data?.symbol ?? coinQuery.data?.name ?? entityId.coinId,
	)

	const shouldMountDetails = $derived(
		layout === EntityLayout.Details
		|| layout === EntityLayout.SummaryDetails
		|| (
			(layout === undefined || layout === EntityLayout.Summary)
			&& open
		),
	)

	const marketPriceReferenceQuery = useLiveQuery(
		(queryBuilder) => (
			shouldMountDetails ?
				queryBuilder
					.from({ row: entityFieldCollections[EntityType.Coin].$$marketPrice })
					.where(({ row }) => (
						eq(
							row[EntityMetaKey.ParentIdKey],
							coinIdKey,
						)
					))
					.select(({ row }) => (
						{ value: row[EntityMetaKey.Value] }
					))
					.distinct()
			:
				queryBuilder
					.from({ row: entityFieldCollections[EntityType.Coin].$$marketPrice })
					.orderBy(({ row }) => (
						row[EntityMetaKey.ParentIdKey]
					), 'asc')
					.limit(0)
					.select(({ row }) => (
						{ value: row[EntityMetaKey.Value] }
					))
		),
		[
			() => coinIdKey,
			() => shouldMountDetails,
		],
	)

	const marketPriceId = $derived(
		marketPriceReferenceQuery.data?.[0]?.value[EntityMetaKey.Id],
	)

	const spotPriceEntityId = $derived(
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
			} as const,
		},
	)

	const coinPlaceholderText = 'Loading coin…'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import CoinInstancesView from '$/views/CoinInstancesView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketPriceView from '$/views/MarketPriceView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.Coin}
	{entityId}
	{href}
	{layout}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Coin id</dt>
				<dd>{entityId.coinId}</dd>
			</div>
			{#if coinQuery.data?.symbol != null && coinQuery.data.symbol !== displayTitle}
				<div>
					<dt>Symbol</dt>
					<dd>{coinQuery.data.symbol}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Coin}
			{entityId}
		>
			<QueryBoundary
				placeholderText={coinPlaceholderText}
				query={coinQuery}
			>
				{#snippet children(_coin)}
					{#if _coin == null}
						<p data-text="muted">
							No coin metadata for this id yet.
						</p>
					{:else}
						<dl>
							{#if coinQuery.data?.name != null}
								<div>
									<dt>Name</dt>
									<dd>{coinQuery.data?.name}</dd>
								</div>
							{/if}
							{#if coinQuery.data?.decimals != null}
								<div>
									<dt>Decimals</dt>
									<dd>{String(coinQuery.data.decimals)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${coinIdKey}:carousel-pricing`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _open,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<Heading>
							Price
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="Spot">
							<MarketPriceView
								entityId={marketPriceId ?? spotPriceEntityId}
								href={coinHref}
								id={`${coinIdKey}:price`}
								layout={EntityLayout.Summary}
								open={false}
							/>
						</section>

						<section data-scroll-marker-label="Historical">
							<MarketPriceRangesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Coin,
									entityId,
									fieldName: '$$marketPriceRanges',
								}}
								href={coinHref}
								id={`${coinIdKey}:market-price-ranges`}
								title="Historical"
							/>
						</section>
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${coinIdKey}:carousel-markets`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _open,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<Heading>
							Markets
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
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
								id={`${coinIdKey}:markets-as-base`}
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
								id={`${coinIdKey}:markets-as-quote`}
								title="As quote"
							/>
						</section>
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${coinIdKey}:carousel-deployments`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _open,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<Heading>
							Instances
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
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
								id={`${coinIdKey}:coin-instances`}
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
