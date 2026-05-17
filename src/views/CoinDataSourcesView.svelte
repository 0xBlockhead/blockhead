<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'


	// Props
	let { id }: { id: string } = $props()


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
</script>


<div
	data-column="gap-3"
>
	<div
		data-scroll-container="inline layout-carousel carousel-marker-tabs"
		style="--carousel-basis: 38ch"
	>
		<div
			data-carousel-panes=""
			style="gap: 0.5em"
		>
		<section
			data-scroll-marker-label="Dune (billing)"
		>
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
							<ResourceBoundary resource={globalDuneBilling}>
								{#snippet children(g)}
									<div>
										<dt>Credits used</dt>
										<dd>{String(g.duneCreditsUsed)}</dd>
									</div>
								{/snippet}
							</ResourceBoundary>
							<ResourceBoundary resource={globalDuneBilling}>
								{#snippet children(g)}
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

		<section
					data-scroll-marker-label="Constants (internal)"
				>
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

				<section
					data-scroll-marker-label="CoinGecko (REST)"
				>
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

				<section
					data-scroll-marker-label="CoinMarketCap (REST)"
				>
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

				<section
					data-scroll-marker-label="CoinPaprika (OpenAPI)"
				>
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

				<section
					data-scroll-marker-label="DeFi Llama (REST)"
				>
					<EntitiesList
						collapsible={false}
						entityType={EntityType._Global}
						href={resolve('/coins')}
						id={`${id}:source-llama`}
						title="DeFi Llama (REST)"
					>
						{#snippet body()}
							<div
								class="entity-details"
								style:view-transition-name={`CoinDataSources-Defillama-${id}`}
							>
								<p>
									<cite>{Source.Defillama_Rest}</cite>
									—
									<code>resolvers/Defillama-Rest.ts</code>
									: global
									<code>$$marketPrices</code>
									and
									<code>EntityType.MarketPrice</code>
									via
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
		</div>
	</div>
</div>


<style>
	.entity-details {
		display: contents;
	}
</style>
