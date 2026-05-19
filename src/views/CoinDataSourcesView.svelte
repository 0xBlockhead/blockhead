<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { id }: { id: string } = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const globalDuneBilling = useEntity(
		EntityType._Global,
		{},
		{
			$: [
				Source.Local_Internal,
				Source.Dune_Rest,
			],
			duneCreditsUsed: {},
			duneCreditsIncluded: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<div
	class="coin-data-sources-carousels"
	data-column="gap-3"
>
	<CollapsibleTabs
		id={`${id}:carousel-sources`}
		{...{ 'data-card': '' }}
		scrollContainerProps={{
			'data-row': 'start align-start',
			style: '--carousel-basis: 38ch; gap: 0.5em',
		}}
	>
		{#snippet Summary({ open: _isOpen })}
			<header
				data-row-item="flexible"
				data-row="wrap gap-4 align-center"
			>
				<HeadingComponent>
					Providers
				</HeadingComponent>
				<Tooltip contentProps={{ side: 'top' }}>
					{#snippet Content()}
						<p>
							Each section names the HTTP API family feeding one slice of coin data—catalog identity, on-chain deployments, traded pools, or timestamped fundamentals—so catalog ids stay traceable to a specific vendor transport.
						</p>
					{/snippet}
					<abbr
						class="entity-heading-tip"
						aria-label="Provider provenance"
					>ⓘ</abbr>
				</Tooltip>
			</header>
		{/snippet}

		{#snippet Markers({ open: _markersOpen })}
			<a
				data-scroll-marker-label="Dune (billing)"
				href={`#${id}:source-dune-billing`}
			>Dune (billing)</a>
			<a
				data-scroll-marker-label="Constants (internal)"
				href={`#${id}:source-constants`}
			>Constants</a>
			<a
				data-scroll-marker-label="CoinGecko (REST)"
				href={`#${id}:source-coingecko`}
			>CoinGecko</a>
			<a
				data-scroll-marker-label="CoinMarketCap (REST)"
				href={`#${id}:source-cmc`}
			>CoinMarketCap</a>
			<a
				data-scroll-marker-label="CoinPaprika (OpenAPI)"
				href={`#${id}:source-paprika`}
			>CoinPaprika</a>
			<a
				data-scroll-marker-label="DeFi Llama (REST)"
				href={`#${id}:source-llama`}
			>DeFi Llama</a>
		{/snippet}

		{#snippet children(_childrenContext)}
			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType._Global}
					href={resolve('/coins')}
					id={`${id}:source-dune-billing`}
					title="Dune API billing"
				>
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name={`CoinDataSources-DuneBilling-${id}`}
						>
							<p>
								<cite>{Source.Dune_Rest}</cite>
								—
								global billing counters via
								<code>duneCreditsUsed</code>
								and
								<code>duneCreditsIncluded</code>
								on
								<code>EntityType._Global</code>
								(
								<code>resolvers/Dune-Rest.ts</code>
								).
							</p>
							<dl>
								<ResourceBoundary
									resource={globalDuneBilling}
									placeholderText="Loading billing…"
								>
									{#snippet children(g)}
										<div>
											<dt>Credits used</dt>
											<dd>{String(g.duneCreditsUsed)}</dd>
										</div>
										<div>
											<dt>Credits included</dt>
											<dd>{String(g.duneCreditsIncluded)}</dd>
										</div>
									{/snippet}
								</ResourceBoundary>
							</dl>
						</div>
					{/snippet}
				</EntitiesList>
			</section>

			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType._Global}
					href={resolve('/coins')}
					id={`${id}:source-constants`}
					title="Constants (internal)"
				>
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name={`CoinDataSources-Constants-${id}`}
						>
							<p>
								<cite>{Source.Constants_Internal}</cite>
								— seeds global
								<code>$$coins</code>
								and
								<code>$$marketPrices</code>
								(quote list pointers)
								from
								<code>constants/Coin.ts</code>
								; also supplies network execution endpoint overlays for
								<code>EntityType.Network</code>
								in
								<code>resolvers/Constants.ts</code>
								.
							</p>
						</div>
					{/snippet}
				</EntitiesList>
			</section>

			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType._Global}
					href={resolve('/coins')}
					id={`${id}:source-coingecko`}
					title="CoinGecko (REST)"
				>
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name={`CoinDataSources-Coingecko-${id}`}
						>
							<p>
								<cite>{Source.Coingecko_Rest}</cite>
								—
								<code>resolvers/Coingecko-Rest.ts</code>
								: global
								<code>$$coins</code>
								,
								<code>$$marketPrices</code>
								(spot
								<code>Market price</code>
								)
								,
								<code>$$marketPriceRanges</code>
								(
								<code>GET /coins/…/ohlc</code>
								)
								; entity
								<code>EntityType.Coin</code>
								; per-chain
								<code>EntityType.CoinInstance</code>
								(
								deployments
								)
								.
							</p>
						</div>
					{/snippet}
				</EntitiesList>
			</section>

			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType._Global}
					href={resolve('/coins')}
					id={`${id}:source-cmc`}
					title="CoinMarketCap (REST)"
				>
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name={`CoinDataSources-Cmc-${id}`}
						>
							<p>
								<cite>{Source.CoinMarketCap_Rest}</cite>
								—
								<code>resolvers/CoinMarketCap-Rest.ts</code>
								: list wiring, CMC info for
								<code>EntityType.Coin</code>
								, and
								<code>EntityType.MarketPrice</code>
								USD rows.
							</p>
						</div>
					{/snippet}
				</EntitiesList>
			</section>

			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType._Global}
					href={resolve('/coins')}
					id={`${id}:source-paprika`}
					title="CoinPaprika (OpenAPI)"
				>
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name={`CoinDataSources-Paprika-${id}`}
						>
							<p>
								<cite>{Source.Coinpaprika_OpenApi}</cite>
								—
								<code>resolvers/Coinpaprika-OpenApi.ts</code>
								: list wiring, markets, and
								<code>EntityType.MarketPrice</code>
								rows from tickers.
							</p>
						</div>
					{/snippet}
				</EntitiesList>
			</section>

			<section>
				<EntitiesList
					collapsible={false}
					entityType={EntityType._Global}
					href={resolve('/coins')}
					id={`${id}:source-llama`}
					title="DeFi Llama (OpenAPI)"
				>
					{#snippet body()}
						<div
							class="entity-details"
							style:view-transition-name={`CoinDataSources-Defillama-${id}`}
						>
							<p>
								<cite>{Source.Defillama_OpenApi}</cite>
								—
								<code>resolvers/Defillama-OpenApi.ts</code>
								: global
								<code>$$marketPrices</code>
								and
								<code>EntityType.MarketPrice</code>
								via
								<code>sources/Defillama/OpenApi/queries.ts</code>
								+
								<code>sources/Defillama/Rest/constants.ts</code>
								(
								<code>defillamaCurrentPriceIdByCoinId</code>
								)
								.
							</p>
						</div>
					{/snippet}
				</EntitiesList>
			</section>
		{/snippet}
	</CollapsibleTabs>
</div>


<style>
	.entity-details {
		display: contents;
	}

	.coin-data-sources-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
