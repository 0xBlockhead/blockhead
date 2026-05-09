<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { MarketAssetKind } from '$/constants/Market.ts'
	import { marketVenueById } from '$/constants/MarketVenue.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { stringify } from 'devalue'


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

	// (Derived)
	const marketIdKey = $derived(
		stringify(entityId),
	)

	const baseLabel = $derived(
		(() => {
			const b = entityId.$base
			if (b.kind === MarketAssetKind.Coin) {
				return b.$coin.coinId
			}
			if (b.kind === MarketAssetKind.CoinInstance) {
				return `instance ${stringify(b.$coinInstance)}`
			}
			return b.iso4217
		})(),
	)

	const quoteLabel = $derived(
		(() => {
			const q = entityId.$quote
			if (q.kind === MarketAssetKind.Coin) {
				return q.$coin.coinId
			}
			if (q.kind === MarketAssetKind.CoinInstance) {
				return `instance ${stringify(q.$coinInstance)}`
			}
			return q.iso4217
		})(),
	)

	const displayTitle = $derived(
		`${baseLabel} / ${quoteLabel} · ${marketVenueById[entityId.$marketVenue.marketVenueId].label}`,
	)

	const baseCoinId = $derived(
		entityId.$base.kind === MarketAssetKind.Coin ?
			entityId.$base.$coin.coinId
		:	undefined,
	)

	const baseCoinCatalogHref = $derived(
		baseCoinId === undefined ?
			undefined
		:	(
			resolve(
				'/(assets)/(coins)/coin/[coinId]',
				{ coinId: baseCoinId },
			)
		),
	)

	const marketQuery = useEntity(
		EntityType.Market,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Defillama_Rest,
				Source.Dexscreener_OpenApi,
			],
			$$baseCoin: {},
		},
	)

	const firstCatalogBaseCoin = $derived(
		marketQuery.data?.$$baseCoin?.[EntityMetaKey.Id],
	)

	const showCatalogBaseSection = $derived(
		entityId.$base.kind === MarketAssetKind.Coin,
	)

	const showCatalogBaseCoin = $derived(
		firstCatalogBaseCoin !== undefined,
	)

	const marketPlaceholderText = 'Loading market…'


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import CoinView from '$/views/CoinView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import MarketPriceRangesView from '$/views/MarketPriceRangesView.svelte'
	import MarketPricesView from '$/views/MarketPricesView.svelte'
</script>


<EntityView
	entityType={EntityType.Market}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Venue</dt>
				<dd>{marketVenueById[entityId.$marketVenue.marketVenueId].label}</dd>
			</div>
			<div>
				<dt>Base</dt>
				<dd>{baseLabel}</dd>
			</div>
			<div>
				<dt>Quote</dt>
				<dd>{quoteLabel}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Market}
			{entityId}
		>
			<QueryBoundary
				placeholderText={marketPlaceholderText}
				query={marketQuery}
			>
				{#snippet children(_market)}
					{#if marketQuery.data === undefined}
						<p data-text="muted">
							No market metadata yet.
						</p>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${marketIdKey}:carousel-assets`}
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
							Assets
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="Base">
							{#if entityId.$base.kind === MarketAssetKind.Coin}
								<CoinView
									entityId={entityId.$base.$coin}
									href={resolve(
										'/(assets)/(coins)/coin/[coinId]',
										{ coinId: entityId.$base.$coin.coinId },
									)}
									id={`${marketIdKey}:leg-base-coin`}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{:else if entityId.$base.kind === MarketAssetKind.CoinInstance}
								<CoinInstanceView
									entityId={entityId.$base.$coinInstance}
									{href}
									id={`${marketIdKey}:leg-base-instance`}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{:else}
								<p>{entityId.$base.iso4217}</p>
							{/if}
						</section>

						<section data-scroll-marker-label="Quote">
							{#if entityId.$quote.kind === MarketAssetKind.Coin}
								<CoinView
									entityId={entityId.$quote.$coin}
									href={resolve(
										'/(assets)/(coins)/coin/[coinId]',
										{ coinId: entityId.$quote.$coin.coinId },
									)}
									id={`${marketIdKey}:leg-quote-coin`}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{:else if entityId.$quote.kind === MarketAssetKind.CoinInstance}
								<CoinInstanceView
									entityId={entityId.$quote.$coinInstance}
									{href}
									id={`${marketIdKey}:leg-quote-instance`}
									layout={EntityLayout.Summary}
									open={false}
								/>
							{:else}
								<p>{entityId.$quote.iso4217}</p>
							{/if}
						</section>

						{#if showCatalogBaseSection}
							<section data-scroll-marker-label="Catalog base">
								<QueryBoundary
									placeholderText={marketPlaceholderText}
									query={marketQuery}
								>
									{#snippet children(_market)}
										{#if showCatalogBaseCoin}
											<CoinView
												entityId={{
													coinId: firstCatalogBaseCoin.coinId,
												}}
												href={resolve(
													'/(assets)/(coins)/coin/[coinId]',
													{ coinId: firstCatalogBaseCoin.coinId },
												)}
												id={`${marketIdKey}:catalog-base`}
												layout={EntityLayout.Summary}
												open={false}
											/>
										{:else}
											<p data-text="muted">
												No catalog base coin yet.
											</p>
										{/if}
									{/snippet}
								</QueryBoundary>
							</section>
						{/if}
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${marketIdKey}:carousel-pricing`}
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
							Pricing
						</Heading>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="Prices">
							<MarketPricesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Market,
									entityId,
									fieldName: '$$marketPrices',
								}}
								href={baseCoinCatalogHref ?? href}
								id={`${marketIdKey}:market-prices`}
								title="Prices"
							/>
						</section>

						<section data-scroll-marker-label="OHLC">
							<MarketPriceRangesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.Market,
									entityId,
									fieldName: '$$marketPriceRanges',
								}}
								href={baseCoinCatalogHref ?? href}
								id={`${marketIdKey}:market-price-ranges`}
								title="OHLC"
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
